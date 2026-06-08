import { AppShell } from "@/components/layout/AppShell";
import { requireUser } from "@/lib/auth-utils";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return <AppShell userName={user.name}>{children}</AppShell>;
}
