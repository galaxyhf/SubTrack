"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { CategorySummary } from "@/types";

interface DashboardChartsProps {
  categories: CategorySummary[];
}

const CategoryTooltip = ({ active, payload }: TooltipContentProps) => {
  if (!active || !payload.length) return null;

  const item = payload[0]?.payload as CategorySummary | undefined;
  const color = item?.color ?? payload[0]?.color ?? "#A1A1AA";

  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md" style={{ borderColor: color }}>
      <div className="mb-1 flex items-center gap-2 font-medium text-popover-foreground">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
        {item?.name ?? payload[0]?.name}
      </div>
      <p className="text-muted-foreground">Total: {formatCurrency(Number(payload[0]?.value ?? 0))}</p>
    </div>
  );
};

export const DashboardCharts = ({ categories }: DashboardChartsProps) => {
  const categoriesWithTotal = categories.filter((category) => category.total > 0);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-3">
      <Card className="min-w-0 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Gastos por categoria</CardTitle>
        </CardHeader>
        <CardContent className="h-72 min-h-72 min-w-0">
          {categoriesWithTotal.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoriesWithTotal} dataKey="total" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                  {categoriesWithTotal.map((category) => (
                    <Cell key={category.id} fill={category.color} />
                  ))}
                </Pie>
                <Tooltip content={(props) => <CategoryTooltip {...props} />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Nenhum gasto cadastrado.</div>
          )}
        </CardContent>
      </Card>
      <Card className="min-w-0 border-border bg-card xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Evolução mensal</CardTitle>
        </CardHeader>
        <CardContent className="h-72 min-h-72 min-w-0">
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Nenhum histórico mensal cadastrado.</div>
        </CardContent>
      </Card>
      <Card className="min-w-0 border-border bg-card xl:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Categorias mais caras</CardTitle>
        </CardHeader>
        <CardContent className="h-80 min-h-80 min-w-0">
          {categoriesWithTotal.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesWithTotal}>
                <CartesianGrid stroke="#1E1E1E" vertical={false} />
                <XAxis dataKey="name" stroke="#A1A1AA" />
                <YAxis stroke="#A1A1AA" tickFormatter={(value) => `R$${Number(value)}`} />
                <Tooltip content={(props) => <CategoryTooltip {...props} />} cursor={false} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {categoriesWithTotal.map((category) => (
                    <Cell key={category.id} fill={category.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Nenhuma categoria com gasto cadastrado.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
