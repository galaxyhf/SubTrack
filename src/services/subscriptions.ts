import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, notificationPreferences, subscriptions } from "@/db/schema";
import { getMonthlyValue } from "@/lib/formatters";
import type { NotificationPreferencesInput } from "@/schemas/subscription";
import type { CategorySummary, DashboardMetrics, SubscriptionView } from "@/types";

const formatDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getUserCategories = async (userId: string): Promise<CategorySummary[]> => {
  const rows = await getDb()
    .select({
      id: categories.id,
      name: categories.name,
      color: categories.color,
    })
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(asc(categories.name));

  return rows.map((category) => ({ ...category, total: 0 }));
};

export const getUserNotificationPreferences = async (userId: string): Promise<NotificationPreferencesInput> => {
  const rows = await getDb()
    .select({
      notify7Days: notificationPreferences.notify7Days,
      notify3Days: notificationPreferences.notify3Days,
      notify1Day: notificationPreferences.notify1Day,
      notifyDueDay: notificationPreferences.notifyDueDay,
    })
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))
    .limit(1);

  return rows[0] ?? {
    notify7Days: true,
    notify3Days: true,
    notify1Day: true,
    notifyDueDay: true,
  };
};

export const getUserSubscriptions = async (userId: string): Promise<SubscriptionView[]> => {
  const rows = await getDb()
    .select({
      id: subscriptions.id,
      name: subscriptions.name,
      description: subscriptions.description,
      categoryId: subscriptions.categoryId,
      category: categories.name,
      categoryColor: categories.color,
      price: subscriptions.price,
      billingCycle: subscriptions.billingCycle,
      nextPaymentDate: subscriptions.nextPaymentDate,
      status: subscriptions.status,
    })
    .from(subscriptions)
    .innerJoin(categories, eq(subscriptions.categoryId, categories.id))
    .where(eq(subscriptions.userId, userId))
    .orderBy(asc(subscriptions.nextPaymentDate));

  return rows.map((subscription) => ({
    ...subscription,
    description: subscription.description ?? "",
    price: Number(subscription.price),
    nextPaymentDate: formatDateKey(subscription.nextPaymentDate),
  }));
};

export const calculateSubscriptionMetrics = (subscriptionsList: SubscriptionView[]): DashboardMetrics => {
  const active = subscriptionsList.filter((subscription) => subscription.status === "active");
  const canceled = subscriptionsList.filter((subscription) => subscription.status === "canceled");
  const totalMonthly = active.reduce((total, subscription) => total + getMonthlyValue(subscription.price, subscription.billingCycle), 0);
  const annualSavings = canceled.reduce((total, subscription) => total + getMonthlyValue(subscription.price, subscription.billingCycle) * 12, 0);

  return {
    totalMonthly,
    totalAnnual: totalMonthly * 12,
    averageMonthly: active.length > 0 ? totalMonthly / active.length : 0,
    activeSubscriptions: active.length,
    canceledSubscriptions: canceled.length,
    annualSavings,
    nextDue: active.toSorted((first, second) => first.nextPaymentDate.localeCompare(second.nextPaymentDate))[0] ?? null,
  };
};

export const calculateCategorySummaries = (
  categoriesList: CategorySummary[],
  subscriptionsList: SubscriptionView[],
): CategorySummary[] => {
  return categoriesList.map((category) => ({
    ...category,
    total: subscriptionsList
      .filter((subscription) => subscription.categoryId === category.id && subscription.status === "active")
      .reduce((total, subscription) => total + getMonthlyValue(subscription.price, subscription.billingCycle), 0),
  }));
};
