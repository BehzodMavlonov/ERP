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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UNIT_LABELS } from "@/lib/format";
import { createIngredient, updateIngredient } from "./actions";
import { Plus, Pencil } from "lucide-react";

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  stock: string;
  minThreshold: string;
  costPerUnit: string;
};

export function IngredientDialog({ ingredient }: { ingredient?: Ingredient }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEdit = !!ingredient;

  async function handleSubmit(formData: FormData) {
    if (isEdit) {
      formData.set("id", ingredient!.id);
      await updateIngredient(formData);
    } else {
      await createIngredient(formData);
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
              Yangi xomashyo
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Xomashyoni tahrirlash" : "Yangi xomashyo qo'shish"}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nomi</Label>
            <Input id="name" name="name" defaultValue={ingredient?.name} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="unit">O&apos;lchov birligi</Label>
              <Select name="unit" defaultValue={ingredient?.unit ?? "KG"}>
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(UNIT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="costPerUnit">Narxi (birlik uchun)</Label>
              <Input
                id="costPerUnit"
                name="costPerUnit"
                type="number"
                step="0.01"
                min="0"
                defaultValue={ingredient?.costPerUnit ?? "0"}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {!isEdit && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="stock">Boshlang&apos;ich qoldiq</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  step="0.001"
                  min="0"
                  defaultValue="0"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="minThreshold">Minimal chegara</Label>
              <Input
                id="minThreshold"
                name="minThreshold"
                type="number"
                step="0.001"
                min="0"
                defaultValue={ingredient?.minThreshold ?? "0"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEdit ? "Saqlash" : "Qo'shish"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
