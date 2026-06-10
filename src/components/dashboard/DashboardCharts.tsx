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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { CategorySummary } from "@/types";

interface DashboardChartsProps {
  categories: CategorySummary[];
}

export const DashboardCharts = ({ categories }: DashboardChartsProps) => {
  const categoriesWithTotal = categories.filter((category) => category.total > 0);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Gastos por categoria</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {categoriesWithTotal.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoriesWithTotal} dataKey="total" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                  {categoriesWithTotal.map((category) => (
                    <Cell key={category.id} fill={category.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#111", border: "1px solid #1E1E1E" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Nenhum gasto cadastrado.</div>
          )}
        </CardContent>
      </Card>
      <Card className="border-border bg-card xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Evolução mensal</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Nenhum histórico mensal cadastrado.</div>
        </CardContent>
      </Card>
      <Card className="border-border bg-card xl:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Categorias mais caras</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {categoriesWithTotal.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesWithTotal}>
                <CartesianGrid stroke="#1E1E1E" vertical={false} />
                <XAxis dataKey="name" stroke="#A1A1AA" />
                <YAxis stroke="#A1A1AA" tickFormatter={(value) => `R$${Number(value)}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#111", border: "1px solid #1E1E1E" }} />
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
