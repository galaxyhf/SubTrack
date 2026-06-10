import { formatCurrency, formatDate } from "@/lib/formatters";
import { getAppUrl } from "@/lib/app-url";
import type { EmailReminderType } from "@/types";

const emailJsUrl = "https://api.emailjs.com/api/v1.0/email/send";
const emailJsMinIntervalMs = 1100;
let lastEmailJsRequestAt = 0;

interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  resetTemplateId: string;
  publicKey: string;
  privateKey?: string;
}

interface EmailJsError {
  status: number;
  text: string;
}

type EmailJsResult = { data: { status: number; text: string }; error: null } | { data: null; error: EmailJsError };
type ReminderTemplateType = "reminder" | "today" | "overdue";

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const waitForEmailJsRateLimit = async () => {
  const elapsed = Date.now() - lastEmailJsRequestAt;

  if (elapsed < emailJsMinIntervalMs) {
    await wait(emailJsMinIntervalMs - elapsed);
  }

  lastEmailJsRequestAt = Date.now();
};

const getEmailJsConfig = (): EmailJsConfig => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const resetTemplateId = process.env.EMAILJS_RESET_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !resetTemplateId || !publicKey) {
    throw new Error(
      "EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_RESET_TEMPLATE_ID e EMAILJS_PUBLIC_KEY precisam estar configuradas.",
    );
  }

  return {
    serviceId,
    templateId,
    resetTemplateId,
    publicKey,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
  };
};

interface ReminderEmailInput {
  to: string;
  name: string;
  subscription: string;
  amount: number;
  date: Date;
  type: EmailReminderType;
}

const subjectByType: Record<EmailReminderType, string> = {
  reminder_7_days: "Sua assinatura está próxima do vencimento",
  reminder_3_days: "Sua assinatura está próxima do vencimento",
  reminder_1_day: "Sua assinatura está próxima do vencimento",
  due_today: "Sua assinatura vence hoje",
  overdue: "Pagamento em atraso",
};

const sendEmail = async (
  templateParams: Record<string, string | number | undefined>,
  templateId?: string,
): Promise<EmailJsResult> => {
  const config = getEmailJsConfig();
  await waitForEmailJsRateLimit();

  const response = await fetch(emailJsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: templateId ?? config.templateId,
      user_id: config.publicKey,
      accessToken: config.privateKey,
      template_params: templateParams,
    }),
  });
  const text = await response.text();

  if (!response.ok) {
    return { data: null, error: { status: response.status, text } };
  }

  return { data: { status: response.status, text }, error: null };
};

export const sendReminderEmail = async (input: ReminderEmailInput): Promise<EmailJsResult> => {
  const appUrl = getAppUrl();
  const templateType: ReminderTemplateType =
    input.type === "due_today" ? "today" : input.type === "overdue" ? "overdue" : "reminder";
  const daysByType: Partial<Record<EmailReminderType, number>> = {
    reminder_7_days: 7,
    reminder_3_days: 3,
    reminder_1_day: 1,
  };
  const amount = formatCurrency(input.amount);
  const date = formatDate(input.date);
  const messageByType: Record<ReminderTemplateType, string> = {
    reminder: `A assinatura "${input.subscription}" no valor de ${amount} vence em ${daysByType[input.type]} dia(s).`,
    today: `A assinatura "${input.subscription}" vence hoje.`,
    overdue: `A assinatura "${input.subscription}" está com pagamento em atraso.`,
  };

  return sendEmail({
    to_email: input.to,
    to_name: input.name,
    subject: subjectByType[input.type],
    preview: subjectByType[input.type],
    heading: subjectByType[input.type],
    message: messageByType[templateType],
    subscription: input.subscription,
    amount,
    date,
    action_url: `${appUrl}/subscriptions`,
    action_label: templateType === "reminder" ? "Ver Assinaturas" : "Abrir Dashboard",
  });
};

export const sendPasswordResetEmail = async ({
  to,
  name,
  token,
}: {
  to: string;
  name: string;
  token: string;
}): Promise<EmailJsResult> => {
  const appUrl = getAppUrl();
  const config = getEmailJsConfig();

  return sendEmail(
    {
      to_email: to,
      to_name: name,
      subject: "Redefinição de senha",
      preview: "Redefina sua senha no SubTrack",
      reset_url: `${appUrl}/reset-password?token=${token}`,
      expires_in: "30 minutos",
    },
    config.resetTemplateId,
  );
};
