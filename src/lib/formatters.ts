import type { BillingCycle } from "@/types";

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatDate = (value: string | Date) => dateFormatter.format(new Date(value));

export const billingCycleLabels: Record<BillingCycle, string> = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  yearly: "Anual",
};

export const getMonthlyValue = (price: number, billingCycle: BillingCycle) => {
  const divisorByCycle: Record<BillingCycle, number> = {
    monthly: 1,
    quarterly: 3,
    semiannual: 6,
    yearly: 12,
  };

  return price / divisorByCycle[billingCycle];
};
