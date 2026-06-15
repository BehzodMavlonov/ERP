"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeTelegramLink } from "./actions";

export function RemoveLinkButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleRemove() {
    const formData = new FormData();
    formData.set("id", id);
    await removeTelegramLink(formData);
    router.refresh();
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleRemove}>
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}
