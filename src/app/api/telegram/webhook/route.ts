import { webhookCallback } from "grammy";
import { bot } from "@/lib/telegram/bot";

export async function POST(req: Request) {
  if (!bot) {
    return new Response("Telegram bot sozlanmagan", { status: 200 });
  }

  const handler = webhookCallback(bot, "std/http");
  return handler(req);
}
