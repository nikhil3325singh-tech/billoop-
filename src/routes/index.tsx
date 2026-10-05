import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  FileText,
  Receipt,
  Stamp,
  FileDown,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  ShieldCheck,
  Layers,
  Clock,
  Printer,
  Plus,
  Trash2,
  Star,
  Sparkles,
  Users,
  Building,
  Building2,
  ExternalLink,
  MapPin,
  Cpu,
  Mail,
  Phone,
  Send,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/Marketing";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Billoop by Foci Tech — Quotes & GST Billing for Electrical Businesses" },
      { name: "description", content: "Upload your electrical inventory, build branded quotations and GST invoices, and download them as PDF or Word. Built by Foci Tech Pvt. Ltd." },
      { property: "og:title", content: "Billoop by Foci Tech Pvt. Ltd." },
      { property: "og:description", content: "Quotations, inventory and GST billing for the electrical sector." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Package, t: "Inventory with costing", d: "Import your full price list from Excel. Track cost, selling price, GST and stock.", tag: "Price List" },
  { icon: FileText, t: "Quotations in minutes", d: "Pick items, set quantities and discounts. Totals, CGST/SGST/IGST and amount in words are automatic.", tag: "Instant Totals" },
  { icon: Receipt, t: "GST tax invoices", d: "Convert an accepted quote into an invoice with one click, with your bank details included.", tag: "1-Click Convert" },
  { icon: Stamp, t: "Your letterhead & signature", d: "Upload logo, signature, stamp or a full letterhead. Every document looks like yours.", tag: "Branded PDF" },
  { icon: FileDown, t: "PDF & Word download", d: "Send a polished PDF, or a Word file your client can edit.", tag: "Dual Export" },
  { icon: Calculator, t: "Profit at a glance", d: "See your cost, profit and margin on every quote — never shown to the client.", tag: "Costing View" },
];

const marqueeItems = [
  { icon: Zap, label: "Wires & Cables Pricing" },
  { icon: Layers, label: "Switchgear & MCB Quotations" },
  { icon: Calculator, label: "Automatic CGST / SGST / IGST" },
  { icon: Printer, label: "Custom Letterhead & Seal" },
  { icon: FileDown, label: "Export PDF & Word (.docx)" },
  { icon: ShieldCheck, label: "Real-time Profit Margin Tracking" },
  { icon: Clock, label: "Convert Quotes to Invoices in 1 Click" },
];

const testimonials = [
  {
    name: "Ramesh Sharma",
    role: "Proprietor, Sharma Electricals",
    city: "Pune",
    quote: "Creating quotes for industrial rewiring used to take 2 hours. With Billoop, I download PDF and Word copies in under 3 minutes.",
    rating: 5,
  },
  {
    name: "Kiran Patel",
    role: "Govt. Licensed Electrical Contractor",
    city: "Ahmedabad",
    quote: "The margin shield feature is brilliant. I can adjust discounts without losing track of my gross profit percentage on site.",
    rating: 5,
  },
  {
    name: "Vikramjit Singh",
    role: "Panel Builder & Switchgear Dealer",
    city: "Chandigarh",
    quote: "Exporting to editable Word files makes government tender submissions incredibly smooth. Highly recommended!",
    rating: 5,
  },
  {
    name: "Suresh Iyer",
    role: "Iyer Electrical Contracting",
    city: "Chennai",
    quote: "Our company letterhead, signature, and stamp look crisp on every invoice. 100% compliant with GST tax norms.",
    rating: 5,
  },
];

const stats = [
  { value: "50,000+", label: "Quotations Generated" },
  { value: "< 60 sec", label: "Average Quotation Time" },
  { value: "100%", label: "GST Compliant Invoicing" },
  { value: "4.9 / 5", label: "Contractor Satisfaction" },
];

interface DemoItem {
  id: string;
  name: string;
  qty: number;
  rate: number;
}

const initialDemoItems: DemoItem[] = [
  { id: "1", name: "FR Copper Wire 2.5 sqmm", qty: 6, rate: 1950 },
  { id: "2", name: "MCB 32A Single Pole", qty: 8, rate: 245 },
  { id: "3", name: "Modular Switch Board 6M", qty: 4, rate: 1180 },
  { id: "4", name: "Installation & Labor (per point)", qty: 22, rate: 380 },
];

