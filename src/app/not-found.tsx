import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <h1 className="text-4xl font-semibold">Página não encontrada</h1>
      <p className="mt-3 text-sm text-muted-foreground">A rota solicitada não existe no SubTrack.</p>
      <Button asChild className="mt-6">
        <Link href="/dashboard">Voltar ao dashboard</Link>
      </Button>
    </main>
  );
}
