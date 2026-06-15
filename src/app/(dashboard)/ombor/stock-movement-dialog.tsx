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
import { addStockMovement } from "./actions";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { UNIT_LABELS } from "@/lib/format";

export function StockMovementDialog({
  ingredientId,
  unit,
}: {
  ingredientId: string;
  unit: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    formData.set("ingredientId", ingredientId);
    await addStockMovement(formData);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Kirim/Chiqim
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ombor harakati</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Turi</Label>
            <Select name="type" defaultValue="IN">
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">
                  <ArrowDownToLine className="size-4 text-green-600" />
                  Kirim
                </SelectItem>
                <SelectItem value="OUT">
                  <ArrowUpFromLine className="size-4 text-red-600" />
                  Chiqim
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">
              Miqdor ({UNIT_LABELS[unit] ?? unit})
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.001"
              min="0.001"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Izoh</Label>
            <Textarea id="note" name="note" rows={2} />
          </div>
          <DialogFooter>
            <Button type="submit">Saqlash</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