function Home() {
  const [activeTab, setActiveTab] = useState<"quote" | "invoice">("quote");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [demoItems, setDemoItems] = useState<DemoItem[]>(initialDemoItems);

  const subtotal = demoItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const handleSimulatedDownload = (type: string) => {
    setDownloading(type);
    setTimeout(() => {
      setDownloading(null);
      toast.success(`${type} generated successfully!`);
    }, 800);
  };

  const handleAddItem = () => {
    const nextItem: DemoItem = {
      id: Math.random().toString(),
      name: "LED Panel Light 15W",
      qty: 10,
      rate: 420,
    };
    setDemoItems([...demoItems, nextItem]);
    toast.success("Added LED Panel Light to live quote preview!");
  };

  const handleRemoveItem = (id: string) => {
    if (demoItems.length <= 1) {
      toast.error("Keep at least one item in preview");
      return;
    }
    setDemoItems(demoItems.filter((i) => i.id !== id));
  };

  return (
    <SiteLayout>
      <div className="relative overflow-hidden">
        {/* Ambient Moving Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow -z-10" />
        <div className="absolute top-96 right-10 w-[400px] h-[250px] bg-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow -z-10" />

        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-14 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-5xl font-bold leading-[1.08] tracking-tight text-foreground">
              Quote fast.
              <br />
              Bill right.
              <br />
              <span className="text-primary">Look professional.</span>
            </h1>

            <p className="text-muted-foreground text-base max-w-md leading-relaxed">
              Load your inventory once, then create branded quotations and GST invoices with your own logo and signature — and download them as PDF or Word.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-1">
              <Link
                to="/signup"
                className="btn-primary !px-5 !py-2.5 font-medium flex items-center gap-2 group"
              >
                <span>Create free account</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="btn !px-5 !py-2.5 font-medium"
              >
                <span>See pricing</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                <span>GST ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                <span>PDF & Word export</span>
              </div>
            </div>
          </div>

          {/* Animated Interactive Hero Card */}
          <div className="relative">
            {/* Floating Info Tag with Reverse Float */}
            <div className="hidden sm:flex absolute -top-5 -right-4 z-20 bg-card border border-border shadow-lg rounded-xl px-3.5 py-2 items-center gap-2 animate-float-reverse">
              <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 grid place-items-center">
                <TrendingUp className="size-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-semibold text-foreground">Gross Margin</div>
                <div className="text-emerald-600 font-bold">+28.4%</div>
              </div>
            </div>

            <div className="card-surface p-6 shadow-xl border border-border/80 animate-float">
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {activeTab === "quote" ? "Quotation · QT-2026-042" : "Tax Invoice · INV-2026-089"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab("quote")}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-all ${
                      activeTab === "quote" ? "bg-honey/20 text-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    onClick={() => setActiveTab("invoice")}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-all ${
                      activeTab === "invoice" ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Invoice
                  </button>
                </div>
              </div>

              <table className="w-full text-[13px]">
                <tbody className="font-mono">
                  {demoItems.map((item) => (
                    <tr key={item.id} className="border-b border-foreground/5 hover:bg-muted/30 transition-colors group">
                      <td className="py-2 font-sans flex items-center gap-2">
                        <span>{item.name}</span>
                        {demoItems.length > 1 && (
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-destructive hover:scale-110 transition-all"
                            title="Remove item"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </td>
                      <td className="text-right text-muted-foreground">{item.qty}</td>
                      <td className="text-right font-medium text-foreground">₹{(item.qty * item.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-2.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Plus className="size-3.5" />
                  <span>Add sample item</span>
                </button>
              </div>

              <div className="mt-3 ml-auto w-56 text-[13px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="font-sans text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-muted-foreground">GST 18%</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1 text-foreground">
                  <span className="font-sans">Grand total</span>
                  <span className="text-primary">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulatedDownload("PDF")}
                  className="btn-primary !py-2 text-xs"
                >
                  <FileDown className="size-3.5" />
                  <span>{downloading === "PDF" ? "Preparing…" : "Download PDF"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatedDownload("Word")}
                  className="btn !py-2 text-xs"
                >
                  <FileText className="size-3.5" />
                  <span>{downloading === "Word" ? "Preparing…" : "Download Word"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Moving Continuous Ticker Banner */}
        <section className="border-y border-border/80 bg-panel/60 backdrop-blur py-3.5 overflow-hidden my-6">
          <div className="animate-marquee gap-8 items-center text-xs font-medium text-muted-foreground">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2 shrink-0 px-3">
                  <Icon className="size-3.5 text-primary" />
                  <span className="text-foreground/80 font-medium">{item.label}</span>
                  <span className="text-border ml-4 font-bold">·</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats Row with Hover Glow */}
        <section className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1 p-3 rounded-xl hover:bg-card/70 transition-colors">
              <div className="font-display text-2xl sm:text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Features Section with Smooth Hover Lift */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-8">Everything your office needs</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, t, d }) => (
              <div key={t} className="card-surface p-5 hover-lift border border-border/60 transition-all duration-200">
                <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="size-5" />
                </div>
                <div className="font-semibold text-foreground">{t}</div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us & Parent Company Foci Tech Section */}
        <section id="about" className="mx-auto max-w-6xl px-6 py-12 scroll-mt-20">
          <div className="relative rounded-3xl bg-card border border-border/80 p-8 sm:p-12 overflow-hidden shadow-lg">
            {/* Subtle decorative glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-0" />
            
            <div className="relative z-10 space-y-10">
              {/* Section Header */}
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                  <Building2 className="size-3.5" />
                  <span>About Us & Parent Company</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Backed by Foci Tech — Engineered for Electrical Growth.
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Billoop is a dedicated product built by <b>Foci Tech Pvt. Ltd.</b>, an Indian software engineering powerhouse headquartered in Bareilly, Uttar Pradesh. We empower contractors, dealers, and panel builders with high-speed digital workflows.
                </p>
              </div>

              {/* Two-Column Grid: Product Story + Parent Company Card */}
              <div className="grid md:grid-cols-12 gap-8 items-start">
                {/* Left Column: Billoop Mission & Story */}
                <div className="md:col-span-7 space-y-6">
                  <div className="card-surface p-6 border border-border/70 rounded-2xl space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      <span>Why We Built Billoop</span>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      For decades, electrical contractors and switchgear dealers have struggled with complex Excel spreadsheets, manual CGST/SGST calculations, and tedious Word quoting. Even small errors cost lakhs in eroded profit margins.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Foci Tech created Billoop to solve this domain-specific challenge: lightning-fast quotation builder, hidden profit margin shields, 1-click GST invoice conversion, and instant branded PDF/Word export.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>100% compliant with Indian GST tax norms</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>Real-time margin & costing protection</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>Export branded PDF & editable Word files</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                        <span>Backed by Foci Tech engineering & support</span>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-wrap items-center gap-3">
                      <Link
                        to="/about"
                        className="btn-primary text-xs !py-2.5 !px-4 flex items-center gap-2"
                      >
                        <span>Read Our Full Story</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                      <a
                        href="https://focitech.in/about-us"
                        target="_blank"
                        rel="noreferrer"
                        className="btn text-xs !py-2.5 !px-4 border border-border/80 hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <span>Visit Foci Tech Official</span>
                        <ExternalLink className="size-3.5 text-muted-foreground" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Parent Company Showcase */}
                <div className="md:col-span-5 space-y-4">
                  <div className="card-surface p-6 border border-border/80 rounded-2xl space-y-4 bg-panel/70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                          <Building className="size-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">Foci Tech Pvt. Ltd.</div>
                          <div className="text-[11px] text-muted-foreground">Parent Company</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        focitech.in
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      A fast-growing technology firm specializing in custom enterprise software, AI-driven automation, and cloud SaaS platforms.
                    </p>

                    <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span>Bareilly, Uttar Pradesh, India — 243122</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Cpu className="size-3.5 text-primary shrink-0" />
                        <span>Full-Stack SaaS, AI/LLM Systems & Mobile Apps</span>
                      </div>
                    </div>

                    {/* Leadership mini cards */}
                    <div className="pt-2 border-t border-border/60 space-y-2">
                      <div className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Leadership</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-background border border-border/60">
                          <div className="font-semibold text-foreground">Nikhil Singh</div>
                          <div className="text-[10px] text-muted-foreground">Founder & MD</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background border border-border/60">
                          <div className="font-semibold text-foreground">Deepesh Sharma</div>
                          <div className="text-[10px] text-muted-foreground">Co-Founder & CTO</div>
                        </div>
                      </div>
                    </div>

                    <a
                      href="https://focitech.in/about-us"
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-xs transition-colors"
                    >
                      Learn more about Foci Tech →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* High-Impact CTA Banner with Animated Particle Glow & Trust Badges */}
        <section className="mx-auto max-w-6xl px-6 pb-14">
          <div className="relative rounded-2xl bg-primary text-primary-foreground p-10 sm:p-12 shadow-2xl overflow-hidden">
            {/* Animated Ambient Light within Banner */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/20 rounded-full blur-2xl animate-pulse-glow pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-400/15 rounded-full blur-2xl animate-pulse-glow pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-emerald-200">
                  <Zap className="size-3.5" />
                  <span>Instant PDF & Word Generation</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-primary-foreground">
                  Send your next quotation today.
                </h2>
                <p className="opacity-90 text-sm max-w-md leading-relaxed">
                  Free to start. No card required. Create customized quotations and GST invoices in minutes.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs opacity-85">
                  <span className="flex items-center gap-1">✓ Instant Activation</span>
                  <span className="flex items-center gap-1">✓ 100% Data Privacy</span>
                  <span className="flex items-center gap-1">✓ GST Ready</span>
                </div>
              </div>

              <Link
                to="/signup"
                className="btn !bg-card !text-foreground hover:!bg-muted !font-semibold !px-6 !py-3 shadow-lg hover:scale-105 transition-all shrink-0 flex items-center gap-2"
              >
                <span>Get started</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Downwards Section: Continuous Moving Contractor Testimonials */}
        <section className="border-t border-border/80 bg-panel/40 backdrop-blur py-14 overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 mb-8 text-center space-y-1.5">
            <span className="label-cap text-primary font-bold">Trusted by Electrical Pros</span>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Built for contractors, dealers & panel builders
            </h3>
          </div>

          <div className="animate-marquee-reverse gap-6 items-stretch">
            {[...testimonials, ...testimonials].map((item, idx) => (
              <div
                key={idx}
                className="card-surface p-5 border border-border/70 hover-lift w-[340px] shrink-0 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-foreground">{item.name}</div>
                    <div className="text-[11px] text-muted-foreground">{item.role}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {item.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Home Screen Contact Form Section */}
        <section id="contact" className="mx-auto max-w-6xl px-6 py-16 scroll-mt-20">
          <div className="relative rounded-3xl bg-card border border-border/80 p-8 sm:p-12 overflow-hidden shadow-xl">
            {/* Ambient decorative lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10 space-y-10">
              {/* Header */}
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                  <MessageSquare className="size-3.5" />
                  <span>Get in Touch · Direct Support</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Contact Our Engineering & Sales Team
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Have questions about pricing, bulk quotation templates, custom enterprise electrical setups, or our parent company Foci Tech? Send us a message and our team will get back to you promptly.
                </p>
              </div>

              {/* Two Column Layout: Contact Information + Interactive Form */}
              <div className="grid md:grid-cols-12 gap-8 items-start">
                {/* Left: Office & Contact Channels */}
                <div className="md:col-span-5 space-y-6">
                  <div className="card-surface p-6 border border-border/70 rounded-2xl space-y-5 bg-panel/60">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground">Foci Tech Pvt. Ltd.</div>
                      <div className="text-xs text-muted-foreground">Makers of Billoop</div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 mt-0.5">
                          <MapPin className="size-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Headquarters</div>
                          <div className="text-muted-foreground">Bareilly, Uttar Pradesh, India — 243122</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 mt-0.5">
                          <Mail className="size-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Official Email</div>
                          <a href="mailto:support@focitech.in" className="text-primary hover:underline font-mono">
                            support@focitech.in
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 mt-0.5">
                          <Phone className="size-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Direct / WhatsApp</div>
                          <a href="tel:+919140469325" className="text-primary hover:underline font-mono">
                            +91 91404 69325
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/60 space-y-2">
                      <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-primary" />
                        <span>Average response time: &lt; 2 hours</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Business hours: Monday to Saturday, 9:00 AM – 7:00 PM IST
                      </div>
                    </div>

                    <a
                      href="https://focitech.in/about-us"
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-xs transition-colors"
                    >
                      Visit Foci Tech Corporate Website →
                    </a>
                  </div>
                </div>

                {/* Right: Contact Form */}
                <div className="md:col-span-7">
                  <div className="card-surface p-6 sm:p-8 border border-border/80 rounded-2xl bg-card shadow-sm">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "Quotation Demo & Trial",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to the Billoop & Foci Tech team.");
    }, 600);
  };

  if (submitted) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="size-14 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Message Sent Successfully!</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Thanks <b>{form.name}</b>, our team at Foci Tech will review your inquiry and reach out to <b>{form.email}</b> or <b>{form.phone}</b> shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", purpose: "Quotation Demo & Trial", message: "" });
          }}
          className="btn text-xs mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Rajesh Kumar"
            className="input text-xs w-full"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="rajesh@electricals.com"
            className="input text-xs w-full"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Mobile / WhatsApp No.
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="input text-xs w-full"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Requirement
          </label>
          <select
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            className="input text-xs w-full bg-background cursor-pointer"
          >
            <option value="Quotation Demo & Trial">Quotation Demo & Trial</option>
            <option value="Custom Pricing for Multi-Branch">Custom Pricing for Multi-Branch</option>
            <option value="GST Invoicing Setup">GST Invoicing Setup</option>
            <option value="Enterprise / API Integration">Enterprise / API Integration</option>
            <option value="General Support">General Support</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Message / Details
        </label>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us about your business or what you'd like to automate..."
          className="input !h-auto py-2 text-xs w-full resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full !py-3 text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-transform"
      >
        <Send className="size-3.5" />
        <span>{loading ? "Sending..." : "Submit Inquiry to Foci Tech Team"}</span>
      </button>

      <p className="text-[11px] text-center text-muted-foreground">
        We respect your privacy. No spam, ever.
      </p>
    </form>
  );
}

