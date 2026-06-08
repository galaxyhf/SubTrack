import { SettingsClient } from "@/components/settings/SettingsClient";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth-utils";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <>
      <PageHeader title="Configurações" description="Gerencie dados da conta, senha e preferências de lembretes por email." />
      <SettingsClient name={user.name} email={user.email} />
    </>
  );
}
