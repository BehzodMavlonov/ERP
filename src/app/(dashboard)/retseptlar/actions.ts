"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);

  if (!name) throw new Error("Nomi kiritilishi shart");

  const product = await prisma.product.create({
    data: { name, price },
  });

  revalidatePath("/retseptlar");
  return product;
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);

  if (!name) throw new Error("Nomi kiritilishi shart");

  await prisma.product.update({
    where: { id },
    data: { name, price },
  });

  revalidatePath("/retseptlar");
  revalidatePath(`/retseptlar/${id}`);
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/retseptlar");
}

export async function addRecipeItem(formData: FormData) {
  const productId = String(formData.get("productId"));
  const ingredientId = String(formData.get("ingredientId"));
  const quantity = Number(formData.get("quantity") ?? 0);

  if (quantity <= 0) throw new Error("Miqdor 0 dan katta bo'lishi kerak");

  await prisma.recipeItem.upsert({
    where: { productId_ingredientId: { productId, ingredientId } },
    create: { productId, ingredientId, quantity },
    update: { quantity },
  });

  revalidatePath(`/retseptlar/${productId}`);
  revalidatePath("/retseptlar");
}

export async function removeRecipeItem(formData: FormData) {
  const id = String(formData.get("id"));
  const productId = String(formData.get("productId"));

  await prisma.recipeItem.delete({ where: { id } });

  revalidatePath(`/retseptlar/${productId}`);
  revalidatePath("/retseptlar");
}
