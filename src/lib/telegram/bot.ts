import { Bot } from "grammy";
import { prisma } from "@/lib/prisma";
import { formatSum, ORDER_STATUS_LABELS } from "@/lib/format";

const token = process.env.TELEGRAM_BOT_TOKEN;

export const bot = token ? new Bot(token) : null;

if (bot) {
  bot.command("start", async (ctx) => {
    const chatId = String(ctx.chat.id);
    await prisma.telegramLink.upsert({
      where: { chatId },
      create: { chatId, label: ctx.chat.username ?? ctx.from?.first_name ?? null },
      update: {},
    });
    await ctx.reply(
      "AishaCakes ERP botiga xush kelibsiz!\n\n" +
        "Endi bildirishnomalar (kam qolgan xomashyo, yangi buyurtmalar, kunlik hisobotlar) shu chatga keladi.\n\n" +
        "Buyruqlar:\n" +
        "/kirim <summa> <izoh> — kirim qo'shish\n" +
        "/chiqim <summa> <izoh> — chiqim qo'shish\n" +
        "/hisobot — bugungi va oylik statistika\n" +
        "/buyurtmalar — ochiq buyurtmalar ro'yxati"
    );
  });

  bot.command("kirim", async (ctx) => {
    const args = ctx.match.trim();
    const match = args.match(/^([\d.,]+)\s*(.*)$/);
    if (!match) {
      await ctx.reply("Foydalanish: /kirim <summa> <izoh>\nMisol: /kirim 150000 Sotuv");
      return;
    }
    const amount = Number(match[1].replace(",", "."));
    const description = match[2].trim() || null;
    if (!amount || amount <= 0) {
      await ctx.reply("Summa noto'g'ri. Misol: /kirim 150000 Sotuv");
      return;
    }

    await prisma.transaction.create({
      data: { type: "INCOME", amount, category: "Boshqa kirim", description, date: new Date() },
    });
    await ctx.reply(`✅ Kirim qo'shildi: ${formatSum(amount)}${description ? `\nIzoh: ${description}` : ""}`);
  });

  bot.command("chiqim", async (ctx) => {
    const args = ctx.match.trim();
    const match = args.match(/^([\d.,]+)\s*(.*)$/);
    if (!match) {
      await ctx.reply("Foydalanish: /chiqim <summa> <izoh>\nMisol: /chiqim 50000 Transport");
      return;
    }
    const amount = Number(match[1].replace(",", "."));
    const description = match[2].trim() || null;
    if (!amount || amount <= 0) {
      await ctx.reply("Summa noto'g'ri. Misol: /chiqim 50000 Transport");
      return;
    }

    await prisma.transaction.create({
      data: { type: "EXPENSE", amount, category: "Boshqa chiqim", description, date: new Date() },
    });
    await ctx.reply(`✅ Chiqim qo'shildi: ${formatSum(amount)}${description ? `\nIzoh: ${description}` : ""}`);
  });

  bot.command("hisobot", async (ctx) => {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayTx, monthTx] = await Promise.all([
      prisma.transaction.findMany({ where: { date: { gte: startOfDay } } }),
      prisma.transaction.findMany({ where: { date: { gte: startOfMonth } } }),
    ]);

    const sum = (txs: typeof todayTx, type: "INCOME" | "EXPENSE") =>
      txs.filter((t) => t.type === type).reduce((acc, t) => acc + Number(t.amount), 0);

    const todayIncome = sum(todayTx, "INCOME");
    const todayExpense = sum(todayTx, "EXPENSE");
    const monthIncome = sum(monthTx, "INCOME");
    const monthExpense = sum(monthTx, "EXPENSE");

    await ctx.reply(
      `📊 Hisobot\n\n` +
        `Bugun:\n` +
        `  Kirim: ${formatSum(todayIncome)}\n` +
        `  Chiqim: ${formatSum(todayExpense)}\n` +
        `  Sof: ${formatSum(todayIncome - todayExpense)}\n\n` +
        `Shu oy:\n` +
        `  Kirim: ${formatSum(monthIncome)}\n` +
        `  Chiqim: ${formatSum(monthExpense)}\n` +
        `  Sof: ${formatSum(monthIncome - monthExpense)}`
    );
  });

  bot.command("buyurtmalar", async (ctx) => {
    const orders = await prisma.order.findMany({
      where: { status: { in: ["NEW", "IN_PROGRESS", "READY"] } },
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: "asc" },
    });

    if (orders.length === 0) {
      await ctx.reply("Hozircha ochiq buyurtmalar yo'q.");
      return;
    }

    const lines = orders.map((order) => {
      const items = order.items.map((item) => `${item.product.name} x${item.quantity}`).join(", ");
      return (
        `#${order.id.slice(-6)} — ${ORDER_STATUS_LABELS[order.status]}\n` +
        `  Mijoz: ${order.customer?.name ?? "Mijozsiz"}\n` +
        `  Mahsulotlar: ${items}\n` +
        `  Jami: ${formatSum(order.totalAmount.toString())}`
      );
    });

    await ctx.reply(`📋 Ochiq buyurtmalar (${orders.length}):\n\n${lines.join("\n\n")}`);
  });
}
