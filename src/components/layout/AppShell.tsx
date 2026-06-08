"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  ReceiptText,
  Settings,
  Tags,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Assinaturas", icon: CreditCard },
  { href: "/categories", label: "Categorias", icon: Tags },
  { href: "/calendar", label: "Calendário", icon: CalendarDays },
  { href: "/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/settings", label: "Configurações", icon: Settings },
];

const SidebarContent = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary">
          <ReceiptText className="size-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">SubTrack</p>
          <p className="mt-1 text-xs text-muted-foreground">Recurring OS</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground",
                active && "bg-sidebar-accent text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="border-t border-border p-3">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" type="submit">
          <LogOut className="size-4" />
          Sair
        </Button>
      </form>
    </div>
  );
};

interface AppShellProps {
  children: React.ReactNode;
  userName?: string | null;
}

export const AppShell = ({ children, userName }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm font-medium">Olá, {userName ?? "Caio"}</p>
              <p className="text-xs text-muted-foreground">Controle seus gastos recorrentes com precisão.</p>
            </div>
          </div>
          <Button size="icon" variant="outline">
            <Bell className="size-4" />
          </Button>
        </header>
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-auto w-full max-w-7xl p-4 md:p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
