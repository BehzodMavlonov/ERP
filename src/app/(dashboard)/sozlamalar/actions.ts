"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { bot } from "@/lib/telegram/bot";

export async function removeTelegramLink(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.telegramLink.delete({ where: { id } });
  revalidatePath("/sozlamalar");
}

export async function setTelegramWebhook() {
  if (!bot) throw new Error("TELEGRAM_BOT_TOKEN sozlanmagan");

  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) throw new Error("NEXTAUTH_URL sozlanmagan");

  await bot.api.setWebhook(`${baseUrl}/api/telegram/webhook`);
  revalidatePath("/sozlamalar");
}
