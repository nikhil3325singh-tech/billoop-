import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { useStore, type DocType } from "@/lib/store";
import { fmtDate, inr, totals } from "@/lib/calc";

export function DocList({ type }: { type: DocType }) {
  const { docs, deleteDoc } = useStore();
  const list = docs.filter((d) => d.type === type);
  const to = type === "quote" ? "/quotations/$id" : "/invoices/$id";
  const label = type === "quote" ? "Quotation" : "Invoice";
  return (
    <>
      <PageHeader
        title={type === "quote" ? "Quotations" : "Invoices"}
        subtitle={`${list.length} ${label.toLowerCase()}s`}
        actions={<Link to={to} params={{ id: "new" }} className="btn-primary">New {label.toLowerCase()}</Link>}
      />
      <div className="p-8">
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground border-b">
                <th className="text-left font-medium px-5 py-3">Number</th>
                <th className="text-left font-medium">Client</th>
                <th className="text-left font-medium">Date</th>
                <th className="text-left font-medium">Status</th>
                <th className="text-right font-medium">Total</th>
                <th className="px-5"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id} className="border-b border-foreground/5 last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-3"><Link to={to} params={{ id: d.id }} className="font-medium hover:text-primary">{d.number}</Link></td>
                  <td>{d.client.name || "—"}<div className="text-xs text-muted-foreground truncate max-w-xs">{d.subject}</div></td>
                  <td className="text-muted-foreground">{fmtDate(d.date)}</td>
                  <td><span className="text-[11px] px-2 py-0.5 rounded-full bg-honey/15">{d.status}</span></td>
                  <td className="text-right font-mono text-[13px]">{inr(totals(d).grand)}</td>
                  <td className="px-5 text-right">
                    <button className="p-1.5 hover:text-destructive" aria-label="Delete" onClick={() => confirm(`Delete ${d.number}?`) && deleteDoc(d.id)}><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">Nothing here yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
