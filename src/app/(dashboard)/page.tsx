import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { TrendingUp, TrendingDown, Wallet, Warehouse, ShoppingCart } from "lucide-react";

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
    <div className="flex flex-col gap-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Umumiy holat va statistika</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Oylik kirim"
          value={formatSum(monthIncome)}
          icon={TrendingUp}
          color="green"
          valueClassName="text-chart-2"
        />
        <StatCard
          title="Oylik chiqim"
          value={formatSum(monthExpense)}
          icon={TrendingDown}
          color="red"
          valueClassName="text-chart-4"
        />
        <StatCard
          title="Sof foyda"
          value={formatSum(monthNet)}
          icon={Wallet}
          color={monthNet < 0 ? "red" : "primary"}
          valueClassName={monthNet < 0 ? "text-chart-4" : "text-primary"}
        />
        <StatCard
          title="Ombor qiymati"
          value={formatSum(inventoryValue)}
          icon={Warehouse}
          color="amber"
        />
        <StatCard
          title="Ochiq buyurtmalar"
          value={formatNumber(openOrdersCount)}
          icon={ShoppingCart}
          color="blue"
          hint={lowStockCount > 0 ? `${lowStockCount} xomashyo kam qoldi` : undefined}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Kirim / Chiqim (30 kun)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={trendData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Eng ko&apos;p sotilgan mahsulotlar</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-muted-foreground">Hozircha ma&apos;lumot yo&apos;q</p>
              </div>
            ) : (
              <TopProductsChart data={topProducts} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
