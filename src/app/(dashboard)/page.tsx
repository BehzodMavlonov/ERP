import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
import { formatSum, formatNumber } from "@/lib/format";
import { TrendChart, TopProductsChart } from "./dashboard-charts";

export default async function DashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [ingredients, openOrdersCount, monthTransactions, trendTransactions, topProductItems] =
    await Promise.all([
      prisma.ingredient.findMany(),
      prisma.order.count({ where: { status: { in: ["NEW", "IN_PROGRESS", "READY"] } } }),
      prisma.transaction.findMany({ where: { date: { gte: startOfMonth } } }),
      prisma.transaction.findMany({
        where: { date: { gte: thirtyDaysAgo } },
        orderBy: { date: "asc" },
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

  const inventoryValue = ingredients.reduce(
    (sum, i) => sum + Number(i.stock) * Number(i.costPerUnit),
    0
  );
  const lowStockCount = ingredients.filter(
    (i) => Number(i.stock) <= Number(i.minThreshold)
  ).length;

  const monthIncome = monthTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthExpense = monthTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthNet = monthIncome - monthExpense;

  // Build 30-day trend, filling in zero days
  const trendMap = new Map<string, { income: number; expense: number }>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    trendMap.set(key, { income: 0, expense: 0 });
  }
  for (const t of trendTransactions) {
    const key = t.date.toISOString().slice(0, 10);
    const entry = trendMap.get(key);
    if (!entry) continue;
    if (t.type === "INCOME") entry.income += Number(t.amount);
    else entry.expense += Number(t.amount);
  }
  const trendData = Array.from(trendMap.entries()).map(([date, value]) => ({
    date: date.slice(5),
    income: value.income,
    expense: value.expense,
  }));

  const productIds = topProductItems.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p.name]));
  const topProducts = topProductItems.map((item) => ({
    name: productMap.get(item.productId) ?? "Noma'lum",
    quantity: item._sum.quantity ?? 0,
  }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Oylik kirim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">{formatSum(monthIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Oylik chiqim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-destructive">{formatSum(monthExpense)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Sof foyda (oy)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${monthNet < 0 ? "text-destructive" : ""}`}>
              {formatSum(monthNet)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Ombor qiymati</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatSum(inventoryValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Ochiq buyurtmalar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatNumber(openOrdersCount)}</p>
            {lowStockCount > 0 && (
              <p className="text-xs text-destructive mt-1">
                {lowStockCount} xomashyo kam qoldi
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kirim/Chiqim dinamikasi (30 kun)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={trendData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eng ko&apos;p sotilgan mahsulotlar</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Hozircha ma&apos;lumot yo&apos;q</p>
            ) : (
              <TopProductsChart data={topProducts} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
