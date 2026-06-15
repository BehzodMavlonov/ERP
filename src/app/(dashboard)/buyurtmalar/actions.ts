"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { deductStockForOrder } from "@/lib/stock";
import { notifyAdmins } from "@/lib/telegram/notify";
import { formatSum } from "@/lib/format";

type OrderItemInput = {
  productId: string;
  quantity: number;
  price: number;
};

export async function createOrder(formData: FormData) {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerPhone = String(formData.get("customerPhone") ?? "").trim();
  const dueDateRaw = String(formData.get("dueDate") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim() || null;
  const itemsRaw = String(formData.get("items") ?? "[]");

  const items: OrderItemInput[] = JSON.parse(itemsRaw);
  const validItems = items.filter((item) => item.productId && item.quantity > 0);

  if (validItems.length === 0) {
    throw new Error("Kamida bitta mahsulot tanlanishi kerak");
  }

  let customerId: string | null = null;
  if (customerName) {
    const customer = await prisma.customer.create({
      data: { name: customerName, phone: customerPhone || null },
    });
    customerId = customer.id;
  }

  const totalAmount = validItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const order = await prisma.order.create({
    data: {
      customerId,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      note,
      totalAmount,
      items: {
        create: validItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  const itemsText = order.items.map((item) => `${item.product.name} x${item.quantity}`).join(", ");
  await notifyAdmins(
    `🆕 Yangi buyurtma: <b>#${order.id.slice(-6)}</b>\n` +
      `Mijoz: ${customerName || "Mijozsiz"}\n` +
      `Mahsulotlar: ${itemsText}\n` +
      `Jami: ${formatSum(totalAmount)}`
  );

  revalidatePath("/buyurtmalar");
}

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as OrderStatus;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id }, data: { status } });

    if (status === "READY" || status === "DELIVERED") {
      await deductStockForOrder(id, tx);
    }
  });

  revalidatePath("/buyurtmalar");
  revalidatePath("/ombor");
}

export async function deleteOrder(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.order.delete({ where: { id } });
  revalidatePath("/buyurtmalar");
}
