"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { demoCategories, monthlyEvolution } from "@/services/mock-data";

export const DashboardCharts = () => {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Gastos por categoria</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={demoCategories} dataKey="total" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                {demoCategories.map((category) => (
                  <Cell key={category.id} fill={category.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#111", border: "1px solid #1E1E1E" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-border bg-card xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Evolução mensal</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyEvolution}>
              <CartesianGrid stroke="#1E1E1E" vertical={false} />
              <XAxis dataKey="month" stroke="#A1A1AA" />
              <YAxis stroke="#A1A1AA" tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#111", border: "1px solid #1E1E1E" }} />
              <Line type="monotone" dataKey="total" stroke="#336EBB" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-border bg-card xl:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Categorias mais caras</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demoCategories}>
              <CartesianGrid stroke="#1E1E1E" vertical={false} />
              <XAxis dataKey="name" stroke="#A1A1AA" />
              <YAxis stroke="#A1A1AA" tickFormatter={(value) => `R$${Number(value)}`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#111", border: "1px solid #1E1E1E" }} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {demoCategories.map((category) => (
                  <Cell key={category.id} fill={category.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
