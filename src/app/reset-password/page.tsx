import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token = "" } = await searchParams;

  return (
    <AuthCard
      title="Nova senha"
      description="Defina uma nova senha segura para sua conta."
      footer={{ text: "Voltar para", label: "Login", href: "/login" }}
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
