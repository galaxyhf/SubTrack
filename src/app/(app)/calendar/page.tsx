import { FinancialCalendar } from "@/components/calendar/FinancialCalendar";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth-utils";
import { getUserSubscriptions } from "@/services/subscriptions";

export default async function CalendarPage() {
  const user = await requireUser();
  const subscriptions = await getUserSubscriptions(user.id);

  return (
    <>
      <PageHeader title="Calendário financeiro" description="Visualize vencimentos mensais, próximos pagamentos e cobranças em atraso." />
      <FinancialCalendar subscriptions={subscriptions} />
    </>
  );
}
