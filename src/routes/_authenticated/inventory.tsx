import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Pencil, Trash2, Upload, Download, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { uid, useStore, type Item } from "@/lib/store";
import { inr } from "@/lib/calc";

export const Route = createFileRoute("/_authenticated/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Billoop" },
      { name: "description", content: "Manage electrical items, cost price, selling price, GST and stock." },
      { property: "og:title", content: "Inventory — Billoop" },
      { property: "og:description", content: "Manage electrical items, costing and stock." },
    ],
  }),
  component: Inventory,
});

const blank = (): Item => ({ id: uid(), name: "", sku: "", category: "", unit: "pcs", cost: 0, price: 0, gst: 18, stock: 0 });

function parseCsv(text: string): Item[] {
  const rows = text.split(/\r?\n/).filter((r) => r.trim());
  if (rows.length < 2) return [];
  const split = (r: string) => r.match(/("([^"]|"")*"|[^,]*)(,|$)/g)!.map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"').trim());
  const head = split(rows[0] ?? "").map((h) => h.toLowerCase());
  const idx = (...k: string[]) => head.findIndex((h) => k.some((x) => h.includes(x)));
  const c = { name: idx("name", "item", "desc"), sku: idx("sku", "code"), cat: idx("cat"), unit: idx("unit", "uom"), cost: idx("cost", "purchase"), price: idx("price", "rate", "sell", "mrp"), gst: idx("gst", "tax"), stock: idx("stock", "qty", "quantity") };
  const num = (v?: string) => parseFloat((v || "").replace(/[^0-9.]/g, "")) || 0;
  return rows.slice(1).map((r) => {
    const v = split(r);
    return { id: uid(), name: v[c.name] || "", sku: v[c.sku] || "", category: v[c.cat] || "General", unit: v[c.unit] || "pcs", cost: num(v[c.cost]), price: num(v[c.price]), gst: c.gst >= 0 ? num(v[c.gst]) : 18, stock: num(v[c.stock]) };
  }).filter((i) => i.name);
}

