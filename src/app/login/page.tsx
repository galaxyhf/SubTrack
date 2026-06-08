import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard
      title="Entrar"
      description="Acesse seu painel para controlar assinaturas, vencimentos e relatórios."
      footer={{ text: "Ainda não tem conta?", label: "Criar conta", href: "/register" }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
