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
import { TRANSACTION_CATEGORIES } from "@/lib/format";
import { createTransaction, updateTransaction } from "./actions";
import { Plus, Pencil } from "lucide-react";

type Transaction = {
  id: string;
  type: string;
  amount: string;
  category: string;
  description: string | null;
  date: string;
};

export function TransactionDialog({ transaction }: { transaction?: Transaction }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">(
    (transaction?.type as "INCOME" | "EXPENSE") ?? "INCOME"
  );
  const router = useRouter();
  const isEdit = !!transaction;

  const categories = TRANSACTION_CATEGORIES[type];

  async function handleSubmit(formData: FormData) {
    formData.set("type", type);
    if (isEdit) {
      formData.set("id", transaction!.id);
      await updateTransaction(formData);
    } else {
      await createTransaction(formData);
    }
    setOpen(false);
    router.refresh();
  }

  const defaultDate = transaction?.date
    ? new Date(transaction.date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button>
              <Plus className="size-4" />
              Yangi tranzaksiya
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Tranzaksiyani tahrirlash" : "Yangi tranzaksiya"}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Turi</Label>
              <Select
                value={type}
                onValueChange={(value) => setType((value as "INCOME" | "EXPENSE") ?? "INCOME")}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Kirim</SelectItem>
                  <SelectItem value="EXPENSE">Chiqim</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Summa</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={transaction?.amount ?? "0"}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Kategoriya</Label>
              <Select name="category" defaultValue={transaction?.category ?? categories[0]}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Sana</Label>
              <Input id="date" name="date" type="date" defaultValue={defaultDate} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Izoh</Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              defaultValue={transaction?.description ?? ""}
            />
          </div>
          <DialogFooter>
            <Button type="submit">{isEdit ? "Saqlash" : "Qo'shish"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
