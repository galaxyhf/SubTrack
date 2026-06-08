"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-md border border-border bg-card p-8 text-center">
      <h2 className="text-xl font-semibold">Não foi possível carregar esta área.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Tente novamente em alguns segundos.</p>
      <Button className="mt-5" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  );
}
