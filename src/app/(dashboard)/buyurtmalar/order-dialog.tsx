"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatSum } from "@/lib/format";
import { createOrder } from "./actions";
import { Plus, Trash2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: string;
};

type Row = {
  productId: string;
  quantity: number;
  price: number;
};

export function OrderDialog({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const router = useRouter();

  function addRow() {
    const first = products[0];
    if (!first) return;
    setRows((prev) => [
      ...prev,
      { productId: first.id, quantity: 1, price: Number(first.price) },
    ]);
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function onProductChange(index: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    updateRow(index, { productId, price: product ? Number(product.price) : 0 });
  }

  const total = rows.reduce((sum, row) => sum + row.quantity * row.price, 0);

  async function handleSubmit(formData: FormData) {
    formData.set("items", JSON.stringify(rows));
    await createOrder(formData);
    setOpen(false);
    setRows([]);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setRows([]);
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Yangi buyurtma
          </Button>
        }
      />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Yangi buyurtma</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="customerName">Mijoz ismi</Label>
              <Input id="customerName" name="customerName" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="customerPhone">Telefon</Label>
              <Input id="customerPhone" name="customerPhone" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="dueDate">Topshirish sanasi</Label>
            <Input id="dueDate" name="dueDate" type="date" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Mahsulotlar</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRow}>
                <Plus className="size-4" />
                Qo&apos;shish
              </Button>
            </div>
            {rows.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Mahsulot qo&apos;shilmagan
              </p>
            )}
            {rows.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={row.productId}
                  onValueChange={(value) => onProductChange(index, value ?? "")}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  className="w-20"
                  value={row.quantity}
                  onChange={(e) => updateRow(index, { quantity: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-28"
                  value={row.price}
                  onChange={(e) => updateRow(index, { price: Number(e.target.value) })}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(index)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            {rows.length > 0 && (
              <p className="text-right text-sm font-medium">Jami: {formatSum(total)}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Izoh</Label>
            <Textarea id="note" name="note" rows={2} />
          </div>

          <DialogFooter>
            <Button type="submit">Qo&apos;shish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
