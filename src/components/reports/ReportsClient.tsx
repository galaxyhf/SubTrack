"use client";

import { useMemo, useState } from "react";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { formatCurrency } from "@/lib/formatters";
import { calculateCategorySummaries } from "@/services/subscriptions";
import type { CategorySummary, SubscriptionView } from "@/types";

interface ReportsClientProps {
  categories: CategorySummary[];
  subscriptions: SubscriptionView[];
}

export const ReportsClient = ({ categories, subscriptions }: ReportsClientProps) => {
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(currentDate.getFullYear()));
  const [category, setCategory] = useState("all");
  const filtered = useMemo(
    () =>
      subscriptions
        .filter((subscription) => subscription.nextPaymentDate.startsWith(`${year}-${month}`))
        .filter((subscription) => (category === "all" ? true : subscription.categoryId === category)),
    [category, month, subscriptions, year],
  );
  const total = filtered.reduce((sum, item) => sum + item.price, 0);
  const mostExpensiveSubscription = [...filtered].sort((first, second) => second.price - first.price)[0];
  const categorySummaries = calculateCategorySummaries(categories, filtered);
  const mostExpensiveCategory = [...categorySummaries].sort((first, second) => second.total - first.total)[0];

  const rows = filtered.map((item) => ({
    Nome: item.name,
    Categoria: item.category,
    Valor: item.price,
    Frequencia: item.billingCycle,
    Status: item.status,
  }));

  const exportCsv = () => {
    const csv = [Object.keys(rows[0] ?? {}).join(","), ...rows.map((row) => Object.values(row).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `subtrack-${month}-${year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportXlsx = () => {
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(rows);
    utils.book_append_sheet(workbook, worksheet, "Relatorio");
    writeFile(workbook, `subtrack-${month}-${year}.xlsx`);
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.text("Relatório SubTrack", 14, 16);
    autoTable(doc, {
      head: [["Nome", "Categoria", "Valor", "Frequência", "Status"]],
      body: rows.map((row) => [row.Nome, row.Categoria, formatCurrency(row.Valor), row.Frequencia, row.Status]),
      startY: 24,
    });
    doc.save(`subtrack-${month}-${year}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[140px_140px_220px_1fr]">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[String(currentDate.getFullYear()), String(currentDate.getFullYear() - 1), String(currentDate.getFullYear() - 2)].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={exportCsv}>
            <Download className="size-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={exportXlsx}>
            <Download className="size-4" />
            XLSX
          </Button>
          <Button variant="outline" onClick={exportPdf}>
            <Download className="size-4" />
            PDF
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm">Total gasto</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatCurrency(total)}</CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm">Média mensal</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatCurrency(total)}</CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm">Categoria mais cara</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{mostExpensiveCategory?.total ? mostExpensiveCategory.name : "-"}</CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm">Assinatura mais cara</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{mostExpensiveSubscription?.name ?? "-"}</CardContent>
        </Card>
      </div>
      <DashboardCharts categories={categorySummaries} />
    </div>
  );
};
