import Link from "next/link";
import { notFound } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { formatNumber, formatSum, UNIT_LABELS } from "@/lib/format";
import { RecipeItemDialog } from "../recipe-item-dialog";
import { RemoveRecipeItemButton } from "./remove-recipe-item-button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { recipeItems: { include: { ingredient: true } } },
  });

  if (!product) notFound();

  const allIngredients = await prisma.ingredient.findMany({
    orderBy: { name: "asc" },
  });

  const usedIngredientIds = new Set(product.recipeItems.map((item) => item.ingredientId));
  const availableIngredients = allIngredients.filter((i) => !usedIngredientIds.has(i.id));

  const cost = product.recipeItems.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.ingredient.costPerUnit),
    0
  );
  const price = Number(product.price);
  const profit = price - cost;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          render={
            <Link href="/retseptlar">
              <ArrowLeft className="size-4" />
            </Link>
          }
        />
        <h1 className="text-2xl font-semibold">{product.name}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Tannarx</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatSum(cost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Sotuv narxi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatSum(price)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Foyda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${profit < 0 ? "text-destructive" : ""}`}>
              {formatSum(profit)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Retsept tarkibi</h2>
        <RecipeItemDialog productId={product.id} ingredients={availableIngredients} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Xomashyo</TableHead>
                <TableHead>Miqdori</TableHead>
                <TableHead>Narx/birlik</TableHead>
                <TableHead>Qiymati</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.recipeItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Hozircha ingredient qo&apos;shilmagan
                  </TableCell>
                </TableRow>
              )}
              {product.recipeItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.ingredient.name}</TableCell>
                  <TableCell>
                    {formatNumber(item.quantity.toString())} {UNIT_LABELS[item.ingredient.unit]}
                  </TableCell>
                  <TableCell>{formatSum(item.ingredient.costPerUnit.toString())}</TableCell>
                  <TableCell>
                    {formatSum(Number(item.quantity) * Number(item.ingredient.costPerUnit))}
                  </TableCell>
                  <TableCell className="text-right">
                    <RemoveRecipeItemButton id={item.id} productId={product.id} />
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
