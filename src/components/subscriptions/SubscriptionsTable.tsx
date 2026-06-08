"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowUpDown, RotateCcw, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { deleteSubscriptionAction, toggleSubscriptionStatusAction } from "@/actions/subscriptions";
import { SubscriptionFormDialog } from "@/components/subscriptions/SubscriptionFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { billingCycleLabels, formatCurrency, formatDate } from "@/lib/formatters";
import { demoCategories } from "@/services/mock-data";
import type { SubscriptionStatus, SubscriptionView } from "@/types";

interface SubscriptionsTableProps {
  subscriptions: SubscriptionView[];
}

type SortKey = "name" | "price" | "nextPaymentDate";

export const SubscriptionsTable = ({ subscriptions }: SubscriptionsTableProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<SubscriptionStatus | "all">("all");
  const [minValue, setMinValue] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("nextPaymentDate");
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();
  const pageSize = 5;

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return subscriptions
      .filter((subscription) => subscription.name.toLowerCase().includes(normalizedQuery))
      .filter((subscription) => (category === "all" ? true : subscription.categoryId === category))
      .filter((subscription) => (status === "all" ? true : subscription.status === status))
      .filter((subscription) => (minValue ? subscription.price >= Number(minValue) : true))
      .sort((first, second) => {
        if (sortKey === "price") return second.price - first.price;
        return String(first[sortKey]).localeCompare(String(second[sortKey]));
      });
  }, [category, minValue, query, sortKey, status, subscriptions]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const runAction = (action: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      const result = await action();
      toast[result.ok ? "success" : "error"](result.message);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_160px_140px]">
        <Input placeholder="Buscar assinatura..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {demoCategories.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value: SubscriptionStatus | "all") => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="canceled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Valor mín." type="number" value={minValue} onChange={(event) => setMinValue(event.target.value)} />
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => setSortKey("name")}>
                  Nome <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => setSortKey("price")}>
                  Valor <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead>Frequência</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => setSortKey("nextPaymentDate")}>
                  Próximo pagamento <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <p className="font-medium">{subscription.name}</p>
                  <p className="text-xs text-muted-foreground">{subscription.description}</p>
                </TableCell>
                <TableCell>
                  <Badge style={{ borderColor: subscription.categoryColor, color: subscription.categoryColor }} variant="outline">
                    {subscription.category}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(subscription.price)}</TableCell>
                <TableCell>{billingCycleLabels[subscription.billingCycle]}</TableCell>
                <TableCell>{formatDate(subscription.nextPaymentDate)}</TableCell>
                <TableCell>
                  <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                    {subscription.status === "active" ? "Ativa" : "Cancelada"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <SubscriptionFormDialog subscription={subscription} />
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={pending}
                      onClick={() =>
                        runAction(() =>
                          toggleSubscriptionStatusAction(subscription.id, subscription.status === "active" ? "canceled" : "active"),
                        )
                      }
                    >
                      {subscription.status === "active" ? <XCircle className="size-4" /> : <RotateCcw className="size-4" />}
                    </Button>
                    <Button variant="destructive" size="icon" disabled={pending} onClick={() => runAction(() => deleteSubscriptionAction(subscription.id))}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
            Anterior
          </Button>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
};
