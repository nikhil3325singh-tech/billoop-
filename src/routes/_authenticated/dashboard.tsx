import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { fmtDate, inr, totals } from "@/lib/calc";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Billoop" },
      { name: "description", content: "Overview of inventory, quotations, invoices and revenue for your electrical business." },
      { property: "og:title", content: "Dashboard — Billoop" },
      { property: "og:description", content: "Overview of inventory, quotations, invoices and revenue." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { items, docs, company } = useStore();
  const quotes = docs.filter((d) => d.type === "quote");
  const invoices = docs.filter((d) => d.type === "invoice");
  const revenue = invoices.reduce((s, d) => s + totals(d).grand, 0);
  const unpaid = invoices.filter((d) => d.status !== "Paid").length;
  const cats = new Set(items.map((i) => i.category)).size;
  const lowStock = items.filter((i) => i.category !== "Services" && i.stock <= 5);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    { k: "Inventory items", v: items.length, s: `across ${cats} categories`, tone: "text-muted-foreground" },
    { k: "Quotations", v: quotes.length, s: `${quotes.filter((q) => q.status === "Draft").length} drafts`, tone: "text-accent" },
    { k: "Invoices issued", v: invoices.length, s: `${unpaid} awaiting payment`, tone: "text-muted-foreground" },
    { k: "Billed revenue", v: inr(revenue).replace(/\.\d+$/, ""), s: "all invoices", tone: "text-primary" },
  ];

  return (
    <>
      <PageHeader
        title={`${greet}, ${company.name}`}
        subtitle="Here's what's happening in your business."
        actions={
          <>
            <Link to="/inventory" className="btn">New item</Link>
            <Link to="/quotations/$id" params={{ id: "new" }} className="btn-primary">New quotation</Link>
          </>
        }
      />
      <div className="p-8 space-y-8">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.k} className="bg-card/60 rounded-xl p-5 ring-1 ring-foreground/5">
              <div className="label-cap">{s.k}</div>
              <div className="font-display text-3xl mt-2">{s.v}</div>
              <div className={`text-xs mt-1 ${s.tone}`}>{s.s}</div>
            </div>
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-surface overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="text-sm font-semibold">Recent documents</div>
              <Link to="/quotations" className="text-xs text-primary">View all</Link>
            </div>
            {docs.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No quotations yet.{" "}
                <Link to="/quotations/$id" params={{ id: "new" }} className="text-primary underline">Create your first one</Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {docs.slice(0, 8).map((d) => (
                    <tr key={d.id} className="border-b border-foreground/5 last:border-0">
                      <td className="px-6 py-3">
                        <Link
                          to={d.type === "quote" ? "/quotations/$id" : "/invoices/$id"}
                          params={{ id: d.id }}
                          className="font-medium hover:text-primary"
                        >
                          {d.number}
                        </Link>
                        <div className="text-xs text-muted-foreground">{d.client.name || "—"}</div>
                      </td>
                      <td className="text-xs text-muted-foreground">{d.type === "quote" ? "Quotation" : "Invoice"}</td>
                      <td className="text-xs text-muted-foreground">{fmtDate(d.date)}</td>
                      <td><span className="text-[11px] px-2 py-0.5 rounded-full bg-honey/15">{d.status}</span></td>
                      <td className="px-6 text-right font-mono text-[13px]">{inr(totals(d).grand)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="space-y-4">
            <div className="card-surface p-5">
              <div className="text-sm font-semibold mb-3">Low stock</div>
              {lowStock.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">All items are well stocked.</p>
              ) : (
                lowStock.slice(0, 6).map((i) => (
                  <div key={i.id} className="flex justify-between text-[13px] py-1.5 border-b border-foreground/5 last:border-0">
                    <span className="truncate pr-2">{i.name}</span>
                    <span className="font-mono text-accent">{i.stock} {i.unit}</span>
                  </div>
                ))
              )}
            </div>
            <div className="card-surface p-5">
              <div className="text-sm font-semibold mb-3">Quick actions</div>
              <div className="grid gap-2">
                <Link to="/quotations/$id" params={{ id: "new" }} className="btn-primary">New quotation</Link>
                <Link to="/invoices/$id" params={{ id: "new" }} className="btn">New invoice</Link>
                <Link to="/company" className="btn">Edit company template</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
