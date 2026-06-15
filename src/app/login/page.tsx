import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        username: formData.get("username"),
        password: formData.get("password"),
        redirectTo: "/",
      });
    } catch (err) {
      if (err instanceof AuthError) {
        const url = new URL(
          "/login",
          process.env.NEXTAUTH_URL ?? "http://localhost:3000"
        );
        url.searchParams.set("error", "invalid");
        const { redirect } = await import("next/navigation");
        redirect(`${url.pathname}?${url.searchParams.toString()}`);
      }
      throw err;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">AishaCakes ERP</CardTitle>
          <CardDescription>Tizimga kirish uchun login va parolni kiriting</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Login</Label>
              <Input id="username" name="username" type="text" required autoFocus />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Parol</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && (
              <p className="text-sm text-destructive">
                Login yoki parol noto&apos;g&apos;ri
              </p>
            )}
            <Button type="submit" className="w-full">
              Kirish
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
