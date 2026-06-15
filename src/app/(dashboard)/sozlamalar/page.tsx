import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SetWebhookButton } from "./webhook-button";
import { RemoveLinkButton } from "./remove-link-button";

export const dynamic = "force-dynamic";

export default async function SozlamalarPage() {
  const links = await prisma.telegramLink.findMany({ orderBy: { createdAt: "desc" } });
  const botConfigured = !!process.env.TELEGRAM_BOT_TOKEN;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Sozlamalar</h1>

      <Card>
        <CardHeader>
          <CardTitle>Telegram bot</CardTitle>
          <CardDescription>
            {botConfigured
              ? "Bot tokeni sozlangan. Bildirishnomalarni qabul qilish uchun botga /start buyrug'ini yuboring."
              : "TELEGRAM_BOT_TOKEN muhit o'zgaruvchisi sozlanmagan. .env faylida tokenni kiriting."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {botConfigured && <SetWebhookButton />}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chat</TableHead>
                <TableHead>Ulangan sana</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Hozircha ulangan chat yo&apos;q. Botga /start yuboring.
                  </TableCell>
                </TableRow>
              )}
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.label ?? link.chatId}</TableCell>
                  <TableCell>{link.createdAt.toLocaleDateString("uz-UZ")}</TableCell>
                  <TableCell className="text-right">
                    <RemoveLinkButton id={link.id} />
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
