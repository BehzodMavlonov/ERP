"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setTelegramWebhook } from "./actions";
import { toast } from "sonner";

export function SetWebhookButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      await setTelegramWebhook();
      toast.success("Webhook muvaffaqiyatli o'rnatildi");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? "O'rnatilmoqda..." : "Webhookni o'rnatish"}
    </Button>
  );
}
