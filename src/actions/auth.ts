"use server";

import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { getDb } from "@/db";
import { notificationPreferences, users } from "@/db/schema";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "@/schemas/auth";
import { createDefaultCategories } from "@/services/categories";
import { sendPasswordResetEmail } from "@/services/email";

interface ActionState {
  ok: boolean;
  message: string;
}

export const registerAction = async (input: unknown): Promise<ActionState> => {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const db = getDb();
  const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email)).limit(1);

  if (existingUser.length > 0) {
    return { ok: false, message: "Este email já está cadastrado." };
  }

  const [user] = await db
    .insert(users)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      password: await hash(parsed.data.password, 12),
    })
    .returning({ id: users.id });

  await createDefaultCategories(user.id);
  await db.insert(notificationPreferences).values({ userId: user.id });

  return { ok: true, message: "Conta criada com sucesso." };
};

export const loginAction = async (input: unknown): Promise<ActionState> => {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirect: false,
    });
    return { ok: true, message: "Login realizado com sucesso." };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Email ou senha inválidos." };
    }

    throw error;
  }
};

export const logoutAction = async () => {
  await signOut({ redirectTo: "/login" });
};

export const forgotPasswordAction = async (input: unknown): Promise<ActionState> => {
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Email inválido." };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
  const [user] = await getDb()
    .update(users)
    .set({ resetToken: token, resetTokenExpiresAt: expiresAt })
    .where(eq(users.email, parsed.data.email))
    .returning({ name: users.name, email: users.email });

  if (user) {
    await sendPasswordResetEmail({ to: user.email, name: user.name, token });
  }

  return { ok: true, message: "Se o email existir, enviaremos as instruções de recuperação." };
};

export const resetPasswordAction = async (input: unknown): Promise<ActionState> => {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.resetToken, parsed.data.token)).limit(1);

  if (!user?.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    return { ok: false, message: "Token inválido ou expirado." };
  }

  await db
    .update(users)
    .set({
      password: await hash(parsed.data.password, 12),
      resetToken: null,
      resetTokenExpiresAt: null,
    })
    .where(eq(users.id, user.id));

  return { ok: true, message: "Senha atualizada com sucesso." };
};
