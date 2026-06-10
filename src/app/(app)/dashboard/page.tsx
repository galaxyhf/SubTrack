import { CalendarClock, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { requireUser } from "@/lib/auth-utils";
import {
  calculateCategorySummaries,
  calculateSubscriptionMetrics,
  getUserCategories,
  getUserSubscriptions,
} from "@/services/subscriptions";

export default async function DashboardPage() {
  const user = await requireUser();
  const [categories, subscriptions] = await Promise.all([getUserCategories(user.id), getUserSubscriptions(user.id)]);
  const categorySummaries = calculateCategorySummaries(categories, subscriptions);
  const metrics = calculateSubscriptionMetrics(subscriptions);
  const upcoming = subscriptions
    .filter((subscription) => subscription.status === "active")
    .sort((first, second) => first.nextPaymentDate.localeCompare(second.nextPaymentDate))
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão executiva dos gastos fixos, vencimentos e impacto anual das suas assinaturas."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total gasto por mês" value={formatCurrency(metrics.totalMonthly)} description="Base recorrente ativa" icon={DollarSign} />
        <MetricCard title="Total gasto por ano" value={formatCurrency(metrics.totalAnnual)} description="Projeção de 12 meses" icon={TrendingUp} />
        <MetricCard title="Assinaturas ativas" value={String(metrics.activeSubscriptions)} description="Serviços em cobrança" icon={CreditCard} />
        <MetricCard
          title="Próximo vencimento"
          value={metrics.nextDue ? formatDate(metrics.nextDue.nextPaymentDate) : "-"}
          description={metrics.nextDue?.name ?? "Nenhum vencimento"}
          icon={CalendarClock}
        />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_360px]">
        <DashboardCharts categories={categorySummaries} />
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Próximos vencimentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum vencimento cadastrado.</p> : null}
            {upcoming.map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-3">
                <div>
                  <p className="text-sm font-medium">{subscription.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(subscription.nextPaymentDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(subscription.price)}</p>
                  <Badge variant="outline" className="mt-1 border-border">
                    {subscription.category}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
