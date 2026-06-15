"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeRecipeItem } from "../actions";

export function RemoveRecipeItemButton({
  id,
  productId,
}: {
  id: string;
  productId: string;
}) {
  const router = useRouter();

  async function handleRemove() {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("productId", productId);
    await removeRecipeItem(formData);
    router.refresh();
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleRemove}>
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}
