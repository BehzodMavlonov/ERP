export function formatSum(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("uz-UZ").format(num) + " so'm";
}

export function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("uz-UZ").format(num);
}

export const UNIT_LABELS: Record<string, string> = {
  KG: "kg",
  LITR: "litr",
  DONA: "dona",
  GRAM: "gram",
  ML: "ml",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: "Yangi",
  IN_PROGRESS: "Tayyorlanmoqda",
  READY: "Tayyor",
  DELIVERED: "Yetkazildi",
  CANCELLED: "Bekor qilindi",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-chart-3",
  IN_PROGRESS: "bg-chart-2",
  READY: "bg-chart-4",
  DELIVERED: "bg-chart-5",
  CANCELLED: "bg-muted-foreground",
};

export const TRANSACTION_CATEGORIES = {
  INCOME: ["Sotuv", "Boshqa kirim"],
  EXPENSE: [
    "Xomashyo",
    "Ijara",
    "Ish haqi",
    "Kommunal",
    "Transport",
    "Boshqa chiqim",
  ],
};
