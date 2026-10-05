import { useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Trash2, Plus, FileDown, FileText, Save, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/AppShell";
import { uid, useStore, type Doc, type DocType, type Item, type Line } from "@/lib/store";
import { amountInWords, docLabel, inr, lineBase, totals } from "@/lib/calc";
import { downloadPdf, downloadWord } from "@/lib/export";

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

const fromItem = (i: Item): Line => ({ id: uid(), itemId: i.id, name: i.name, unit: i.unit, qty: 1, rate: i.price, cost: i.cost, gst: i.gst, discount: 0 });

export function DocEditor({ type, id }: { type: DocType; id: string }) {
  const store = useStore();
  const { items, company, docs, saveDoc, nextNumber } = store;
  const navigate = useNavigate();

  const [doc, setDoc] = useState<Doc>(() => {
    const existing = docs.find((d) => d.id === id);
    if (existing) return existing;
    return {
      id: uid(), type, number: nextNumber(type), date: today(), dueDate: plusDays(15),
      client: { name: "", address: "", gstin: "", phone: "" }, subject: "", lines: [],
      notes: "", terms: type === "quote" ? company.quoteTerms : company.invoiceTerms,
      status: type === "quote" ? "Draft" : "Unpaid", interState: false,
    };
  });
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<"" | "pdf" | "word">("");

  const t = totals(doc);
  const setClient = (k: keyof Doc["client"], v: string) => setDoc({ ...doc, client: { ...doc.client, [k]: v } });
  const setLine = (lid: string, patch: Partial<Line>) => setDoc({ ...doc, lines: doc.lines.map((l) => (l.id === lid ? { ...l, ...patch } : l)) });
  const addLine = (l: Line) => setDoc((d) => ({ ...d, lines: [...d.lines, l] }));

  const matches = useMemo(
    () => (q ? items.filter((i) => [i.name, i.sku, i.category].join(" ").toLowerCase().includes(q.toLowerCase())) : items).slice(0, 8),
    [q, items],
  );

  const persist = () => {
    saveDoc(doc);
    if (id === "new") navigate({ to: type === "quote" ? "/quotations/$id" : "/invoices/$id", params: { id: doc.id }, replace: true });
  };

  const save = () => { persist(); toast.success(`${docLabel(type)} saved`); };

  const download = async (kind: "pdf" | "word") => {
    if (!doc.lines.length) { toast.error("Add at least one item first"); return; }
    setBusy(kind);
    try {
      persist();
      if (kind === "pdf") await downloadPdf(doc, company);
      else await downloadWord(doc, company);
    } catch (e) {
      console.error(e);
      toast.error("Could not create the file. Try smaller images in Company Template.");
    }
    setBusy("");
  };

  const toInvoice = () => {
    const inv: Doc = { ...doc, id: uid(), type: "invoice", number: nextNumber("invoice"), date: today(), dueDate: plusDays(15), status: "Unpaid", terms: company.invoiceTerms, lines: doc.lines.map((l) => ({ ...l, id: uid() })) };
    saveDoc({ ...doc, status: "Accepted" });
    saveDoc(inv);
    toast.success("Invoice created from quotation");
    navigate({ to: "/invoices/$id", params: { id: inv.id } });
  };

  const statuses = type === "quote" ? ["Draft", "Sent", "Accepted", "Rejected"] : ["Unpaid", "Partially paid", "Paid", "Cancelled"];

  return (
    <>
      <header className="flex items-center justify-between gap-4 px-8 py-4 border-b">
        <div>
          <div className="text-xs text-muted-foreground">
            <Link to={type === "quote" ? "/quotations" : "/invoices"} className="hover:text-primary">{type === "quote" ? "Quotations" : "Invoices"}</Link> / {doc.number}
          </div>
          <h1 className="text-lg font-semibold tracking-tight">{id === "new" ? `New ${docLabel(type).toLowerCase()}` : `${docLabel(type)} · ${doc.number}`}</h1>
        </div>
        <div className="flex items-center gap-2">
          <select className="field !w-auto" value={doc.status} onChange={(e) => setDoc({ ...doc, status: e.target.value })}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="btn-primary" onClick={save}><Save className="size-4" />Save</button>
        </div>
      </header>

      <div className="p-8 grid xl:grid-cols-3 gap-6 items-start">
        {/* Document */}
        <div className="xl:col-span-2 card-surface overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="text-sm font-semibold">{docLabel(type)} · {doc.number}</div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-honey/15 text-foreground/70">{doc.status}</span>
          </div>
          <div className="p-6">
            {company.letterhead ? (
              <img src={company.letterhead} alt="Letterhead" className="w-full mb-6 rounded" />
            ) : (
              <div className="flex items-start gap-3 mb-6">
                <Logo size="size-11" />
                <div className="leading-tight">
                  <div className="font-semibold text-sm">{company.name}</div>
                  <div className="text-[11px] text-muted-foreground">{[company.gstin && `GSTIN ${company.gstin}`, company.address].filter(Boolean).join(" · ")}</div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="label-cap">{type === "quote" ? "Quotation for" : "Bill to"}</div>
                <input className="field font-medium" placeholder="Client / company name" value={doc.client.name} onChange={(e) => setClient("name", e.target.value)} />
                <textarea className="field" rows={2} placeholder="Address" value={doc.client.address} onChange={(e) => setClient("address", e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <input className="field" placeholder="Phone" value={doc.client.phone} onChange={(e) => setClient("phone", e.target.value)} />
                  <input className="field" placeholder="Client GSTIN" value={doc.client.gstin} onChange={(e) => setClient("gstin", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <label><span className="label-cap">Number</span><input className="field mt-1 font-mono" value={doc.number} onChange={(e) => setDoc({ ...doc, number: e.target.value })} /></label>
                  <label><span className="label-cap">Date</span><input type="date" className="field mt-1" value={doc.date} onChange={(e) => setDoc({ ...doc, date: e.target.value })} /></label>
                </div>
                <label className="block"><span className="label-cap">{type === "quote" ? "Valid till" : "Due date"}</span><input type="date" className="field mt-1" value={doc.dueDate} onChange={(e) => setDoc({ ...doc, dueDate: e.target.value })} /></label>
                <label className="block"><span className="label-cap">Subject / project</span><input className="field mt-1" placeholder="e.g. 2BHK rewiring, Kothrud" value={doc.subject} onChange={(e) => setDoc({ ...doc, subject: e.target.value })} /></label>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground border-b">
                    <th className="text-left font-medium py-2">Item</th>
                    <th className="text-right font-medium w-16">Qty</th>
                    <th className="text-right font-medium w-24">Rate ₹</th>
                    <th className="text-right font-medium w-16">Disc%</th>
                    <th className="text-right font-medium w-16">GST%</th>
                    <th className="text-right font-medium w-24 pl-2">Amount</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[13px]">
                  {doc.lines.map((l) => (
                    <tr key={l.id} className="border-b border-foreground/5 align-top">
                      <td className="py-1.5 pr-2 font-sans">
                        <input className="field !py-1" value={l.name} onChange={(e) => setLine(l.id, { name: e.target.value })} />
                        <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">cost {inr(l.cost)} / {l.unit}</div>
                      </td>
                      <td className="py-1.5 pl-1"><input type="number" step="any" className="field !py-1 text-right" value={l.qty} onChange={(e) => setLine(l.id, { qty: parseFloat(e.target.value) || 0 })} /></td>
                      <td className="py-1.5 pl-1"><input type="number" step="any" className="field !py-1 text-right" value={l.rate} onChange={(e) => setLine(l.id, { rate: parseFloat(e.target.value) || 0 })} /></td>
                      <td className="py-1.5 pl-1"><input type="number" step="any" className="field !py-1 text-right" value={l.discount} onChange={(e) => setLine(l.id, { discount: parseFloat(e.target.value) || 0 })} /></td>
                      <td className="py-1.5 pl-1">
                        <select className="field !py-1 !px-1 text-right" value={l.gst} onChange={(e) => setLine(l.id, { gst: parseFloat(e.target.value) })}>{[0, 5, 12, 18, 28].map((g) => <option key={g}>{g}</option>)}</select>
                      </td>
                      <td className="py-2.5 pl-2 text-right whitespace-nowrap">{inr(lineBase(l))}</td>
                      <td className="py-1.5 text-right"><button aria-label="Remove" className="p-1.5 hover:text-destructive" onClick={() => setDoc({ ...doc, lines: doc.lines.filter((x) => x.id !== l.id) })}><Trash2 className="size-4" /></button></td>
                    </tr>
                  ))}
                  {doc.lines.length === 0 && (
                    <tr><td colSpan={7} className="py-8 text-center font-sans text-muted-foreground">Add items from inventory on the right →</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <button className="mt-3 text-sm text-primary inline-flex items-center gap-1" onClick={() => addLine({ id: uid(), name: "Custom item", unit: "pcs", qty: 1, rate: 0, cost: 0, gst: 18, discount: 0 })}>
              <Plus className="size-4" />Add custom line
            </button>

            <div className="mt-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="text-[12px] italic text-muted-foreground max-w-sm">{amountInWords(t.grand)}</div>
              <div className="w-full md:w-64 space-y-1.5 text-[13px] font-mono">
                <div className="flex justify-between"><span className="text-muted-foreground font-sans">Subtotal</span><span>{inr(t.subtotal)}</span></div>
                {doc.interState ? (
                  <div className="flex justify-between"><span className="text-muted-foreground font-sans">IGST</span><span>{inr(t.tax)}</span></div>
                ) : (
                  <>
                    <div className="flex justify-between"><span className="text-muted-foreground font-sans">CGST</span><span>{inr(t.cgst)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground font-sans">SGST</span><span>{inr(t.sgst)}</span></div>
                  </>
                )}
                <div className="flex justify-between text-muted-foreground"><span className="font-sans">Round off</span><span>{inr(t.roundOff)}</span></div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-1"><span className="font-sans">Grand total</span><span>{inr(t.grand)}</span></div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-dashed border-foreground/20 grid md:grid-cols-[1fr_auto] gap-6 items-end">
              <div className="space-y-2">
                <label className="block"><span className="label-cap">Notes</span><textarea rows={2} className="field mt-1" value={doc.notes} onChange={(e) => setDoc({ ...doc, notes: e.target.value })} /></label>
                <label className="block"><span className="label-cap">Terms & conditions</span><textarea rows={3} className="field mt-1" value={doc.terms} onChange={(e) => setDoc({ ...doc, terms: e.target.value })} /></label>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-muted-foreground mb-1">For {company.name}</div>
                <div className="h-14 w-44 border-b border-foreground/30 mb-1 flex items-end justify-center gap-1">
                  {company.stamp && <img src={company.stamp} alt="" className="h-12 opacity-80" />}
                  {company.signature ? <img src={company.signature} alt="Signature" className="h-12 object-contain" /> : <span className="font-display text-accent text-sm mb-1 -rotate-3">signature</span>}
                </div>
                <div className="text-[11px] text-muted-foreground">{company.signatoryName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 xl:sticky xl:top-4">
          <div className="card-surface p-5">
            <div className="text-sm font-semibold mb-3">Add from inventory</div>
            <input className="field" placeholder="Search items…" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="mt-2 max-h-72 overflow-y-auto">
              {matches.map((i) => (
                <button key={i.id} className="w-full flex items-center justify-between text-left text-[13px] py-2 px-1 border-b border-foreground/5 last:border-0 hover:bg-muted/50 rounded" onClick={() => { addLine(fromItem(i)); toast.success(`Added ${i.name}`); }}>
                  <span className="truncate pr-2">{i.name}<span className="block text-[11px] text-muted-foreground">{i.category} · stock {i.stock}</span></span>
                  <span className="font-mono text-muted-foreground shrink-0">{inr(i.price)}</span>
                </button>
              ))}
              {matches.length === 0 && <p className="text-[13px] text-muted-foreground py-3">No items. <Link to="/inventory" className="text-primary underline">Add to inventory</Link></p>}
            </div>
          </div>

          <div className="card-surface p-5">
            <div className="text-sm font-semibold mb-3">Costing</div>
            <div className="space-y-1.5 text-[13px] font-mono">
              <div className="flex justify-between"><span className="font-sans text-muted-foreground">Your cost</span><span>{inr(t.cost)}</span></div>
              <div className="flex justify-between"><span className="font-sans text-muted-foreground">Selling (pre-tax)</span><span>{inr(t.subtotal)}</span></div>
              <div className="flex justify-between font-semibold border-t pt-1.5"><span className="font-sans">Profit</span><span className={t.profit < 0 ? "text-destructive" : "text-primary"}>{inr(t.profit)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span className="font-sans">Margin</span><span>{t.subtotal ? ((t.profit / t.subtotal) * 100).toFixed(1) : "0.0"}%</span></div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={doc.interState} onChange={(e) => setDoc({ ...doc, interState: e.target.checked })} />
              Inter-state supply (IGST)
            </label>
            <p className="text-[11px] text-muted-foreground mt-2">Costing is only for you — it never appears on the downloaded file.</p>
          </div>

          <div className="card-surface p-5">
            <div className="text-sm font-semibold mb-3">Download</div>
            <button className="btn-primary w-full mb-2" disabled={!!busy} onClick={() => download("pdf")}><FileDown className="size-4" />{busy === "pdf" ? "Preparing…" : "Download PDF"}</button>
            <button className="btn w-full" disabled={!!busy} onClick={() => download("word")}><FileText className="size-4" />{busy === "word" ? "Preparing…" : "Download Word"}</button>
            {type === "quote" && (
              <button className="btn w-full mt-2" onClick={toInvoice}><ArrowRightLeft className="size-4" />Convert to invoice</button>
            )}
          </div>

          <div className="card-surface p-5">
            <div className="text-sm font-semibold mb-3">Company template</div>
            <div className="flex items-center gap-3">
              <Logo size="size-10" />
              <div className="leading-tight">
                <div className="text-[13px] font-medium">{company.name} · {company.style}</div>
                <div className="text-[11px] text-muted-foreground">
                  {[company.logo && "Logo", company.signature && "signature", company.stamp && "stamp", company.letterhead && "letterhead"].filter(Boolean).join(" + ") || "No logo or signature yet"}
                </div>
              </div>
            </div>
            <Link to="/company" className="btn w-full mt-3">Edit template</Link>
          </div>
        </div>
      </div>
    </>
  );
}
