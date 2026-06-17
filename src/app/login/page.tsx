import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Cookie, Lock, User } from "lucide-react";

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
        const { redirect } = await import("next/navigation");
        redirect("/login?error=invalid");
      }
      throw err;
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/20">
            <Cookie className="size-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">AishaCakes ERP</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Konditerlik sexingizni<br />samarali boshqaring
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Buyurtmalar, ombor, moliya va retseptlarni bir joyda nazorat qiling. Telegram bot orqali tezkor bildirishnomalar oling.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Ombor", desc: "Real-time" },
              { label: "Buyurtmalar", desc: "Kanban board" },
              { label: "Moliya", desc: "Hisobotlar" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/10 p-3">
                <p className="text-white text-sm font-semibold">{item.label}</p>
                <p className="text-white/60 text-xs mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Cookie className="size-4" />
            </div>
            <span className="text-lg font-bold">AishaCakes ERP</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Xush kelibsiz!</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Davom etish uchun hisobingizga kiring
            </p>
          </div>

          <form action={login} className="flex flex-col gap-4">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Login
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="admin"
                  required
                  autoFocus
                  autoComplete="username"
                  className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Parol
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600">
                Login yoki parol noto&apos;g&apos;ri. Qaytadan urinib ko&apos;ring.
              </div>
            )}

            <button
              type="submit"
              className="mt-1 h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.99] cursor-pointer"
            >
              Kirish
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            AishaCakes ERP v1.0 · Barcha huquqlar himoyalangan
          </p>
        </div>
      </div>
    </div>
  );
}
