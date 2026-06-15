"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TRANSACTION_CATEGORIES } from "@/lib/format";
import { X } from "lucide-react";

const ALL_CATEGORIES = [...TRANSACTION_CATEGORIES.INCOME, ...TRANSACTION_CATEGORIES.EXPENSE];

export function FilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/moliya?${params.toString()}`);
  }

  const type = searchParams.get("type") ?? "";
  const category = searchParams.get("category") ?? "";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const hasFilters = type || category || from || to;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={type || "ALL"} onValueChange={(v) => setParam("type", v === "ALL" ? null : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Turi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Barchasi</SelectItem>
          <SelectItem value="INCOME">Kirim</SelectItem>
          <SelectItem value="EXPENSE">Chiqim</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={category || "ALL"}
        onValueChange={(v) => setParam("category", v === "ALL" ? null : v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Kategoriya" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Barcha kategoriyalar</SelectItem>
          {ALL_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        className="w-40"
        value={from}
        onChange={(e) => setParam("from", e.target.value || null)}
      />
      <Input
        type="date"
        className="w-40"
        value={to}
        onChange={(e) => setParam("to", e.target.value || null)}
      />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push("/moliya")}>
          <X className="size-4" />
          Tozalash
        </Button>
      )}
    </div>
  );
}
