import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Shield,
  Zap,
  Users,
  ExternalLink,
  Code,
  Sparkles,
  MapPin,
  Mail,
  ArrowRight,
  Cpu,
  Target,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { SiteLayout } from "@/components/Marketing";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Billoop & Parent Company Focitech" },
      { name: "description", content: "Learn about Billoop and its parent company Focitech Pvt. Ltd., headquartered in Bareilly, Uttar Pradesh, India." },
      { property: "og:title", content: "About Us — Billoop & Focitech Pvt. Ltd." },
      { property: "og:description", content: "Pioneering technology solutions for electrical contractors and enterprise software engineering." },
    ],
  }),
  component: AboutPage,
});

const leadership = [
  {
    name: "Nikhil Singh",
    role: "Founder & Managing Director",
    bio: "Visionary founder driving business strategy, market expansion, and product engineering at Focitech Pvt. Ltd.",
    link: "https://focitech.in/team/nikhil-singh",
  },
  {
    name: "Deepesh Sharma",
    role: "Co-Founder & Chief Technology Officer",
    bio: "Full-stack architect & tech strategist leading modern software systems, AI integration, and cloud platforms at Focitech.",
    link: "https://focitech.in/deepesh-sharma",
  },
];

const coreValues = [
  {
    icon: Target,
    title: "Domain Precision",
    desc: "We build specialized software tailored specifically to the operational, costing, and GST requirements of Indian electrical contractors and dealers.",
  },
  {
    icon: Cpu,
    title: "Engineering Excellence",
    desc: "Powered by modern cloud architectures, lightning-fast rendering, and secure authentication built by Focitech engineers.",
  },
  {
    icon: HeartHandshake,
    title: "Customer-First Culture",
    desc: "Transparent pricing, zero hidden lock-ins, and direct support to empower small and medium electrical enterprises nationwide.",
  },
];

const parentServices = [
  "Custom SaaS & Web Application Development",
  "Generative AI & LLM Integration",
  "Cross-Platform Mobile Apps (iOS & Android)",
  "Cloud Architecture & High-Performance Backends",
  "Enterprise Digital Transformation & Consulting",
];

export function AboutPage() {
  return (
    <SiteLayout>
      <div className="relative overflow-hidden">
        {/* Ambient Subtle Glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow -z-10" />

        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-foreground">
              <Building2 className="size-3.5 text-primary" />
              <span>A Product of Focitech Pvt. Ltd.</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Empowering Electrical Businesses Through Modern Technology.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Billoop is engineered by <b>Focitech Pvt. Ltd.</b> to transform how electrical contractors, panel builders, and dealers manage inventory, calculate profits, and generate GST-compliant quotations and tax invoices.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 p-6 rounded-2xl bg-card border border-border/80 text-center shadow-sm">
            <div className="space-y-1">
              <div className="font-display text-3xl font-bold text-foreground">2023</div>
              <div className="text-xs text-muted-foreground font-medium">Founded by Focitech</div>
            </div>
            <div className="space-y-1">
              <div className="font-display text-3xl font-bold text-foreground">50,000+</div>
              <div className="text-xs text-muted-foreground font-medium">Quotes Generated</div>
            </div>
            <div className="space-y-1">
              <div className="font-display text-3xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground font-medium">GST Compliant</div>
            </div>
            <div className="space-y-1">
              <div className="font-display text-3xl font-bold text-foreground">Bareilly, UP</div>
              <div className="text-xs text-muted-foreground font-medium">Headquarters, India</div>
            </div>
          </div>
        </section>

        {/* About Parent Company Focitech Section */}
        <section className="border-t border-border/70 bg-card/40 backdrop-blur py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <span className="label-cap text-primary font-bold">About Our Parent Company</span>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Focitech Pvt. Ltd.
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Headquartered in Bareilly, Uttar Pradesh, India, <b>Focitech</b> is an innovative technology and software development company delivering high-performance SaaS applications, AI solutions, and digital transformation services to businesses across India and globally.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Billoop was born from Focitech's mission to solve real-world industry pain points — eliminating cumbersome manual Excel sheets and slow paperwork for electrical contractors with automated costing, branded dual-format exports (PDF & Word), and instantaneous GST compliance.
                </p>

                <div className="pt-2">
                  <a
                    href="https://focitech.in/about-us"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group"
                  >
                    <span>Visit Official Focitech Website (focitech.in)</span>
                    <ExternalLink className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Focitech Capabilities Card */}
              <div className="card-surface p-7 border border-border/80 shadow-lg bg-gradient-to-br from-card to-primary/5">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <Code className="size-5 text-primary" />
                  <h3 className="font-semibold text-base">Focitech Core Capabilities</h3>
                </div>
                <div className="space-y-3">
                  {parentServices.map((svc) => (
                    <div key={svc} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{svc}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" />Bareilly, UP, India</span>
                  <span className="flex items-center gap-1.5"><Mail className="size-3.5 text-primary" />support@focitech.in</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="label-cap text-primary font-bold">Leadership Team</span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Meet the Founders Behind Focitech
            </h2>
            <p className="text-sm text-muted-foreground">
              Passionate technologists and entrepreneurs dedicated to building reliable software products.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {leadership.map((leader) => (
              <div
                key={leader.name}
                className="card-surface p-6 border border-border/70 hover-lift flex flex-col justify-between"
              >
                <div>
                  <div className="size-12 rounded-xl bg-primary text-primary-foreground font-bold font-display text-lg grid place-items-center mb-4">
                    {leader.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{leader.name}</h3>
                  <div className="text-xs font-medium text-primary mt-0.5">{leader.role}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-border/50">
                  <a
                    href={leader.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section className="border-t border-border/70 bg-panel/30 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="label-cap text-primary font-bold">Our Philosophy</span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                What Drives Billoop
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {coreValues.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="card-surface p-6 border border-border/70 hover-lift">
                    <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-semibold text-base text-foreground mb-2">{v.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-2xl bg-primary text-primary-foreground p-10 sm:p-12 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">
                Experience Billoop Today.
              </h2>
              <p className="opacity-80 text-sm mt-1">
                Engineered with pride by Focitech Pvt. Ltd. Start creating quotations for free.
              </p>
            </div>
            <Link
              to="/signup"
              className="btn !bg-white !text-emerald-950 !font-bold !px-6 !py-3 hover:scale-105 transition-transform shrink-0 flex items-center gap-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
