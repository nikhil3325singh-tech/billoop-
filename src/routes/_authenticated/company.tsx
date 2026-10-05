import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { useStore, type Company, type TemplateStyle } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/company")({
  head: () => ({
    meta: [
      { title: "Company Template — Billoop" },
      { name: "description", content: "Upload your logo, signature, stamp and letterhead, and set company details for quotes and invoices." },
      { property: "og:title", content: "Company Template — Billoop" },
      { property: "og:description", content: "Upload logo, signature, stamp and letterhead." },
    ],
  }),
  component: CompanyPage,
});

function resize(file: File, max: number): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = rej;
    r.onload = () => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL("image/png"));
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(file);
  });
}

const styles: { id: TemplateStyle; name: string; desc: string }[] = [
  { id: "classic", name: "Classic", desc: "Logo left, coloured rule" },
  { id: "modern", name: "Modern", desc: "Full colour header band" },
  { id: "minimal", name: "Minimal", desc: "Light, low ink" },
];

function CompanyPage() {
  const { company, setCompany } = useStore();
  const [f, setF] = useState<Company>(company);
  const set = <K extends keyof Company>(k: K, v: Company[K]) => setF((p) => ({ ...p, [k]: v }));

  const ImageSlot = ({ k, label, hint, max }: { k: "logo" | "signature" | "stamp" | "letterhead"; label: string; hint: string; max: number }) => (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{label}</div>
        {f[k] && <button aria-label="Remove" onClick={() => set(k, "")}><X className="size-4 text-muted-foreground hover:text-destructive" /></button>}
      </div>
      <label className="block cursor-pointer rounded-lg border border-dashed border-foreground/20 bg-muted/40 h-28 grid place-items-center overflow-hidden hover:border-primary">
        {f[k] ? <img src={f[k]} alt={label} className="max-h-24 max-w-full object-contain" /> : <span className="text-xs text-muted-foreground">Click to upload</span>}
        <input type="file" accept="image/*" hidden onChange={async (e) => { const file = e.target.files?.[0]; if (file) set(k, await resize(file, max)); e.target.value = ""; }} />
      </label>
      <p className="text-[11px] text-muted-foreground mt-2">{hint}</p>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Company Template"
        subtitle="Used on every quotation and invoice you download"
        actions={<button className="btn-primary" onClick={() => { setCompany(f); toast.success("Template saved"); }}>Save template</button>}
      />
      <div className="p-8 grid xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 card-surface p-6 space-y-4">
          <div className="text-sm font-semibold">Company details</div>
          <div className="grid md:grid-cols-2 gap-3">
            <label><span className="label-cap">Company name</span><input className="field mt-1" value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
            <label><span className="label-cap">Tagline</span><input className="field mt-1" value={f.tagline} onChange={(e) => set("tagline", e.target.value)} /></label>
            <label className="md:col-span-2"><span className="label-cap">Address</span><input className="field mt-1" value={f.address} onChange={(e) => set("address", e.target.value)} /></label>
            <label><span className="label-cap">Phone</span><input className="field mt-1" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></label>
            <label><span className="label-cap">Email</span><input className="field mt-1" value={f.email} onChange={(e) => set("email", e.target.value)} /></label>
            <label><span className="label-cap">GSTIN</span><input className="field mt-1 font-mono" value={f.gstin} onChange={(e) => set("gstin", e.target.value)} /></label>
            <label><span className="label-cap">Signatory name</span><input className="field mt-1" value={f.signatoryName} onChange={(e) => set("signatoryName", e.target.value)} /></label>
            <label className="md:col-span-2"><span className="label-cap">Bank details (shown on invoices)</span><textarea rows={3} className="field mt-1" value={f.bank} onChange={(e) => set("bank", e.target.value)} /></label>
            <label><span className="label-cap">Default quotation terms</span><textarea rows={4} className="field mt-1" value={f.quoteTerms} onChange={(e) => set("quoteTerms", e.target.value)} /></label>
            <label><span className="label-cap">Default invoice terms</span><textarea rows={4} className="field mt-1" value={f.invoiceTerms} onChange={(e) => set("invoiceTerms", e.target.value)} /></label>
          </div>

          <div className="text-sm font-semibold pt-2">Layout style</div>
          <div className="grid grid-cols-3 gap-3">
            {styles.map((s) => (
              <button key={s.id} onClick={() => set("style", s.id)} className={`text-left rounded-lg p-3 ring-1 ${f.style === s.id ? "ring-2 ring-primary bg-primary/5" : "ring-foreground/10 hover:bg-muted/50"}`}>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-[11px] text-muted-foreground">{s.desc}</div>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="color" value={f.color} onChange={(e) => set("color", e.target.value)} className="h-9 w-12 rounded cursor-pointer" />
            Brand colour for headers & totals
          </label>
        </div>

        <div className="space-y-4">
          <ImageSlot k="logo" label="Company logo" hint="PNG with transparent background works best." max={500} />
          <ImageSlot k="signature" label="Signature" hint="Sign on white paper, photograph, and upload." max={500} />
          <ImageSlot k="stamp" label="Company stamp / seal" hint="Optional. Shown next to the signature." max={400} />
          <ImageSlot k="letterhead" label="Letterhead (optional)" hint="Upload your full letterhead header image — it replaces the generated header." max={1400} />
        </div>
      </div>
    </>
  );
}
