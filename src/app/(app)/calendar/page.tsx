import { FinancialCalendar } from "@/components/calendar/FinancialCalendar";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CalendarPage() {
  return (
    <>
      <PageHeader title="Calendário financeiro" description="Visualize vencimentos mensais, próximos pagamentos e cobranças em atraso." />
      <FinancialCalendar />
    </>
  );
}
