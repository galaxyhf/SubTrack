import { InsightsClient } from "@/components/insights/InsightsClient";
import { PageHeader } from "@/components/shared/PageHeader";

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        title="Insights financeiros"
        description="Identifique gastos concentrados, assinatura mais cara, tendência e economia potencial."
      />
      <InsightsClient />
    </>
  );
}
