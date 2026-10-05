import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LogOut,
  LayoutDashboard,
  Package,
  FileText,
  Receipt,
  Building2,
  Home,
  User,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { signOutUser } from "@/lib/auth";

const mainNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/quotations", label: "Quotations", icon: FileText },
  { to: "/invoices", label: "Invoices", icon: Receipt },
  { to: "/company", label: "Company Template", icon: Building2 },
] as const;

const accountNav = [
  { to: "/account", label: "My Account", icon: User },
  { to: "/plans", label: "My Plans", icon: CreditCard, badge: "Pro" },
] as const;

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "EC";
}

export function Logo({ size = "size-9" }: { size?: string }) {
  const { company } = useStore();
  if (company.logo) return <img src={company.logo} alt="" className={`${size} rounded-[10px] object-contain bg-card`} />;
  return (
    <img
      src="/billoop-icon.png"
      alt="Billoop"
      className={`${size} rounded-[10px] object-contain shadow-sm shrink-0`}
    />
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { company, ready } = useStore();
  const navigate = useNavigate();
  const signOut = async () => { await signOutUser(); navigate({ to: "/", replace: true }); };

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r bg-panel flex flex-col sticky top-0 h-screen print:hidden overflow-y-auto">
        <div className="px-5 pt-6 pb-5 border-b">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="leading-tight min-w-0">
              <div className="font-semibold text-[13px] tracking-tight truncate">{company.name}</div>
              <div className="text-[11px] text-muted-foreground truncate">Quotes & Billing</div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-4">
          <div className="space-y-0.5">
            <Link
              to="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-foreground/5 transition-colors"
            >
              <Home className="size-4" />
              <span>Home</span>
            </Link>
          </div>

          <div className="space-y-0.5">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </div>
            {mainNav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-foreground/5 transition-colors"
                activeProps={{ className: "!bg-primary !text-primary-foreground font-medium" }}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-0.5 pt-2 border-t border-border/60">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Account & Billing
            </div>
            {accountNav.map(({ to, label, icon: Icon, badge }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-foreground/5 transition-colors"
                activeProps={{ className: "!bg-primary !text-primary-foreground font-medium" }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4" />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-auto p-3 space-y-2 border-t border-border/60">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-foreground/5 transition-colors"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
          <div className="text-[10px] text-muted-foreground px-3">
            Billoop by Foci Tech Pvt. Ltd.
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{ready ? children : <div className="p-8 text-sm text-muted-foreground">Loading…</div>}</main>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4 px-8 py-4 border-b">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </header>
  );
}
