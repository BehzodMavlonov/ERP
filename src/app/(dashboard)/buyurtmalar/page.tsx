import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/format";
import { cn } from "@/lib/utils";
import { OrderDialog } from "./order-dialog";
import { OrderCard } from "./order-card";

export const dynamic = "force-dynamic";

const STATUSES = ["NEW", "IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"] as const;

export default async function BuyurtmalarPage() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true, items: { include: { product: true } } },
    }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Buyurtmalar</h1>
        <OrderDialog
          products={products.map((p) => ({ id: p.id, name: p.name, price: p.price.toString() }))}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {STATUSES.map((status) => {
          const columnOrders = orders.filter((o) => o.status === status);
          return (
            <div key={status} className="flex flex-col gap-3">
              <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className={cn("size-2 rounded-full", ORDER_STATUS_COLORS[status])} />
                {ORDER_STATUS_LABELS[status]}
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                  {columnOrders.length}
                </span>
              </h2>
              <div className="flex flex-col gap-3">
                {columnOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={{
                      id: order.id,
                      status: order.status,
                      totalAmount: order.totalAmount.toString(),
                      dueDate: order.dueDate ? order.dueDate.toISOString() : null,
                      note: order.note,
                      customer: order.customer
                        ? { name: order.customer.name, phone: order.customer.phone }
                        : null,
                      items: order.items.map((item) => ({
                        quantity: item.quantity,
                        product: { name: item.product.name },
                      })),
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
