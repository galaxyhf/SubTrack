export type BillingCycle = "monthly" | "quarterly" | "semiannual" | "yearly";
export type SubscriptionStatus = "active" | "canceled";
export type PaymentStatus = "paid" | "pending" | "overdue";
export type EmailReminderType = "reminder_7_days" | "reminder_3_days" | "reminder_1_day" | "due_today" | "overdue";

export interface CategorySummary {
  id: string;
  name: string;
  color: string;
  icon: string;
  total: number;
}

export interface SubscriptionView {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category: string;
  categoryColor: string;
  price: number;
  billingCycle: BillingCycle;
  nextPaymentDate: string;
  status: SubscriptionStatus;
}

export interface DashboardMetrics {
  totalMonthly: number;
  totalAnnual: number;
  averageMonthly: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  annualSavings: number;
  nextDue: SubscriptionView | null;
}
