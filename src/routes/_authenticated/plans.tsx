import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Check, Sparkles, Zap, Download, Shield, ArrowUpRight, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/plans")({
  head: () => ({
    meta: [
      { title: "My Plans & Subscription — Billoop" },
      { name: "description", content: "View and manage your active Billoop subscription plan and billing." },
    ],
  }),
  component: PlansPage,
});

const billingHistory = [
  { id: "INV-B-2026-003", date: "01 Oct 2026", plan: "Business Plan (Annual)", amount: "₹4,788", status: "Paid" },
  { id: "INV-B-2025-002", date: "01 Oct 2025", plan: "Business Plan (Annual)", amount: "₹4,788", status: "Paid" },
  { id: "INV-B-2024-001", date: "01 Oct 2024", plan: "Starter Plan", amount: "₹0", status: "Free" },
];

export function PlansPage() {
  const { items, docs } = useStore();
  const [currentPlan, setCurrentPlan] = useState<"Starter" | "Business" | "Enterprise">("Business");
  const [annual, setAnnual] = useState(true);

  const handleSelectPlan = (planName: "Starter" | "Business" | "Enterprise") => {
    setCurrentPlan(planName);
    toast.success(`Switched to ${planName} plan successfully!`);
  };

  const handleDownloadReceipt = (id: string) => {
    toast.success(`Receipt ${id} downloaded`);
  };

  return (
    <>
      <PageHeader
        title="My Plans & Subscription"
        subtitle="Manage your current plan, resource usage, and billing history"
      />

      <div className="p-8 max-w-5xl space-y-6">
        {/* Current Plan Overview Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-primary via-emerald-900 to-primary text-primary-foreground p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                <Sparkles className="size-3.5" />
                <span>Current Active Plan</span>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                {currentPlan} Plan
              </h2>
              <p className="text-sm opacity-90 max-w-md">
                Unlimited inventory items, GST invoices, profit margin shielding, and Word + PDF exports.
              </p>
            </div>

            <div className="space-y-2 bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 min-w-[220px]">
              <div className="text-xs text-white/80">Next billing date</div>
              <div className="font-semibold text-white">01 Oct 2027</div>
              <div className="text-xs text-emerald-200">Auto-renewal enabled</div>
            </div>
          </div>

          {/* Usage Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <div className="text-xs opacity-75">Inventory Items</div>
              <div className="text-xl font-bold font-mono mt-0.5">{items.length} / Unlimited</div>
            </div>
            <div>
              <div className="text-xs opacity-75">Documents Created</div>
              <div className="text-xl font-bold font-mono mt-0.5">{docs.length} / Unlimited</div>
            </div>
            <div>
              <div className="text-xs opacity-75">Export Formats</div>
              <div className="text-xl font-bold font-mono mt-0.5">PDF + Word (.docx)</div>
            </div>
          </div>
        </div>

        {/* Change / Upgrade Plan Section */}
        <div className="card-surface p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
            <div>
              <h3 className="font-semibold text-lg">Available Subscription Plans</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Upgrade or modify your subscription anytime</p>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-2.5 text-xs font-medium bg-muted/60 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  !annual ? "bg-card shadow text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                  annual ? "bg-card shadow text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-6">
            {/* Starter */}
            <div className={`rounded-xl p-5 border flex flex-col justify-between ${currentPlan === "Starter" ? "border-primary bg-primary/5" : "border-border/70"}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-base">Starter</div>
                  {currentPlan === "Starter" && <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">Current</span>}
                </div>
                <div className="font-display text-3xl font-bold">Free</div>
                <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />Up to 50 inventory items</li>
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />10 quotations / month</li>
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />Standard PDF download</li>
                </ul>
              </div>
              <button
                type="button"
                disabled={currentPlan === "Starter"}
                onClick={() => handleSelectPlan("Starter")}
                className="btn w-full mt-6 text-xs"
              >
                {currentPlan === "Starter" ? "Active Plan" : "Downgrade to Starter"}
              </button>
            </div>

            {/* Business */}
            <div className={`rounded-xl p-5 border-2 flex flex-col justify-between relative ${currentPlan === "Business" ? "border-primary bg-primary/5 shadow-md" : "border-border/70"}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-base text-primary">Business</div>
                  {currentPlan === "Business" && <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">Current</span>}
                </div>
                <div className="font-display text-3xl font-bold">
                  {annual ? "₹399" : "₹499"}
                  <span className="text-xs font-sans text-muted-foreground font-normal"> / mo</span>
                </div>
                <ul className="space-y-2 text-xs text-foreground/90 pt-2">
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />Unlimited inventory</li>
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />Unlimited quotes & invoices</li>
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />PDF + Editable Word (.docx)</li>
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />Letterhead, stamp & signature</li>
                </ul>
              </div>
              <button
                type="button"
                disabled={currentPlan === "Business"}
                onClick={() => handleSelectPlan("Business")}
                className="btn-primary w-full mt-6 text-xs"
              >
                {currentPlan === "Business" ? "Active Plan" : "Switch to Business"}
              </button>
            </div>

            {/* Enterprise */}
            <div className={`rounded-xl p-5 border flex flex-col justify-between ${currentPlan === "Enterprise" ? "border-primary bg-primary/5" : "border-border/70"}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-base">Enterprise</div>
                  {currentPlan === "Enterprise" && <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">Current</span>}
                </div>
                <div className="font-display text-3xl font-bold">Custom</div>
                <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />Multiple users & branches</li>
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />Custom ERP / Tally export</li>
                  <li className="flex gap-2"><Check className="size-3.5 text-primary shrink-0" />Dedicated account manager</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPlan("Enterprise")}
                className="btn w-full mt-6 text-xs"
              >
                Contact for Enterprise
              </button>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="font-semibold text-base">Invoices & Billing History</h3>
            <span className="text-xs text-muted-foreground">GST receipts</span>
          </div>

          <div className="divide-y divide-border/60">
            {billingHistory.map((b) => (
              <div key={b.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <div className="font-medium text-foreground">{b.plan}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{b.id} · {b.date}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-semibold">{b.amount}</div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {b.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadReceipt(b.id)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Download Receipt"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
