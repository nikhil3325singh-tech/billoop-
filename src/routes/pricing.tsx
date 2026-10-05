import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, HelpCircle, ChevronDown, Sparkles, Shield, Zap, RefreshCw } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/Marketing";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Billoop by Foci Tech" },
      { name: "description", content: "Simple, transparent plans for electrical contractors and dealers: Starter, Business and Enterprise." },
      { property: "og:title", content: "Pricing — Billoop by Foci Tech" },
      { property: "og:description", content: "Simple plans for electrical contractors and dealers." },
    ],
  }),
  component: Pricing,
});

const faqs = [
  {
    q: "Can I import my current electrical price list from Excel?",
    a: "Yes! You can import your full inventory price list directly from Excel (.xlsx) or CSV files with item names, SKU, GST rates, costs, and selling prices in seconds.",
  },
  {
    q: "How does the GST calculation work on quotations and invoices?",
    a: "Billoop automatically handles intra-state (CGST + SGST) and inter-state (IGST) tax calculations with 0%, 5%, 12%, 18%, and 28% slabs. Grand totals and amounts in words are auto-formatted.",
  },
  {
    q: "Can I use my own company letterhead, stamp, and signature?",
    a: "Yes. You can upload your company logo, authorized digital signature, official company seal/stamp, or a full letterhead header image in the Company Template settings.",
  },
  {
    q: "Can I download quotes and invoices in editable Word (.docx) format?",
    a: "Yes! In addition to print-ready PDF downloads, the Business and Enterprise plans allow 1-click export to editable Microsoft Word (.docx) files so you can fine-tune text as needed.",
  },
  {
    q: "Can I cancel or upgrade my plan at any time?",
    a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time without any long-term lock-in or cancellation fees.",
  },
];

function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      name: "Starter",
      price: "Free",
      per: "",
      desc: "For individual electricians & small shops",
      cta: "Start free",
      hot: false,
      f: [
        "Up to 50 inventory items",
        "10 quotations / month",
        "Standard PDF download",
        "Company logo & signature",
        "Basic email support",
      ],
    },
    {
      name: "Business",
      price: annual ? "₹399" : "₹499",
      per: "/ month",
      billingNote: annual ? "billed ₹4,788 annually (save 20%)" : "billed monthly",
      desc: "For electrical contractors & dealers",
      cta: "Choose Business",
      hot: true,
      f: [
        "Unlimited inventory items",
        "Unlimited quotes & GST invoices",
        "PDF + Editable Word (.docx) download",
        "Custom letterhead, stamp & 3 layouts",
        "Profit, cost & margin costing shield",
        "Excel price list bulk import & export",
        "Priority WhatsApp & phone support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      per: "",
      desc: "For large firms & multi-branch dealers",
      cta: "Contact sales",
      hot: false,
      f: [
        "Everything in Business",
        "Multiple users & branch locations",
        "Custom quotation & invoice templates",
        "Dedicated account manager",
        "Custom ERP / Tally data export integration",
        "99.9% uptime SLA & priority support",
      ],
    },
  ];

  return (
    <SiteLayout>
      <div className="relative overflow-hidden">
        {/* Subtle Glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow -z-10" />

        <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="label-cap text-primary font-bold">Transparent Pricing</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Plans that grow with your business
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Simple and honest pricing built for electrical contractors, dealers, and panel manufacturers.
            </p>

            {/* Monthly / Annual Billing Switcher */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
                Monthly billing
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={annual}
                onClick={() => setAnnual(!annual)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  annual ? "bg-primary" : "bg-muted border border-border"
                }`}
              >
                <div
                  className={`size-5 rounded-full bg-white shadow-md transition-transform ${
                    annual ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
                  Annual billing
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-14 items-stretch">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`card-surface p-7 flex flex-col hover-lift relative transition-all duration-300 ${
                  p.hot
                    ? "ring-2 ring-primary border-primary/50 shadow-xl shadow-primary/10"
                    : "border border-border/70"
                }`}
              >
                {p.hot && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1 shadow-md">
                    <Sparkles className="size-3" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg text-foreground">{p.name}</div>
                </div>

                <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{p.desc}</p>

                <div className="mt-5 pb-4 border-b border-border/60">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                      {p.price}
                    </span>
                    {p.per && <span className="text-sm text-muted-foreground font-medium">{p.per}</span>}
                  </div>
                  {p.billingNote && (
                    <div className="text-[11px] text-muted-foreground mt-1">{p.billingNote}</div>
                  )}
                </div>

                <ul className="mt-6 space-y-3 text-xs sm:text-[13px] flex-1">
                  {p.f.map((x) => (
                    <li key={x} className="flex items-start gap-2.5">
                      <Check className="size-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{x}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`w-full text-center mt-8 !py-2.5 font-medium transition-transform ${
                    p.hot ? "btn-primary shadow-md hover:scale-[1.02]" : "btn hover:scale-[1.02]"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Trust Guarantees Strip */}
          <div className="grid sm:grid-cols-3 gap-6 mt-16 p-6 rounded-2xl bg-card border border-border/80 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="size-5 text-primary" />
              <div className="font-semibold text-sm">GST Compliant & Accurate</div>
              <p className="text-xs text-muted-foreground">Built to official Indian GST invoice standards and tax rules.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="size-5 text-primary" />
              <div className="font-semibold text-sm">Cancel Anytime</div>
              <p className="text-xs text-muted-foreground">No lock-in contracts. Switch or cancel your subscription whenever you want.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap className="size-5 text-primary" />
              <div className="font-semibold text-sm">Instant Setup</div>
              <p className="text-xs text-muted-foreground">Create account, load price list, and send your first quotation in under 5 minutes.</p>
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="mt-20 max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="label-cap text-primary font-bold">Frequently Asked Questions</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Got questions? We've got answers.
              </h2>
            </div>

            <div className="space-y-3 pt-6">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="card-surface border border-border/70 overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <HelpCircle className="size-4 text-primary shrink-0" />
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`size-4 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1">
                        <p className="pt-3">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
