import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatSum, UNIT_LABELS } from "@/lib/format";
import { IngredientDialog } from "./ingredient-dialog";
import { StockMovementDialog } from "./stock-movement-dialog";
import { DeleteIngredientButton } from "./delete-button";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OmborPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: "asc" },
  });

  const lowStockCount = ingredients.filter(
    (i) => Number(i.stock) <= Number(i.minThreshold)
  ).length;

  const totalValue = ingredients.reduce(
    (sum, i) => sum + Number(i.stock) * Number(i.costPerUnit),
    0
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ombor</h1>
        <IngredientDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Ombor qiymati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatSum(totalValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Kam qolgan xomashyolar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>Qoldiq</TableHead>
                <TableHead>Min. chegara</TableHead>
                <TableHead>Narx/birlik</TableHead>
                <TableHead>Qiymati</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Hozircha xomashyo yo&apos;q
                  </TableCell>
                </TableRow>
              )}
              {ingredients.map((ingredient) => {
                const isLow = Number(ingredient.stock) <= Number(ingredient.minThreshold);
                return (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {ingredient.name}
                        {isLow && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="size-3" />
                            Kam
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatNumber(ingredient.stock.toString())}{" "}
                      {UNIT_LABELS[ingredient.unit]}
                    </TableCell>
                    <TableCell>
                      {formatNumber(ingredient.minThreshold.toString())}{" "}
                      {UNIT_LABELS[ingredient.unit]}
                    </TableCell>
                    <TableCell>{formatSum(ingredient.costPerUnit.toString())}</TableCell>
                    <TableCell>
                      {formatSum(Number(ingredient.stock) * Number(ingredient.costPerUnit))}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <StockMovementDialog
                          ingredientId={ingredient.id}
                          unit={ingredient.unit}
                        />
                        <IngredientDialog
                          ingredient={{
                            id: ingredient.id,
                            name: ingredient.name,
                            unit: ingredient.unit,
                            stock: ingredient.stock.toString(),
                            minThreshold: ingredient.minThreshold.toString(),
                            costPerUnit: ingredient.costPerUnit.toString(),
                          }}
                        />
                        <DeleteIngredientButton id={ingredient.id} />
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
