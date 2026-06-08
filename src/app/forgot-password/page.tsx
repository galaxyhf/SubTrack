import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar senha"
      description="Informe seu email para receber o link de redefinição."
      footer={{ text: "Lembrou sua senha?", label: "Entrar", href: "/login" }}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
