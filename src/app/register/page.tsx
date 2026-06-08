import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Criar conta"
      description="Configure seu espaço financeiro em poucos segundos."
      footer={{ text: "Já tem conta?", label: "Entrar", href: "/login" }}
    >
      <RegisterForm />
    </AuthCard>
  );
}
