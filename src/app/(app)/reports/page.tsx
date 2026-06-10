import { PageHeader } from "@/components/shared/PageHeader";
import { ReportsClient } from "@/components/reports/ReportsClient";
import { requireUser } from "@/lib/auth-utils";
import { getUserCategories, getUserSubscriptions } from "@/services/subscriptions";

export default async function ReportsPage() {
  const user = await requireUser();
  const [categories, subscriptions] = await Promise.all([getUserCategories(user.id), getUserSubscriptions(user.id)]);

  return (
    <>
      <PageHeader title="Relatórios" description="Filtre por mês, ano e categoria, acompanhe evolução dos gastos e exporte seus dados." />
      <ReportsClient categories={categories} subscriptions={subscriptions} />
    </>
  );
}
