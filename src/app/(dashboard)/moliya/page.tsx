import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatSum } from "@/lib/format";
import { TransactionDialog } from "./transaction-dialog";
import { DeleteTransactionButton } from "./delete-button";
import { FilterForm } from "./filter-form";
import type { Prisma, TransactionType } from "@prisma/client";

export default async function MoliyaPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;

  const where: Prisma.TransactionWhereInput = {};
  if (params.type) where.type = params.type as TransactionType;
  if (params.category) where.category = params.category;
  if (params.from || params.to) {
    where.date = {};
    if (params.from) where.date.gte = new Date(params.from);
    if (params.to) where.date.lte = new Date(`${params.to}T23:59:59`);
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  });

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const net = income - expense;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Moliya</h1>
        <TransactionDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Jami kirim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">{formatSum(income)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Jami chiqim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-destructive">{formatSum(expense)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Sof foyda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${net < 0 ? "text-destructive" : ""}`}>
              {formatSum(net)}
            </p>
          </CardContent>
        </Card>
      </div>

      <FilterForm />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sana</TableHead>
                <TableHead>Turi</TableHead>
                <TableHead>Kategoriya</TableHead>
                <TableHead>Izoh</TableHead>
                <TableHead>Summa</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Hozircha tranzaksiya yo&apos;q
                  </TableCell>
                </TableRow>
              )}
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date.toLocaleDateString("uz-UZ")}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === "INCOME" ? "default" : "destructive"}>
                      {t.type === "INCOME" ? "Kirim" : "Chiqim"}
                    </Badge>
                  </TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell className="text-muted-foreground">{t.description}</TableCell>
                  <TableCell
                    className={t.type === "INCOME" ? "text-green-600" : "text-destructive"}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {formatSum(t.amount.toString())}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TransactionDialog
                        transaction={{
                          id: t.id,
                          type: t.type,
                          amount: t.amount.toString(),
                          category: t.category,
                          description: t.description,
                          date: t.date.toISOString(),
                        }}
                      />
                      <DeleteTransactionButton id={t.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
