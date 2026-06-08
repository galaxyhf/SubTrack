# SubTrack

SaaS moderno para gerenciamento de assinaturas recorrentes, gastos fixos, vencimentos, relatórios e lembretes por email.

## Stack

- Next.js mais atualizado/App Router
- TypeScript strict
- Tailwind CSS v4 via PostCSS
- shadcn/ui
- Lucide React
- Framer Motion
- Neon PostgreSQL
- Drizzle ORM
- Auth.js/NextAuth v5
- React Hook Form + Zod
- Recharts
- Sonner
- EmailJS
- Vercel Cron

## Variáveis de ambiente

Crie `.env.local` a partir de `.env.example`:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_RESET_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
CRON_SECRET=
```

Em produção, defina todas as variáveis na Vercel. O `AUTH_SECRET` deve ser forte e único.

## Configurar envio de emails

O projeto envia emails com EmailJS. O mesmo serviço é usado em:

- recuperação de senha;
- lembretes automáticos de assinaturas pelo cron.

A API REST do EmailJS tem limite de 1 envio por segundo. O serviço respeita esse intervalo automaticamente quando o cron envia vários lembretes.

Para configurar:

1. Crie uma conta em `https://www.emailjs.com`.
2. Adicione um serviço de email em `Email Services`.
3. Crie dois templates em `Email Templates`: um para lembretes e outro para redefinição de senha.
4. Copie o `Service ID`, os dois `Template ID`, o `Public Key` e, se estiver usando a REST API com chave privada, o `Private Key`.
5. Preencha o `.env.local`:

```env
EMAILJS_SERVICE_ID=service_xxxxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxxxx
EMAILJS_RESET_TEMPLATE_ID=template_xxxxxxxxx
EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxx
EMAILJS_PRIVATE_KEY=xxxxxxxxxxxxxxxxx
AUTH_URL=http://localhost:3000
```

Para produção, use a URL real do app:

```env
AUTH_URL=https://seu-dominio.com
```

No EmailJS, configure o destinatário dos templates usando a variável:

```txt
{{to_email}}
```

### Template de lembretes

Use o arquivo `emailjs-template.html` como corpo HTML do template de lembretes. No campo de assunto, use:

```txt
{{subject}}
```

Variáveis enviadas para esse template:

```txt
{{to_email}}
{{to_name}}
{{subject}}
{{preview}}
{{heading}}
{{message}}
{{subscription}}
{{amount}}
{{date}}
{{action_url}}
{{action_label}}
```

### Template de redefinição de senha

Use o arquivo `emailjs-reset-password-template.html` como corpo HTML do template de redefinição de senha. No campo de assunto, use:

```txt
{{subject}}
```

Variáveis enviadas para esse template:

```txt
{{to_email}}
{{to_name}}
{{subject}}
{{preview}}
{{reset_url}}
{{expires_in}}
```

Para testar manualmente:

1. Rode o app com `npm run dev`.
2. Cadastre um usuário com email real.
3. Acesse `/forgot-password`.
4. Solicite a recuperação de senha.
5. Confira se o email chegou e se o link abre `/reset-password`.

Se não chegar, verifique:

- `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_RESET_TEMPLATE_ID` e `EMAILJS_PUBLIC_KEY` estão preenchidas;
- `EMAILJS_PRIVATE_KEY` está correta se o template/serviço exigir chave privada;
- `AUTH_URL` aponta para a URL correta;
- o template usa `{{to_email}}` como destinatário;
- o painel do EmailJS mostra erro no envio;
- spam/lixo eletrônico.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Banco de dados

Gere e aplique migrations Drizzle:

```bash
npm run db:generate
npm run db:migrate
```

Para inspecionar o banco:

```bash
npm run db:studio
```

## Cron de emails

O cron está em `vercel.json` e chama diariamente:

```txt
/api/cron/subscription-reminders
```

Agenda configurada: `0 11 * * *`, equivalente a 08:00 no horário de Brasília quando a Vercel executa em UTC.

Para proteger a rota do cron, configure:

```env
CRON_SECRET=uma_chave_forte
```

Ao chamar manualmente a rota, envie o header:

```txt
Authorization: Bearer uma_chave_forte
```

Exemplo local:

```bash
curl -H "Authorization: Bearer uma_chave_forte" http://localhost:3000/api/cron/subscription-reminders
```

O retorno esperado é um JSON como:

```json
{
  "ok": true,
  "sent": 0,
  "skipped": 0
}
```

`sent` indica emails enviados. `skipped` indica assinaturas ignoradas por regra de data, preferência do usuário, email já enviado no dia ou erro retornado pelo EmailJS.

## Validação

```bash
npm run lint
npm run build
```

## Deploy

1. Conecte o repositório na Vercel.
2. Configure `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_RESET_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY` e `CRON_SECRET`.
3. Rode as migrations no banco Neon.
4. Faça o deploy.
