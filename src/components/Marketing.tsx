import { Link } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { useSession } from "@/lib/auth";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Building2,
  Send,
} from "lucide-react";

export const BRAND = "Billoop";
export const COMPANY = "Focitech Pvt. Ltd.";

export function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <img
        src="/billoop-icon.png"
        alt="Billoop Logo"
        className="size-9 rounded-[10px] object-contain shadow-sm transition-transform group-hover:scale-105"
      />
      <span className="leading-tight">
        <span className="block font-display font-bold text-[16px] text-foreground tracking-tight">{BRAND}</span>
        <span className="block text-[10px] text-muted-foreground">by Focitech</span>
      </span>
    </Link>
  );
}

function FooterInquiryForm() {
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      toast.error("Please enter your email or phone number.");
      return;
    }
    setIsSent(true);
    toast.success("Thank you! Our Foci Tech team will contact you shortly.");
    setContact("");
    setNote("");
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
        Quick Inquiry / Callback
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Need assistance with custom pricing or electrical quotation setup? Leave your details below:
      </p>

      {isSent ? (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Inquiry received! We'll get back to you within 2 hours.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Email or Mobile No."
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="input !h-9 text-xs w-full bg-background border-border/80 focus:border-primary"
            required
          />
          <input
            type="text"
            placeholder="How can we help? (Optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input !h-9 text-xs w-full bg-background border-border/80 focus:border-primary"
          />
          <button
            type="submit"
            className="btn-primary !h-9 text-xs w-full flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Send className="size-3.5" />
            <span>Request Quick Callback</span>
          </button>
        </form>
      )}
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <BrandMark />
          <nav className="flex items-center gap-1 text-sm">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors"
              activeOptions={{ exact: true }}
              activeProps={{ className: "font-medium text-primary" }}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors"
              activeProps={{ className: "font-medium text-primary" }}
            >
              About Us
            </Link>
            <Link
              to="/pricing"
              className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors"
              activeProps={{ className: "font-medium text-primary" }}
            >
              Pricing
            </Link>
            {session ? (
              <Link to="/dashboard" className="btn-primary ml-2">
                Open dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary ml-2">
                  Start free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Comprehensive Rich Footer with Inquiry Form & Parent Company Info */}
      <footer className="border-t border-border/80 bg-panel/70 backdrop-blur text-foreground">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-8 space-y-12">
          {/* Main 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
            {/* Col 1: Brand & Parent Company Details */}
            <div className="md:col-span-4 space-y-4">
              <BrandMark />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Billoop is an intelligent quotation builder and GST tax billing engine designed specifically for electrical contractors, panel builders, and switchgear traders across India.
              </p>

              <div className="pt-2 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="size-3.5 text-primary shrink-0" />
                  <span>
                    Parent Company:{" "}
                    <a
                      href="https://focitech.in/about-us"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-foreground hover:text-primary transition-colors underline decoration-border/80 underline-offset-4"
                    >
                      Foci Tech Pvt. Ltd.
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span>Bareilly, Uttar Pradesh, India — 243122</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-primary shrink-0" />
                  <a href="mailto:support@focitech.in" className="hover:text-primary transition-colors">
                    support@focitech.in
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-primary shrink-0" />
                  <a href="tel:+919140469325" className="hover:text-primary transition-colors">
                    +91 91404 69325
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Solutions */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Solutions
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Quotation Maker
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    GST Tax Invoicing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Price List & Costing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    PDF & Word (.docx) Export
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Profit Margin Shield
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Company & Portal */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Company & Portal
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors font-medium text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-primary transition-colors">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="hover:text-primary transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/plans" className="hover:text-primary transition-colors">
                    My Plans & Billing
                  </Link>
                </li>
                <li>
                  <a
                    href="https://focitech.in/about-us"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span>Foci Tech Parent</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Quick Inquiry Form */}
            <div className="md:col-span-4">
              <div className="card-surface p-4 border border-border/80 rounded-2xl bg-card">
                <FooterInquiryForm />
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Compliance */}
          <div className="pt-8 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              © {new Date().getFullYear()} {COMPANY} All rights reserved.
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/about" className="hover:text-primary transition-colors">
                About Foci Tech
              </Link>
              <span>·</span>
              <a
                href="https://focitech.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                focitech.in
              </a>
              <span>·</span>
              <span>100% GST Compliant (India)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
