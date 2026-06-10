"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteCategoryAction, upsertCategoryAction } from "@/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryInput } from "@/schemas/subscription";
import type { CategorySummary } from "@/types";

const defaultCategoryColor = "#336EBB";

interface CategoryManagerProps {
  categories: CategorySummary[];
}

export const CategoryManager = ({ categories }: CategoryManagerProps) => {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategorySummary | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(defaultCategoryColor);
  const [pending, startTransition] = useTransition();

  const resetForm = () => {
    setEditingCategory(null);
    setName("");
    setColor(defaultCategoryColor);
  };

  const openCreateDialog = () => {
    resetForm();
    setOpen(true);
  };

  const openEditDialog = (category: CategorySummary) => {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setOpen(true);
  };

  const save = () => {
    const payload: CategoryInput = { id: editingCategory?.id, name, color };
    startTransition(async () => {
      const result = await upsertCategoryAction(payload);
      toast[result.ok ? "success" : "error"](result.message);
      if (result.ok) {
        setOpen(false);
        resetForm();
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
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);

            if (!isOpen) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="size-4" />
              Nova categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar categoria" : "Criar categoria"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    className="size-12 cursor-pointer rounded-full border-border p-1 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                    aria-label="Selecionar cor"
                  />
                  <Input value={color} onChange={(event) => setColor(event.target.value)} className="font-mono uppercase" />
                </div>
              </div>
              <Button onClick={save} disabled={pending || !name.trim()} className="w-full">
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="border-border bg-card">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="size-4 rounded-full" style={{ backgroundColor: category.color }} />
                <div>
                  <p className="font-medium">{category.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" disabled={pending} onClick={() => openEditDialog(category)}>
                  <Pencil className="size-4" />
                </Button>
                <Button size="icon" variant="outline" disabled={pending} onClick={() => remove(category.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
