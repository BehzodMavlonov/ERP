"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Warehouse,
  ChefHat,
  ShoppingCart,
  Wallet,
  Settings,
  LogOut,
  Cookie,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOutAction } from "@/app/(dashboard)/actions";

const NAV_ITEMS = [
  { href: "/",            label: "Dashboard",    icon: LayoutDashboard },
  { href: "/ombor",       label: "Ombor",        icon: Warehouse },
  { href: "/retseptlar",  label: "Retseptlar",   icon: ChefHat },
  { href: "/buyurtmalar", label: "Buyurtmalar",  icon: ShoppingCart },
  { href: "/moliya",      label: "Moliya",       icon: Wallet },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* ── Logo ── */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={
              <Link href="/">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Cookie className="size-4" />
                </span>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold text-foreground">AishaCakes</span>
                  <span className="text-[11px] text-muted-foreground">ERP tizimi</span>
                </div>
              </Link>
            } />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Bosh menyu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      className="h-9 gap-3 text-[13px] font-medium"
                      render={
                        <Link href={item.href}>
                          <item.icon className="size-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Tizim
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/sozlamalar"}
                  tooltip="Sozlamalar"
                  className="h-9 gap-3 text-[13px] font-medium"
                  render={
                    <Link href="/sozlamalar">
                      <Settings className="size-4 shrink-0" />
                      <span>Sozlamalar</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-sidebar-border px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOutAction}>
              <SidebarMenuButton
                type="submit"
                tooltip="Chiqish"
                className="h-9 gap-3 text-[13px] font-medium text-muted-foreground hover:text-destructive"
              >
                <LogOut className="size-4 shrink-0" />
                <span>Chiqish</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
