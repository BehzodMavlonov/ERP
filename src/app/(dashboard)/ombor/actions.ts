"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Unit, StockMovementType } from "@prisma/client";
import { notifyAdmins } from "@/lib/telegram/notify";
import { formatNumber, UNIT_LABELS } from "@/lib/format";

export async function createIngredient(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "DONA") as Unit;
  const stock = Number(formData.get("stock") ?? 0);
  const minThreshold = Number(formData.get("minThreshold") ?? 0);
  const costPerUnit = Number(formData.get("costPerUnit") ?? 0);

  if (!name) throw new Error("Nomi kiritilishi shart");

  await prisma.ingredient.create({
    data: { name, unit, stock, minThreshold, costPerUnit },
  });

  revalidatePath("/ombor");
}

export async function updateIngredient(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "DONA") as Unit;
  const minThreshold = Number(formData.get("minThreshold") ?? 0);
  const costPerUnit = Number(formData.get("costPerUnit") ?? 0);

  if (!name) throw new Error("Nomi kiritilishi shart");

  await prisma.ingredient.update({
    where: { id },
    data: { name, unit, minThreshold, costPerUnit },
  });

  revalidatePath("/ombor");
}

export async function deleteIngredient(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.ingredient.delete({ where: { id } });
  revalidatePath("/ombor");
}

export async function addStockMovement(formData: FormData) {
  const ingredientId = String(formData.get("ingredientId"));
  const type = String(formData.get("type")) as StockMovementType;
  const quantity = Number(formData.get("quantity") ?? 0);
  const note = String(formData.get("note") ?? "").trim() || null;

  if (quantity <= 0) throw new Error("Miqdor 0 dan katta bo'lishi kerak");

  const ingredient = await prisma.$transaction(async (tx) => {
    await tx.stockMovement.create({
      data: { ingredientId, type, quantity, note },
    });

    return tx.ingredient.update({
      where: { id: ingredientId },
      data: {
        stock: {
          [type === "IN" ? "increment" : "decrement"]: quantity,
        },
      },
    });
  });

  if (Number(ingredient.stock) <= Number(ingredient.minThreshold)) {
    await notifyAdmins(
      `⚠️ Kam qolgan xomashyo: <b>${ingredient.name}</b>\n` +
        `Qoldiq: ${formatNumber(ingredient.stock.toString())} ${UNIT_LABELS[ingredient.unit]}\n` +
        `Minimal chegara: ${formatNumber(ingredient.minThreshold.toString())} ${UNIT_LABELS[ingredient.unit]}`
    );
  }

  revalidatePath("/ombor");
}
