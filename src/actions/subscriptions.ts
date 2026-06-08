"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { getDb } from "@/db";
import { hash } from "bcryptjs";
import { categories, notificationPreferences, subscriptions, users } from "@/db/schema";
import { categorySchema, notificationPreferencesSchema, subscriptionSchema } from "@/schemas/subscription";

interface ActionState {
  ok: boolean;
  message: string;
}

export const upsertSubscriptionAction = async (input: unknown): Promise<ActionState> => {
  const user = await requireUser();
  const parsed = subscriptionSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const values = {
    userId: user.id,
    categoryId: parsed.data.categoryId,
    name: parsed.data.name,
    description: parsed.data.description,
    price: parsed.data.price.toFixed(2),
    billingCycle: parsed.data.billingCycle,
    nextPaymentDate: new Date(parsed.data.nextPaymentDate),
    status: parsed.data.status,
    updatedAt: new Date(),
  };

  if (parsed.data.id) {
    await getDb()
      .update(subscriptions)
      .set(values)
      .where(and(eq(subscriptions.id, parsed.data.id), eq(subscriptions.userId, user.id)));
  } else {
    await getDb().insert(subscriptions).values(values);
  }

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");
  return { ok: true, message: "Assinatura salva com sucesso." };
};

export const deleteSubscriptionAction = async (id: string): Promise<ActionState> => {
  const user = await requireUser();
  await getDb().delete(subscriptions).where(and(eq(subscriptions.id, id), eq(subscriptions.userId, user.id)));
  revalidatePath("/subscriptions");
  return { ok: true, message: "Assinatura excluída." };
};

export const toggleSubscriptionStatusAction = async (id: string, status: "active" | "canceled"): Promise<ActionState> => {
  const user = await requireUser();
  await getDb()
    .update(subscriptions)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, user.id)));
  revalidatePath("/subscriptions");
  return { ok: true, message: status === "active" ? "Assinatura restaurada." : "Assinatura cancelada." };
};

export const upsertCategoryAction = async (input: unknown): Promise<ActionState> => {
  const user = await requireUser();
  const parsed = categorySchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  if (parsed.data.id) {
    await getDb()
      .update(categories)
      .set({ name: parsed.data.name, color: parsed.data.color, icon: parsed.data.icon })
      .where(and(eq(categories.id, parsed.data.id), eq(categories.userId, user.id)));
  } else {
    await getDb().insert(categories).values({ ...parsed.data, userId: user.id });
  }

  revalidatePath("/categories");
  return { ok: true, message: "Categoria salva com sucesso." };
};

export const deleteCategoryAction = async (id: string): Promise<ActionState> => {
  const user = await requireUser();
  await getDb().delete(categories).where(and(eq(categories.id, id), eq(categories.userId, user.id)));
  revalidatePath("/categories");
  return { ok: true, message: "Categoria excluída." };
};

export const updateProfileAction = async (input: { name: string; email: string }): Promise<ActionState> => {
  const user = await requireUser();
  await getDb()
    .update(users)
    .set({ name: input.name, email: input.email })
    .where(eq(users.id, user.id));
  revalidatePath("/settings");
  return { ok: true, message: "Perfil atualizado." };
};

export const updatePasswordAction = async (input: { password: string; confirmPassword: string }): Promise<ActionState> => {
  const user = await requireUser();

  if (input.password.length < 8) {
    return { ok: false, message: "A senha precisa ter pelo menos 8 caracteres." };
  }

  if (input.password !== input.confirmPassword) {
    return { ok: false, message: "As senhas não conferem." };
  }

  await getDb()
    .update(users)
    .set({ password: await hash(input.password, 12) })
    .where(eq(users.id, user.id));

  return { ok: true, message: "Senha alterada com sucesso." };
};

export const updateNotificationPreferencesAction = async (input: unknown): Promise<ActionState> => {
  const user = await requireUser();
  const parsed = notificationPreferencesSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Preferências inválidas." };
  }

  await getDb()
    .update(notificationPreferences)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(notificationPreferences.userId, user.id));
  revalidatePath("/settings");
  return { ok: true, message: "Preferências atualizadas." };
};