function Inventory() {
  const { items, saveItem, addItems, deleteItem } = useStore();
  const [edit, setEdit] = useState<Item | null>(null);
  const [q, setQ] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((i) => [i.name, i.sku, i.category].join(" ").toLowerCase().includes(q.toLowerCase()));

  const onCsv = async (f: File) => {
    const parsed = parseCsv(await f.text());
    if (!parsed.length) { toast.error("No items found. Check the CSV has a header row with Name, Price etc."); return; }
    addItems(parsed);
    toast.success(`${parsed.length} items imported`);
  };

  const sample = () => {
    const csv = "Name,SKU,Category,Unit,Cost,Price,GST,Stock\nFR Copper Wire 1.5 sqmm,WIR-15,Wires & Cables,coil,1100,1350,18,25\nMCB 16A SP,MCB-16,Switchgear,pcs,150,190,18,100\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "inventory-sample.csv";
    a.click();
  };

  return (
    <>
      <PageHeader
        title="Inventory"
        subtitle={`${items.length} items · cost & selling price used in quotations`}
        actions={
          <>
            <button className="btn" onClick={sample}><Download className="size-4" />Sample CSV</button>
            <button className="btn" onClick={() => fileRef.current?.click()}><Upload className="size-4" />Import CSV / Excel</button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onCsv(f); e.target.value = ""; }} />
            <button className="btn-primary" onClick={() => setEdit(blank())}><Plus className="size-4" />Add item</button>
          </>
        }
      />
      <div className="p-8 space-y-4">
        <input className="field max-w-sm" placeholder="Search name, SKU or category…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground border-b">
                <th className="text-left font-medium px-5 py-3">Item</th>
                <th className="text-left font-medium">Category</th>
                <th className="text-right font-medium">Cost</th>
                <th className="text-right font-medium">Price</th>
                <th className="text-right font-medium">Margin</th>
                <th className="text-right font-medium">GST</th>
                <th className="text-right font-medium">Stock</th>
                <th className="px-5"></th>
              </tr>
            </thead>
            <tbody className="font-mono text-[13px]">
              {filtered.map((i) => {
                const m = i.price ? ((i.price - i.cost) / i.price) * 100 : 0;
                return (
                  <tr key={i.id} className="border-b border-foreground/5 last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-2.5 font-sans">
                      <div className="font-medium">{i.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{i.sku} · per {i.unit}</div>
                    </td>
                    <td className="font-sans text-muted-foreground">{i.category}</td>
                    <td className="text-right">{inr(i.cost)}</td>
                    <td className="text-right">{inr(i.price)}</td>
                    <td className={`text-right ${m < 10 ? "text-accent" : "text-primary"}`}>{m.toFixed(1)}%</td>
                    <td className="text-right">{i.gst}%</td>
                    <td className="text-right">{i.stock}</td>
                    <td className="px-5 text-right whitespace-nowrap">
                      <button className="p-1.5 hover:text-primary" aria-label="Edit" onClick={() => setEdit(i)}><Pencil className="size-4" /></button>
                      <button className="p-1.5 hover:text-destructive" aria-label="Delete" onClick={() => confirm(`Delete ${i.name}?`) && deleteItem(i.id)}><Trash2 className="size-4" /></button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center font-sans text-muted-foreground">No items. Add one or import a CSV file.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">Tip: from Excel, use “Save As → CSV” and import. Columns detected automatically: Name, SKU, Category, Unit, Cost, Price, GST, Stock.</p>
      </div>
      {edit && <ItemDialog item={edit} onClose={() => setEdit(null)} onSave={(i) => { saveItem(i); setEdit(null); toast.success("Item saved"); }} />}
    </>
  );
}

function ItemDialog({ item, onClose, onSave }: { item: Item; onClose: () => void; onSave: (i: Item) => void }) {
  const [f, setF] = useState(item);
  const set = <K extends keyof Item>(k: K, v: Item[K]) => setF({ ...f, [k]: v });
  const n = (v: string) => parseFloat(v) || 0;
  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 grid place-items-center p-4" onClick={onClose}>
      <form
        className="card-surface w-full max-w-lg p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); if (!f.name.trim()) { toast.error("Name is required"); return; } onSave(f); }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{item.name ? "Edit item" : "New item"}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X className="size-4" /></button>
        </div>
        <label className="block"><span className="label-cap">Item name</span><input autoFocus className="field mt-1" value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
        <div className="grid grid-cols-3 gap-3">
          <label><span className="label-cap">SKU</span><input className="field mt-1" value={f.sku} onChange={(e) => set("sku", e.target.value)} /></label>
          <label><span className="label-cap">Category</span><input className="field mt-1" list="cats" value={f.category} onChange={(e) => set("category", e.target.value)} /></label>
          <label><span className="label-cap">Unit</span><input className="field mt-1" value={f.unit} onChange={(e) => set("unit", e.target.value)} /></label>
        </div>
        <datalist id="cats">{["Wires & Cables", "Switchgear", "Switches", "Lighting", "Fans", "Conduits", "Panels", "Services"].map((c) => <option key={c} value={c} />)}</datalist>
        <div className="grid grid-cols-4 gap-3">
          <label><span className="label-cap">Cost ₹</span><input type="number" step="any" className="field mt-1 font-mono" value={f.cost} onChange={(e) => set("cost", n(e.target.value))} /></label>
          <label><span className="label-cap">Price ₹</span><input type="number" step="any" className="field mt-1 font-mono" value={f.price} onChange={(e) => set("price", n(e.target.value))} /></label>
          <label><span className="label-cap">GST %</span>
            <select className="field mt-1" value={f.gst} onChange={(e) => set("gst", n(e.target.value))}>{[0, 5, 12, 18, 28].map((g) => <option key={g}>{g}</option>)}</select>
          </label>
          <label><span className="label-cap">Stock</span><input type="number" className="field mt-1 font-mono" value={f.stock} onChange={(e) => set("stock", n(e.target.value))} /></label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn-primary">Save item</button>
        </div>
      </form>
    </div>
  );
}
