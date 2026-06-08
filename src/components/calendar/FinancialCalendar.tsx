"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { demoSubscriptions } from "@/services/mock-data";
import type { SubscriptionView } from "@/types";

const getEventColor = (date: string) => {
  const today = new Date("2026-06-08");
  const target = new Date(date);
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0) return "bg-[#EF4444]";
  if (diff <= 7) return "bg-[#F59E0B]";
  return "bg-[#22C55E]";
};

export const FinancialCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date("2026-06-08"));
  const [selectedEvent, setSelectedEvent] = useState<SubscriptionView | null>(null);
  const selectedDate = date?.toISOString().slice(0, 10);
  const events = demoSubscriptions.filter((subscription) => subscription.nextPaymentDate === selectedDate);

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card className="border-border bg-card">
        <CardContent className="p-3">
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <h2 className="mb-4 text-lg font-semibold">Vencimentos de {date ? formatDate(date) : "hoje"}</h2>
          <div className="space-y-3">
            {events.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum vencimento para esta data.</p> : null}
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEvent(event)}
                className="flex w-full items-center justify-between rounded-md border border-border bg-secondary/40 p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className={`size-3 rounded-full ${getEventColor(event.nextPaymentDate)}`} />
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{event.category}</p>
                  </div>
                </div>
                <p className="font-semibold">{formatCurrency(event.price)}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={Boolean(selectedEvent)} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
          </DialogHeader>
          {selectedEvent ? (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">{selectedEvent.description}</p>
              <p>Valor: {formatCurrency(selectedEvent.price)}</p>
              <p>Vencimento: {formatDate(selectedEvent.nextPaymentDate)}</p>
              <Badge>{selectedEvent.status === "active" ? "Ativa" : "Cancelada"}</Badge>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
