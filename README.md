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

## Configurar envio de emails

O projeto envia emails com EmailJS. O mesmo serviço é usado em:

- recuperação de senha;
- lembretes automáticos de assinaturas pelo cron.

A API REST do EmailJS tem limite de 1 envio por segundo. O serviço respeita esse intervalo automaticamente quando o cron envia vários lembretes.

Para configurar:

1. Crie uma conta no EmailJS.
2. Adicione um serviço de email.
3. Crie os templates necessários para lembretes e redefinição de senha.
4. Configure as variáveis de ambiente exigidas pelo projeto diretamente na plataforma utilizada para desenvolvimento e deploy.

### Template de lembretes

Use o arquivo `emailjs-template.html` como corpo HTML do template de lembretes.

### Template de redefinição de senha

Use o arquivo `emailjs-reset-password-template.html` como corpo HTML do template de redefinição de senha.

Para testar manualmente:

1. Rode o app com `npm run dev`.
2. Cadastre um usuário com email real.
3. Acesse `/forgot-password`.
4. Solicite a recuperação de senha.
5. Confira se o email chegou e se o link abre `/reset-password`.

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

## Validação

```bash
npm run lint
npm run build
```

## Deploy

1. Conecte o repositório na Vercel.
2. Configure as variáveis de ambiente necessárias ao projeto.
3. Rode as migrations no banco.
4. Faça o deploy.
