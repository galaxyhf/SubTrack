import Link from "next/link";
import { ReceiptText } from "lucide-react";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: {
    label: string;
    href: string;
    text: string;
  };
}

export const AuthCard = ({ title, description, children, footer }: AuthCardProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl shadow-black/20">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary">
            <ReceiptText className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold">SubTrack</p>
            <p className="text-xs text-muted-foreground">Gerenciador de assinaturas</p>
          </div>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer.text}{" "}
          <Link href={footer.href} className="font-medium text-primary hover:underline">
            {footer.label}
          </Link>
        </p>
      </div>
    </main>
  );
};
