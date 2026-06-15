import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/telegram/notify";
import { formatSum } from "@/lib/format";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayTx, monthTx, ingredients] = await Promise.all([
    prisma.transaction.findMany({ where: { date: { gte: startOfDay } } }),
    prisma.transaction.findMany({ where: { date: { gte: startOfMonth } } }),
    prisma.ingredient.findMany(),
  ]);

  const sum = (txs: typeof todayTx, type: "INCOME" | "EXPENSE") =>
    txs.filter((t) => t.type === type).reduce((acc, t) => acc + Number(t.amount), 0);

  const todayIncome = sum(todayTx, "INCOME");
  const todayExpense = sum(todayTx, "EXPENSE");
  const monthIncome = sum(monthTx, "INCOME");
  const monthExpense = sum(monthTx, "EXPENSE");

  const lowStock = ingredients.filter((i) => Number(i.stock) <= Number(i.minThreshold));

  let message =
    `📊 Kunlik hisobot — ${now.toLocaleDateString("uz-UZ")}\n\n` +
    `Bugun:\n` +
    `  Kirim: ${formatSum(todayIncome)}\n` +
    `  Chiqim: ${formatSum(todayExpense)}\n` +
    `  Sof: ${formatSum(todayIncome - todayExpense)}\n\n` +
    `Shu oy:\n` +
    `  Kirim: ${formatSum(monthIncome)}\n` +
    `  Chiqim: ${formatSum(monthExpense)}\n` +
    `  Sof: ${formatSum(monthIncome - monthExpense)}`;

  if (lowStock.length > 0) {
    message += `\n\n⚠️ Kam qolgan xomashyolar:\n`;
    message += lowStock.map((i) => `  ${i.name}: ${i.stock.toString()}`).join("\n");
  }

  await notifyAdmins(message);

  return Response.json({ ok: true });
}
