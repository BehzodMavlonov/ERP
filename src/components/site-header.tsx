import { Bell, Search } from "lucide-react";
import { auth } from "@/lib/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export async function SiteHeader() {
  const session = await auth();
  const name = session?.user?.name ?? "Admin";
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-5">
      <SidebarTrigger className="-ml-1 text-muted-foreground" />

      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
        <input
          placeholder="Qidirish..."
          className="h-9 w-full rounded-full border border-border bg-background pl-9 pr-14 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 sm:flex">
          <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground">⌘</kbd>
          <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground">K</kbd>
        </span>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="relative size-9 rounded-full border-border text-muted-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
        </Button>

        <Avatar size="default">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {initial}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
