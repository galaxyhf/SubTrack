import { InsightsClient } from "@/components/insights/InsightsClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth-utils";
import { getUserCategories, getUserSubscriptions } from "@/services/subscriptions";

export default async function InsightsPage() {
  const user = await requireUser();
  const [categories, subscriptions] = await Promise.all([getUserCategories(user.id), getUserSubscriptions(user.id)]);

  return (
    <>
      <PageHeader
        title="Insights financeiros"
        description="Identifique gastos concentrados, assinatura mais cara, tendência e economia potencial."
      />
      <InsightsClient categories={categories} subscriptions={subscriptions} />
    </>
  );
}
