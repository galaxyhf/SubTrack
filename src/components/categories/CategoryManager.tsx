"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { deleteCategoryAction, upsertCategoryAction } from "@/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { demoCategories } from "@/services/mock-data";
import type { CategoryInput } from "@/schemas/subscription";

const icons = ["Tv", "Home", "Utensils", "Car", "HeartPulse", "GraduationCap", "Wrench", "Gamepad2", "CircleDollarSign"];
const colors = ["#336EBB", "#22C55E", "#EF4444", "#F59E0B", "#8B5CF6", "#06B6D4", "#EC4899", "#A1A1AA"];

export const CategoryManager = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [icon, setIcon] = useState(icons[0]);
  const [pending, startTransition] = useTransition();

  const save = () => {
    const payload: CategoryInput = { name, color, icon };
    startTransition(async () => {
      const result = await upsertCategoryAction(payload);
      toast[result.ok ? "success" : "error"](result.message);
      if (result.ok) {
        setOpen(false);
        setName("");
      }
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      toast[result.ok ? "success" : "error"](result.message);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Nova categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="size-8 rounded-md border border-border"
                      style={{ backgroundColor: item, outline: color === item ? "2px solid #FFFFFF" : "none" }}
                      onClick={() => setColor(item)}
                      aria-label={item}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ícone</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {icons.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={save} disabled={pending || !name} className="w-full">
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {demoCategories.map((category) => (
          <Card key={category.id} className="border-border bg-card">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="size-4 rounded-full" style={{ backgroundColor: category.color }} />
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.icon}</p>
                </div>
              </div>
              <Button size="icon" variant="outline" disabled={pending} onClick={() => remove(category.id)}>
                <Trash2 className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
