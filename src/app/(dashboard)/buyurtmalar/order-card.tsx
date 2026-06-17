"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatSum, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/format";
import { cn } from "@/lib/utils";
import { updateOrderStatus, deleteOrder } from "./actions";
import { Trash2 } from "lucide-react";

export type OrderCardData = {
  id: string;
  status: string;
  totalAmount: string;
  dueDate: string | null;
  note: string | null;
  customer: { name: string; phone: string | null } | null;
  items: { quantity: number; product: { name: string } }[];
};

export function OrderCard({ order }: { order: OrderCardData }) {
  const router = useRouter();

  async function handleStatusChange(status: string | null) {
    if (!status) return;
    const formData = new FormData();
    formData.set("id", order.id);
    formData.set("status", status);
    await updateOrderStatus(formData);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Ushbu buyurtmani o'chirishni tasdiqlaysizmi?")) return;
    const formData = new FormData();
    formData.set("id", order.id);
    await deleteOrder(formData);
    router.refresh();
  }

  return (
    <Card className="overflow-hidden">
      <div className={cn("h-1 w-full", ORDER_STATUS_COLORS[order.status] ?? "bg-muted")} />
      <CardHeader className="flex items-start justify-between gap-2">
        <CardTitle className="text-sm">
          {order.customer?.name ?? "Mijozsiz"}
          {order.customer?.phone ? ` · ${order.customer.phone}` : ""}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ul className="text-sm text-muted-foreground">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.product.name} × {item.quantity}
            </li>
          ))}
        </ul>
        <p className="text-sm font-medium">{formatSum(order.totalAmount)}</p>
        {order.dueDate && (
          <p className="text-xs text-muted-foreground">
            Topshirish: {new Date(order.dueDate).toLocaleDateString("uz-UZ")}
          </p>
        )}
        {order.note && <p className="text-xs text-muted-foreground">{order.note}</p>}
        <Select value={order.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
