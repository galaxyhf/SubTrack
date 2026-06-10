import { SubscriptionFormDialog } from "@/components/subscriptions/SubscriptionFormDialog";
import { SubscriptionsTable } from "@/components/subscriptions/SubscriptionsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth-utils";
import { getUserCategories, getUserSubscriptions } from "@/services/subscriptions";

export default async function SubscriptionsPage() {
  const user = await requireUser();
  const [categories, subscriptions] = await Promise.all([getUserCategories(user.id), getUserSubscriptions(user.id)]);

  return (
    <>
      <PageHeader
        title="Assinaturas"
        description="Crie, edite, cancele, restaure e filtre todos os gastos recorrentes em uma única tabela."
        action={<SubscriptionFormDialog categories={categories} />}
      />
      <SubscriptionsTable categories={categories} subscriptions={subscriptions} />
    </>
  );
}
