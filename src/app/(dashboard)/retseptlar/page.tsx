import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatSum } from "@/lib/format";
import { ProductDialog } from "./product-dialog";
import { DeleteProductButton } from "./delete-product-button";
import { ListChecks } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RetseptlarPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { recipeItems: { include: { ingredient: true } } },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Retseptlar</h1>
        <ProductDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>Tannarx</TableHead>
                <TableHead>Sotuv narxi</TableHead>
                <TableHead>Foyda</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Hozircha mahsulot yo&apos;q
                  </TableCell>
                </TableRow>
              )}
              {products.map((product) => {
                const cost = product.recipeItems.reduce(
                  (sum, item) =>
                    sum + Number(item.quantity) * Number(item.ingredient.costPerUnit),
                  0
                );
                const price = Number(product.price);
                const profit = price - cost;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatSum(cost)}</TableCell>
                    <TableCell>{formatSum(price)}</TableCell>
                    <TableCell className={profit < 0 ? "text-destructive" : ""}>
                      {formatSum(profit)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          render={
                            <Link href={`/retseptlar/${product.id}`}>
                              <ListChecks className="size-4" />
                            </Link>
                          }
                        />
                        <ProductDialog
                          product={{
                            id: product.id,
                            name: product.name,
                            price: product.price.toString(),
                          }}
                        />
                        <DeleteProductButton id={product.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
