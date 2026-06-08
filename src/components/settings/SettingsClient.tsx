"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateNotificationPreferencesAction, updatePasswordAction, updateProfileAction } from "@/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsClientProps {
  name?: string | null;
  email?: string | null;
}

export const SettingsClient = ({ name, email }: SettingsClientProps) => {
  const [profile, setProfile] = useState({ name: name ?? "", email: email ?? "" });
  const [password, setPassword] = useState({ password: "", confirmPassword: "" });
  const [preferences, setPreferences] = useState({
    notify7Days: true,
    notify3Days: true,
    notify1Day: true,
    notifyDueDay: true,
    notifyOverdue: true,
  });
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      const result = await action();
      toast[result.ok ? "success" : "error"](result.message);
    });
  };

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList>
        <TabsTrigger value="profile">Perfil</TabsTrigger>
        <TabsTrigger value="security">Senha</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card className="max-w-2xl border-border bg-card">
          <CardHeader>
            <CardTitle>Dados da conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <Button disabled={pending} onClick={() => run(() => updateProfileAction(profile))}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Salvar perfil
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card className="max-w-2xl border-border bg-card">
          <CardHeader>
            <CardTitle>Alterar senha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nova senha</Label>
              <Input
                type="password"
                value={password.password}
                onChange={(event) => setPassword((current) => ({ ...current, password: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar senha</Label>
              <Input
                type="password"
                value={password.confirmPassword}
                onChange={(event) => setPassword((current) => ({ ...current, confirmPassword: event.target.value }))}
              />
            </div>
            <Button disabled={pending} onClick={() => run(() => updatePasswordAction(password))}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Atualizar senha
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card className="max-w-2xl border-border bg-card">
          <CardHeader>
            <CardTitle>Emails de lembrete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["notify7Days", "Receber lembrete 7 dias antes"],
              ["notify3Days", "Receber lembrete 3 dias antes"],
              ["notify1Day", "Receber lembrete 1 dia antes"],
              ["notifyDueDay", "Receber lembrete no vencimento"],
              ["notifyOverdue", "Receber alerta de atraso"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-3">
                <Label>{label}</Label>
                <Switch
                  checked={preferences[key as keyof typeof preferences]}
                  onCheckedChange={(checked) => setPreferences((current) => ({ ...current, [key]: checked }))}
                />
              </div>
            ))}
            <Button disabled={pending} onClick={() => run(() => updateNotificationPreferencesAction(preferences))}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Salvar notificações
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
