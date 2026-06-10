"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { upsertSubscriptionAction } from "@/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { subscriptionSchema, type SubscriptionInput } from "@/schemas/subscription";
import type { CategorySummary, SubscriptionView } from "@/types";

interface SubscriptionFormDialogProps {
  categories: CategorySummary[];
  subscription?: SubscriptionView;
}

const getTodayDateInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const SubscriptionFormDialog = ({ categories, subscription }: SubscriptionFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const hasCategories = categories.length > 0;
  const form = useForm<SubscriptionInput>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      id: subscription?.id,
      name: subscription?.name ?? "",
      description: subscription?.description ?? "",
      categoryId: subscription?.categoryId ?? categories[0]?.id ?? "",
      price: subscription?.price ?? 0,
      billingCycle: subscription?.billingCycle ?? "monthly",
      nextPaymentDate: subscription?.nextPaymentDate ?? getTodayDateInputValue(),
      status: subscription?.status ?? "active",
    },
  });
  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const billingCycle = useWatch({ control: form.control, name: "billingCycle" });
  const status = useWatch({ control: form.control, name: "status" });

  const onSubmit = (values: SubscriptionInput) => {
    startTransition(async () => {
      const result = await upsertSubscriptionAction(values);
      toast[result.ok ? "success" : "error"](result.message);

      if (result.ok) {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={subscription ? "outline" : "default"} size={subscription ? "sm" : "default"} disabled={!hasCategories}>
          {!subscription ? <Plus className="size-4" /> : null}
          {subscription ? "Editar" : "Nova assinatura"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{subscription ? "Editar assinatura" : "Criar assinatura"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Nome</Label>
            <Input {...form.register("name")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Descrição</Label>
            <Textarea {...form.register("description")} />
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoryId} onValueChange={(value) => form.setValue("categoryId", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Valor</Label>
            <Input type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Frequência</Label>
            <Select value={billingCycle} onValueChange={(value: SubscriptionInput["billingCycle"]) => form.setValue("billingCycle", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="semiannual">Semestral</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Próximo pagamento</Label>
            <Input type="date" {...form.register("nextPaymentDate")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value: SubscriptionInput["status"]) => form.setValue("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="canceled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {Object.values(form.formState.errors)[0]?.message ? (
            <p className="text-sm text-destructive md:col-span-2">{Object.values(form.formState.errors)[0]?.message}</p>
          ) : null}
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending || !hasCategories}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
