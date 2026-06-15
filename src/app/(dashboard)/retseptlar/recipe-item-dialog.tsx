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
import { addRecipeItem } from "./actions";
import { Plus } from "lucide-react";

type Ingredient = {
  id: string;
  name: string;
  unit: string;
};

export function RecipeItemDialog({
  productId,
  ingredients,
}: {
  productId: string;
  ingredients: Ingredient[];
}) {
  const [open, setOpen] = useState(false);
  const [ingredientId, setIngredientId] = useState(ingredients[0]?.id ?? "");
  const router = useRouter();

  const selected = ingredients.find((i) => i.id === ingredientId);

  async function handleSubmit(formData: FormData) {
    formData.set("productId", productId);
    formData.set("ingredientId", ingredientId);
    await addRecipeItem(formData);
    setOpen(false);
    router.refresh();
  }

  if (ingredients.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Ingredient qo&apos;shish
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retseptga ingredient qo&apos;shish</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ingredientId">Xomashyo</Label>
            <Select
              value={ingredientId}
              onValueChange={(value) => setIngredientId(value ?? "")}
            >
              <SelectTrigger id="ingredientId" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ingredients.map((ingredient) => (
                  <SelectItem key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">
              Miqdori {selected ? `(${UNIT_LABELS[selected.unit]})` : ""}
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.001"
              min="0"
              defaultValue="0"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Qo&apos;shish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
