"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteTransaction } from "./actions";

export function DeleteTransactionButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Ushbu tranzaksiyani o'chirishni tasdiqlaysizmi?")) return;
    const formData = new FormData();
    formData.set("id", id);
    await deleteTransaction(formData);
    router.refresh();
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}
