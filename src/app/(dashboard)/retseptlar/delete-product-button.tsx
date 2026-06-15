"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "./actions";
import { toast } from "sonner";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Ushbu mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    const formData = new FormData();
    formData.set("id", id);
    try {
      await deleteProduct(formData);
      router.refresh();
    } catch {
      toast.error("O'chirishda xatolik. Ehtimol bu mahsulot buyurtmalarda ishlatilgan.");
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}
