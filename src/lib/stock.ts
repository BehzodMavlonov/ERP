import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { notifyAdmins } from "@/lib/telegram/notify";
import { formatNumber, UNIT_LABELS } from "@/lib/format";

type TxClient = Prisma.TransactionClient;

/**
 * Buyurtma READY holatiga o'tganda, har bir OrderItem uchun retsept asosida
 * tegishli xomashyolardan avtomatik OUT harakati yaratiladi va ombor
 * qoldig'i kamaytiriladi. Agar bu buyurtma uchun harakat allaqachon
 * yaratilgan bo'lsa, qayta ayirilmaydi.
 */
export async function deductStockForOrder(orderId: string, tx: TxClient = prisma) {
  const existing = await tx.stockMovement.findFirst({ where: { orderId } });
  if (existing) return;

  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: { include: { recipeItems: true } } } } },
  });
  if (!order) return;

  const lowStockIngredients: { name: string; stock: string; minThreshold: string; unit: string }[] = [];

  for (const item of order.items) {
    for (const recipeItem of item.product.recipeItems) {
      const quantity = Number(recipeItem.quantity) * item.quantity;
      if (quantity <= 0) continue;

      await tx.stockMovement.create({
        data: {
          ingredientId: recipeItem.ingredientId,
          type: "OUT",
          quantity,
          note: `Buyurtma #${order.id.slice(-6)} uchun avtomatik ayirildi`,
          orderId: order.id,
        },
      });

      const ingredient = await tx.ingredient.update({
        where: { id: recipeItem.ingredientId },
        data: { stock: { decrement: quantity } },
      });

      if (Number(ingredient.stock) <= Number(ingredient.minThreshold)) {
        lowStockIngredients.push({
          name: ingredient.name,
          stock: ingredient.stock.toString(),
          minThreshold: ingredient.minThreshold.toString(),
          unit: ingredient.unit,
        });
      }
    }
  }

  for (const ingredient of lowStockIngredients) {
    await notifyAdmins(
      `⚠️ Kam qolgan xomashyo: <b>${ingredient.name}</b>\n` +
        `Qoldiq: ${formatNumber(ingredient.stock)} ${UNIT_LABELS[ingredient.unit]}\n` +
        `Minimal chegara: ${formatNumber(ingredient.minThreshold)} ${UNIT_LABELS[ingredient.unit]}`
    );
  }
}
