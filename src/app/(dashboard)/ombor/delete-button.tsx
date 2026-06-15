"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteIngredient } from "./actions";
import { toast } from "sonner";

export function DeleteIngredientButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Ushbu xomashyoni o'chirishni tasdiqlaysizmi?")) return;
    const formData = new FormData();
    formData.set("id", id);
    try {
      await deleteIngredient(formData);
      router.refresh();
    } catch {
      toast.error("O'chirishda xatolik. Ehtimol bu xomashyo retseptda ishlatilgan.");
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}
