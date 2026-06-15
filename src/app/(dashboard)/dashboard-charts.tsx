"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { formatSum, formatNumber } from "@/lib/format";

export type TrendPoint = {
  date: string;
  income: number;
  expense: number;
};

export type TopProduct = {
  name: string;
  quantity: number;
};

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} tickFormatter={(v) => formatNumber(v)} />
        <Tooltip formatter={(value) => formatSum(Number(value))} />
        <Legend />
        <Line type="monotone" dataKey="income" name="Kirim" stroke="#16a34a" strokeWidth={2} />
        <Line type="monotone" dataKey="expense" name="Chiqim" stroke="#dc2626" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopProductsChart({ data }: { data: TopProduct[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" fontSize={12} />
        <YAxis type="category" dataKey="name" fontSize={12} width={120} />
        <Tooltip formatter={(value) => formatNumber(Number(value))} />
        <Bar dataKey="quantity" name="Sotilgan miqdor" fill="#6366f1" radius={4} />
      </BarChart>
    </ResponsiveContainer>
  );
}
