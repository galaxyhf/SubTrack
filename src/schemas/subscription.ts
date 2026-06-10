import { z } from "zod";

export const subscriptionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Informe o nome."),
  description: z.string().max(400).optional(),
  categoryId: z.string().uuid("Selecione uma categoria."),
  price: z.number().positive("Informe um valor maior que zero."),
  billingCycle: z.enum(["monthly", "quarterly", "semiannual", "yearly"]),
  nextPaymentDate: z.string().min(1, "Informe a data do próximo pagamento."),
  status: z.enum(["active", "canceled"]),
});

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Informe o nome."),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use uma cor hexadecimal."),
});

export const notificationPreferencesSchema = z.object({
  notify7Days: z.boolean(),
  notify3Days: z.boolean(),
  notify1Day: z.boolean(),
  notifyDueDay: z.boolean(),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
