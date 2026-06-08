import type { CategorySummary, DashboardMetrics, SubscriptionView } from "@/types";
import { getMonthlyValue } from "@/lib/formatters";

export const demoCategories: CategorySummary[] = [
  { id: "11111111-1111-4111-8111-111111111111", name: "Streaming", color: "#336EBB", icon: "Tv", total: 165.7 },
  { id: "22222222-2222-4222-8222-222222222222", name: "Moradia", color: "#22C55E", icon: "Home", total: 3420 },
  { id: "33333333-3333-4333-8333-333333333333", name: "Serviços", color: "#F59E0B", icon: "Wrench", total: 329.9 },
  { id: "44444444-4444-4444-8444-444444444444", name: "Saúde", color: "#EF4444", icon: "HeartPulse", total: 189.9 },
  { id: "55555555-5555-4555-8555-555555555555", name: "Educação", color: "#8B5CF6", icon: "GraduationCap", total: 89.9 },
];

export const demoSubscriptions: SubscriptionView[] = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    name: "Netflix",
    description: "Plano premium familiar",
    categoryId: demoCategories[0].id,
    category: "Streaming",
    categoryColor: "#336EBB",
    price: 59.9,
    billingCycle: "monthly",
    nextPaymentDate: "2026-06-12",
    status: "active",
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    name: "Aluguel",
    description: "Apartamento",
    categoryId: demoCategories[1].id,
    category: "Moradia",
    categoryColor: "#22C55E",
    price: 2800,
    billingCycle: "monthly",
    nextPaymentDate: "2026-06-10",
    status: "active",
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    name: "Internet Fibra",
    description: "600 Mbps",
    categoryId: demoCategories[2].id,
    category: "Serviços",
    categoryColor: "#F59E0B",
    price: 129.9,
    billingCycle: "monthly",
    nextPaymentDate: "2026-06-18",
    status: "active",
  },
  {
    id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    name: "Academia",
    description: "Plano anual",
    categoryId: demoCategories[3].id,
    category: "Saúde",
    categoryColor: "#EF4444",
    price: 189.9,
    billingCycle: "monthly",
    nextPaymentDate: "2026-06-22",
    status: "active",
  },
  {
    id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    name: "Curso Inglês",
    description: "Aulas online",
    categoryId: demoCategories[4].id,
    category: "Educação",
    categoryColor: "#8B5CF6",
    price: 89.9,
    billingCycle: "monthly",
    nextPaymentDate: "2026-06-25",
    status: "canceled",
  },
  {
    id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
    name: "Amazon Prime",
    description: "Assinatura anual",
    categoryId: demoCategories[0].id,
    category: "Streaming",
    categoryColor: "#336EBB",
    price: 166.8,
    billingCycle: "yearly",
    nextPaymentDate: "2026-09-01",
    status: "active",
  },
];

export const monthlyEvolution = [
  { month: "Jan", total: 3668 },
  { month: "Fev", total: 3712 },
  { month: "Mar", total: 3830 },
  { month: "Abr", total: 3895 },
  { month: "Mai", total: 3978 },
  { month: "Jun", total: 4130 },
];

export const calculateDemoMetrics = (): DashboardMetrics => {
  const active = demoSubscriptions.filter((subscription) => subscription.status === "active");
  const canceled = demoSubscriptions.filter((subscription) => subscription.status === "canceled");
  const totalMonthly = active.reduce((total, subscription) => total + getMonthlyValue(subscription.price, subscription.billingCycle), 0);
  const annualSavings = canceled.reduce((total, subscription) => total + getMonthlyValue(subscription.price, subscription.billingCycle) * 12, 0);

  return {
    totalMonthly,
    totalAnnual: totalMonthly * 12,
    averageMonthly: totalMonthly,
    activeSubscriptions: active.length,
    canceledSubscriptions: canceled.length,
    annualSavings,
    nextDue: active.sort((first, second) => first.nextPaymentDate.localeCompare(second.nextPaymentDate))[0] ?? null,
  };
};
