import type { Doc, Line } from "./store";

export const lineBase = (l: Line) => l.qty * l.rate * (1 - (l.discount || 0) / 100);
export const lineTax = (l: Line) => (lineBase(l) * l.gst) / 100;

export function totals(d: Doc) {
  const subtotal = d.lines.reduce((s, l) => s + lineBase(l), 0);
  const tax = d.lines.reduce((s, l) => s + lineTax(l), 0);
  const cost = d.lines.reduce((s, l) => s + l.qty * (l.cost || 0), 0);
  const raw = subtotal + tax;
  const grand = Math.round(raw);
  return { subtotal, tax, cgst: tax / 2, sgst: tax / 2, roundOff: grand - raw, grand, cost, profit: subtotal - cost };
}

export const inr = (n: number, sym = "₹") =>
  sym + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtDate = (s: string) =>
  s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
function two(n: number) {
  return n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
}
function three(n: number) {
  const h = Math.floor(n / 100), r = n % 100;
  return (h ? ones[h] + " Hundred" + (r ? " " : "") : "") + (r ? two(r) : "");
}
export function amountInWords(num: number) {
  let n = Math.round(num);
  if (n === 0) return "Rupees Zero Only";
  const parts: string[] = [];
  const cr = Math.floor(n / 1e7); n %= 1e7;
  const lk = Math.floor(n / 1e5); n %= 1e5;
  const th = Math.floor(n / 1e3); n %= 1e3;
  if (cr) parts.push(three(cr) + " Crore");
  if (lk) parts.push(two(lk) + " Lakh");
  if (th) parts.push(two(th) + " Thousand");
  if (n) parts.push(three(n));
  return "Rupees " + parts.join(" ") + " Only";
}

export const docLabel = (t: Doc["type"]) => (t === "quote" ? "Quotation" : "Tax Invoice");
