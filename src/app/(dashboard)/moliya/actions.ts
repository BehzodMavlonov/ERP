"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function createTransaction(formData: FormData) {
  const type = String(formData.get("type")) as TransactionType;
  const amount = Number(formData.get("amount") ?? 0);
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const dateRaw = String(formData.get("date") ?? "").trim();

  if (amount <= 0) throw new Error("Summa 0 dan katta bo'lishi kerak");
  if (!category) throw new Error("Kategoriya tanlanishi shart");

  await prisma.transaction.create({
    data: {
      type,
      amount,
      category,
      description,
      date: dateRaw ? new Date(dateRaw) : new Date(),
    },
  });

  revalidatePath("/moliya");
}

export async function updateTransaction(formData: FormData) {
  const id = String(formData.get("id"));
  const type = String(formData.get("type")) as TransactionType;
  const amount = Number(formData.get("amount") ?? 0);
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const dateRaw = String(formData.get("date") ?? "").trim();

  if (amount <= 0) throw new Error("Summa 0 dan katta bo'lishi kerak");
  if (!category) throw new Error("Kategoriya tanlanishi shart");

  await prisma.transaction.update({
    where: { id },
    data: {
      type,
      amount,
      category,
      description,
      date: dateRaw ? new Date(dateRaw) : new Date(),
    },
  });

  revalidatePath("/moliya");
}

export async function deleteTransaction(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.transaction.delete({ where: { id } });
  revalidatePath("/moliya");
}
