import {
  boolean,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "quarterly", "semiannual", "yearly"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "canceled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["paid", "pending", "overdue"]);
export const emailTypeEnum = pgEnum("email_type", [
  "reminder_7_days",
  "reminder_3_days",
  "reminder_1_day",
  "due_today",
  "overdue",
]);
export const emailStatusEnum = pgEnum("email_status", ["sent", "failed"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    resetToken: text("reset_token"),
    resetTokenExpiresAt: timestamp("reset_token_expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  }),
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 80 }).notNull(),
    color: varchar("color", { length: 20 }).notNull(),
    icon: varchar("icon", { length: 80 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("categories_user_id_idx").on(table.userId),
  }),
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    billingCycle: billingCycleEnum("billing_cycle").notNull(),
    nextPaymentDate: timestamp("next_payment_date", { withTimezone: true }).notNull(),
    status: subscriptionStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("subscriptions_user_id_idx").on(table.userId),
    nextPaymentIdx: index("subscriptions_next_payment_date_idx").on(table.nextPaymentDate),
  }),
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    paymentDate: timestamp("payment_date", { withTimezone: true }).notNull(),
    status: paymentStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    subscriptionIdx: index("payments_subscription_id_idx").on(table.subscriptionId),
  }),
);

export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  notify7Days: boolean("notify_7_days").default(true).notNull(),
  notify3Days: boolean("notify_3_days").default(true).notNull(),
  notify1Day: boolean("notify_1_day").default(true).notNull(),
  notifyDueDay: boolean("notify_due_day").default(true).notNull(),
  notifyOverdue: boolean("notify_overdue").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const emailLogs = pgTable(
  "email_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    type: emailTypeEnum("type").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
    status: emailStatusEnum("status").notNull(),
  },
  (table) => ({
    duplicateGuardIdx: index("email_logs_duplicate_guard_idx").on(
      table.userId,
      table.subscriptionId,
      table.type,
      table.sentAt,
    ),
  }),
);

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
