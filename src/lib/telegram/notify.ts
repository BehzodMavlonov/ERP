import { prisma } from "@/lib/prisma";
import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = token ? new Bot(token) : null;

export async function notifyAdmins(message: string) {
  if (!bot) return;

  const links = await prisma.telegramLink.findMany();
  for (const link of links) {
    try {
      await bot.api.sendMessage(link.chatId, message, { parse_mode: "HTML" });
    } catch {
      // Chat o'chirilgan yoki bot bloklangan bo'lishi mumkin - e'tiborsiz qoldiramiz
    }
  }
}
