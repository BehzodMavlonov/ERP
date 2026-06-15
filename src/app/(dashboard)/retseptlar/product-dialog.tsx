"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createProduct, updateProduct } from "./actions";
import { Plus, Pencil } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: string;
};

export function ProductDialog({ product }: { product?: Product }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEdit = !!product;

  async function handleSubmit(formData: FormData) {
    if (isEdit) {
      formData.set("id", product!.id);
      await updateProduct(formData);
    } else {
      await createProduct(formData);
    }
    setOpen(false);
    router.refresh();
  }

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
              Yangi mahsulot
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nomi</Label>
            <Input id="name" name="name" defaultValue={product?.name} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Sotuv narxi</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.price ?? "0"}
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
