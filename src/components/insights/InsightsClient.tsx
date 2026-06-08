"use client";

import { useMemo, useState } from "react";
import { Lightbulb, PiggyBank, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getMonthlyValue } from "@/lib/formatters";
import { calculateDemoMetrics, demoCategories, demoSubscriptions } from "@/services/mock-data";

export const InsightsClient = () => {
  const metrics = calculateDemoMetrics();
  const [selected, setSelected] = useState<string[]>([]);
  const mostExpensiveCategory = [...demoCategories].sort((first, second) => second.total - first.total)[0];
  const mostExpensiveSubscription = [...demoSubscriptions].sort((first, second) => second.price - first.price)[0];
  const selectedSubscriptions = demoSubscriptions.filter((subscription) => selected.includes(subscription.id));
  const monthlySavings = useMemo(
    () => selectedSubscriptions.reduce((sum, item) => sum + getMonthlyValue(item.price, item.billingCycle), 0),
    [selectedSubscriptions],
  );

  const toggle = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="size-4 text-primary" />
              Categoria dominante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{mostExpensiveCategory.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(mostExpensiveCategory.total)} por mês</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PiggyBank className="size-4 text-primary" />
              Total anual projetado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(metrics.totalAnnual)}</p>
            <p className="mt-1 text-sm text-muted-foreground">Com base nas assinaturas ativas.</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingDown className="size-4 text-primary" />
              Tendência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-[#F59E0B]">+3,8%</p>
            <p className="mt-1 text-sm text-muted-foreground">Aumento moderado nos últimos 3 meses.</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Simulador de economia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoSubscriptions.map((subscription) => (
              <label key={subscription.id} className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-3">
                <span className="flex items-center gap-3">
                  <Checkbox checked={selected.includes(subscription.id)} onCheckedChange={() => toggle(subscription.id)} />
                  <span>
                    <span className="block text-sm font-medium">{subscription.name}</span>
                    <span className="text-xs text-muted-foreground">{subscription.category}</span>
                  </span>
                </span>
                <span className="text-sm font-semibold">{formatCurrency(getMonthlyValue(subscription.price, subscription.billingCycle))}/mês</span>
              </label>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Resultado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Economia mensal</p>
              <p className="text-2xl font-semibold">{formatCurrency(monthlySavings)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Economia anual</p>
              <p className="text-2xl font-semibold">{formatCurrency(monthlySavings * 12)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Economia em 5 anos</p>
              <p className="text-2xl font-semibold">{formatCurrency(monthlySavings * 60)}</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              Recomendação: revise {mostExpensiveSubscription.name}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
