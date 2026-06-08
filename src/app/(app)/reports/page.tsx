import { PageHeader } from "@/components/shared/PageHeader";
import { ReportsClient } from "@/components/reports/ReportsClient";

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Relatórios" description="Filtre por mês, ano e categoria, acompanhe evolução dos gastos e exporte seus dados." />
      <ReportsClient />
    </>
  );
}
