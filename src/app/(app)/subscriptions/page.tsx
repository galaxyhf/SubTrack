import { SubscriptionFormDialog } from "@/components/subscriptions/SubscriptionFormDialog";
import { SubscriptionsTable } from "@/components/subscriptions/SubscriptionsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { demoSubscriptions } from "@/services/mock-data";

export default function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Assinaturas"
        description="Crie, edite, cancele, restaure e filtre todos os gastos recorrentes em uma única tabela."
        action={<SubscriptionFormDialog />}
      />
      <SubscriptionsTable subscriptions={demoSubscriptions} />
    </>
  );
}
