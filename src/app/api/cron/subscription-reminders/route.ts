import { and, eq, gte, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { emailLogs, notificationPreferences, subscriptions, users } from "@/db/schema";
import { sendReminderEmail } from "@/services/email";
import type { EmailReminderType } from "@/types";

const getDayBounds = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

const getReminderType = (daysUntilDue: number): EmailReminderType | null => {
  if (daysUntilDue === 7) return "reminder_7_days";
  if (daysUntilDue === 3) return "reminder_3_days";
  if (daysUntilDue === 1) return "reminder_1_day";
  if (daysUntilDue === 0) return "due_today";
  return null;
};

export const GET = async (request: Request) => {
  const authHeader = request.headers.get("authorization");

  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = getDb();
  const today = new Date();
  const { start, end } = getDayBounds(today);
  const rows = await db
    .select({
      subscriptionId: subscriptions.id,
      subscriptionName: subscriptions.name,
      nextPaymentDate: subscriptions.nextPaymentDate,
      price: subscriptions.price,
      userId: users.id,
      userName: users.name,
      userEmail: users.email,
      notify7Days: notificationPreferences.notify7Days,
      notify3Days: notificationPreferences.notify3Days,
      notify1Day: notificationPreferences.notify1Day,
      notifyDueDay: notificationPreferences.notifyDueDay,
    })
    .from(subscriptions)
    .innerJoin(users, eq(users.id, subscriptions.userId))
    .innerJoin(notificationPreferences, eq(notificationPreferences.userId, users.id))
    .where(eq(subscriptions.status, "active"));

  let sent = 0;
  let skipped = 0;

  for (const row of rows) {
    const dueDate = new Date(row.nextPaymentDate);
    const dueStart = getDayBounds(dueDate).start;
    const daysUntilDue = Math.round((dueStart.getTime() - start.getTime()) / 86_400_000);
    const type = getReminderType(daysUntilDue);

    if (!type) {
      skipped += 1;
      continue;
    }

    const enabledByType: Record<EmailReminderType, boolean> = {
      reminder_7_days: row.notify7Days,
      reminder_3_days: row.notify3Days,
      reminder_1_day: row.notify1Day,
      due_today: row.notifyDueDay,
      overdue: false,
    };

    if (!enabledByType[type]) {
      skipped += 1;
      continue;
    }

    const existingLog = await db
      .select({ id: emailLogs.id })
      .from(emailLogs)
      .where(
        and(
          eq(emailLogs.userId, row.userId),
          eq(emailLogs.subscriptionId, row.subscriptionId),
          eq(emailLogs.type, type),
          gte(emailLogs.sentAt, start),
          lt(emailLogs.sentAt, end),
        ),
      )
      .limit(1);

    if (existingLog.length > 0) {
      skipped += 1;
      continue;
    }

    const result = await sendReminderEmail({
      to: row.userEmail,
      name: row.userName,
      subscription: row.subscriptionName,
      amount: Number(row.price),
      date: row.nextPaymentDate,
      type,
    });

    await db.insert(emailLogs).values({
      userId: row.userId,
      subscriptionId: row.subscriptionId,
      type,
      email: row.userEmail,
      status: result.error ? "failed" : "sent",
    });

    if (result.error) {
      skipped += 1;
    } else {
      sent += 1;
    }
  }

  return NextResponse.json({ ok: true, sent, skipped });
};
