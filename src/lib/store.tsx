import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSession } from "@/lib/auth";

export type Item = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  cost: number;
  price: number;
  gst: number;
  stock: number;
};

export type Line = {
  id: string;
  itemId?: string;
  name: string;
  unit: string;
  qty: number;
  rate: number;
  cost: number;
  gst: number;
  discount: number;
};

export type DocType = "quote" | "invoice";

export type Doc = {
  id: string;
  type: DocType;
  number: string;
  date: string;
  dueDate: string;
  client: { name: string; address: string; gstin: string; phone: string };
  subject: string;
  lines: Line[];
  notes: string;
  terms: string;
  status: string;
  interState: boolean;
};

export type TemplateStyle = "classic" | "modern" | "minimal";

export type Company = {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  bank: string;
  quoteTerms: string;
  invoiceTerms: string;
  signatoryName: string;
  logo: string;
  signature: string;
  stamp: string;
  letterhead: string;
  style: TemplateStyle;
  color: string;
};

type State = { items: Item[]; docs: Doc[]; company: Company };

const KEY = "billoop-v1";

export const uid = () => Math.random().toString(36).slice(2, 10);

const defaultCompany: Company = {
  name: "Your Electrical Company",
  tagline: "Electrical Contractors & Suppliers",
  address: "Shop No. 1, Main Road, Your City",
  phone: "+91 98765 43210",
  email: "info@yourcompany.in",
  gstin: "",
  bank: "Bank: \nA/c No: \nIFSC: ",
  quoteTerms: "Prices valid for 15 days.\nPayment: 50% advance, balance on completion.\nGST as applicable.",
  invoiceTerms: "Payment due within 15 days.\nGoods once sold will not be taken back.\nSubject to local jurisdiction.",
  signatoryName: "Authorised Signatory",
  logo: "",
  signature: "",
  stamp: "",
  letterhead: "",
  style: "classic",
  color: "#1f5a4c",
};

const seedItems: Item[] = [
  { id: uid(), name: "FR Copper Wire 2.5 sqmm (90m coil)", sku: "WIR-25", category: "Wires & Cables", unit: "coil", cost: 1650, price: 1950, gst: 18, stock: 40 },
  { id: uid(), name: "MCB 32A Single Pole", sku: "MCB-32SP", category: "Switchgear", unit: "pcs", cost: 180, price: 245, gst: 18, stock: 120 },
  { id: uid(), name: "Modular Switch Board 6M", sku: "MSB-6M", category: "Switches", unit: "pcs", cost: 920, price: 1180, gst: 18, stock: 35 },
  { id: uid(), name: "LED Panel Light 12W", sku: "LED-12", category: "Lighting", unit: "pcs", cost: 260, price: 380, gst: 12, stock: 200 },
  { id: uid(), name: "Installation & Labour (per point)", sku: "LAB-PT", category: "Services", unit: "point", cost: 200, price: 380, gst: 18, stock: 0 },
];

const empty: State = { items: [], docs: [], company: defaultCompany };

type Ctx = State & {
  ready: boolean;
  saveItem: (i: Item) => void;
  addItems: (i: Item[]) => void;
  deleteItem: (id: string) => void;
  saveDoc: (d: Doc) => void;
  deleteDoc: (id: string) => void;
  setCompany: (c: Company) => void;
  nextNumber: (t: DocType) => string;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const userId = session?.user?.id || "default";
  const userStorageKey = `${KEY}_${userId}`;

  const [state, setState] = useState<State>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      setReady(true);
      return;
    }
    try {
      const raw = localStorage.getItem(userStorageKey) || localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as State;
        setState({ ...empty, ...p, company: { ...defaultCompany, ...p.company } });
      } else {
        setState({ ...empty, items: seedItems });
      }
    } catch {
      setState({ ...empty, items: seedItems });
    }
    setReady(true);
  }, [userStorageKey]);

  useEffect(() => {
    if (!ready || typeof window === "undefined" || typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(state));
    } catch {
      console.warn("Storage is full or inaccessible.");
    }
  }, [state, ready, userStorageKey]);

  const upsert = <T extends { id: string }>(arr: T[], v: T) =>
    arr.some((x) => x.id === v.id) ? arr.map((x) => (x.id === v.id ? v : x)) : [v, ...arr];

  const value: Ctx = {
    ...state,
    ready,
    saveItem: (i) => setState((s) => ({ ...s, items: upsert(s.items, i) })),
    addItems: (i) => setState((s) => ({ ...s, items: [...i, ...s.items] })),
    deleteItem: (id) => setState((s) => ({ ...s, items: s.items.filter((x) => x.id !== id) })),
    saveDoc: (d) => setState((s) => ({ ...s, docs: upsert(s.docs, d) })),
    deleteDoc: (id) => setState((s) => ({ ...s, docs: s.docs.filter((x) => x.id !== id) })),
    setCompany: (c) => setState((s) => ({ ...s, company: c })),
    nextNumber: (t) => {
      const yr = new Date().getFullYear();
      const prefix = t === "quote" ? "QT" : "INV";
      const n = state.docs.filter((d) => d.type === t).length + 1;
      return `${prefix}-${yr}-${String(n).padStart(3, "0")}`;
    },
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
