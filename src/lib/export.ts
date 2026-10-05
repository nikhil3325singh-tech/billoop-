// @ts-nocheck -- docx option typings conflict with exactOptionalPropertyTypes
import type { Company, Doc } from "./store";
import { amountInWords, docLabel, fmtDate, inr, lineBase, totals } from "./calc";

const rs = (n: number) => inr(n, "Rs. ");

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function imgFormat(dataUrl: string) {
  return dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
}

function imgSize(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((res) => {
    const i = new Image();
    i.onload = () => res({ w: i.naturalWidth, h: i.naturalHeight });
    i.onerror = () => res({ w: 1, h: 1 });
    i.src = dataUrl;
  });
}

const fileName = (d: Doc, ext: string) =>
  `${d.number}-${(d.client.name || "client").replace(/[^a-z0-9]+/gi, "_")}.${ext}`;

export async function downloadPdf(d: Doc, c: Company) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 14;
  const color = hexToRgb(c.color || "#1f5a4c");
  const t = totals(d);
  let y = M;

  // Header
  if (c.letterhead) {
    const s = await imgSize(c.letterhead);
    const h = Math.min(((W - 0) * s.h) / s.w, 60);
    pdf.addImage(c.letterhead, imgFormat(c.letterhead), 0, 0, W, h);
    y = h + 6;
  } else {
    if (c.style === "modern") {
      pdf.setFillColor(...color);
      pdf.rect(0, 0, W, 38, "F");
      pdf.setTextColor(255, 255, 255);
    } else pdf.setTextColor(30, 30, 30);
    let x = M;
    if (c.logo) {
      const s = await imgSize(c.logo);
      const h = 20, w = Math.min((h * s.w) / s.h, 45);
      pdf.addImage(c.logo, imgFormat(c.logo), M, 9, w, h);
      x = M + w + 5;
    }
    pdf.setFont("helvetica", "bold").setFontSize(17);
    pdf.text(c.name, x, 15);
    pdf.setFont("helvetica", "normal").setFontSize(8.5);
    const sub = [c.tagline, c.address, [c.phone, c.email].filter(Boolean).join("  |  "), c.gstin ? `GSTIN: ${c.gstin}` : ""].filter(Boolean);
    sub.forEach((l, i) => pdf.text(pdf.splitTextToSize(l, 120)[0], x, 20 + i * 4));
    y = c.style === "modern" ? 46 : 38;
    if (c.style === "classic") {
      pdf.setDrawColor(...color).setLineWidth(0.8).line(M, y - 3, W - M, y - 3);
    }
  }

  pdf.setTextColor(...color).setFont("helvetica", "bold").setFontSize(14);
  pdf.text(docLabel(d.type).toUpperCase(), W - M, y + 2, { align: "right" });
  pdf.setTextColor(40, 40, 40).setFontSize(9).setFont("helvetica", "normal");
  const meta = [
    `No: ${d.number}`,
    `Date: ${fmtDate(d.date)}`,
    d.dueDate ? `${d.type === "quote" ? "Valid till" : "Due date"}: ${fmtDate(d.dueDate)}` : "",
  ].filter(Boolean);
  meta.forEach((m, i) => pdf.text(m, W - M, y + 8 + i * 4.5, { align: "right" }));

  pdf.setFontSize(8).setTextColor(120, 120, 120).text(d.type === "quote" ? "QUOTATION FOR" : "BILL TO", M, y + 2);
  pdf.setFontSize(10.5).setTextColor(30, 30, 30).setFont("helvetica", "bold").text(d.client.name || "-", M, y + 8);
  pdf.setFont("helvetica", "normal").setFontSize(8.5);
  const cl = [...pdf.splitTextToSize(d.client.address || "", 100), d.client.phone, d.client.gstin ? `GSTIN: ${d.client.gstin}` : ""].filter(Boolean);
  cl.forEach((l: string, i: number) => pdf.text(l, M, y + 13 + i * 4));
  y = Math.max(y + 13 + cl.length * 4, y + 22) + 2;
  if (d.subject) {
    pdf.setFont("helvetica", "bold").text(`Subject: ${d.subject}`, M, y + 2);
    pdf.setFont("helvetica", "normal");
    y += 6;
  }

  autoTable(pdf, {
    startY: y,
    margin: { left: M, right: M },
    head: [["#", "Description", "Qty", "Unit", "Rate", "Disc %", "GST %", "Amount"]],
    body: d.lines.map((l, i) => [
      i + 1, l.name, l.qty, l.unit, rs(l.rate), l.discount ? l.discount : "-", l.gst, rs(lineBase(l)),
    ]),
    styles: { fontSize: 8.5, cellPadding: 2.2, lineColor: [225, 220, 210], lineWidth: 0.1 },
    headStyles: { fillColor: c.style === "minimal" ? [245, 240, 230] : color, textColor: c.style === "minimal" ? [40, 40, 40] : 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 248, 243] },
    columnStyles: { 0: { cellWidth: 8 }, 2: { halign: "right" }, 4: { halign: "right" }, 5: { halign: "right" }, 6: { halign: "right" }, 7: { halign: "right" } },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (pdf as any).lastAutoTable.finalY + 6;
  if (y > 230) { pdf.addPage(); y = M; }

  const rows: [string, string][] = [["Subtotal", rs(t.subtotal)]];
  if (d.interState) rows.push(["IGST", rs(t.tax)]);
  else rows.push(["CGST", rs(t.cgst)], ["SGST", rs(t.sgst)]);
  if (Math.abs(t.roundOff) > 0.001) rows.push(["Round off", rs(t.roundOff)]);
  pdf.setFontSize(9);
  rows.forEach(([k, v], i) => {
    pdf.setTextColor(90, 90, 90).text(k, W - M - 60, y + i * 5);
    pdf.setTextColor(30, 30, 30).text(v, W - M, y + i * 5, { align: "right" });
  });
  let ty = y + rows.length * 5 + 1;
  pdf.setFillColor(...color).rect(W - M - 64, ty - 4, 64, 8, "F");
  pdf.setTextColor(255, 255, 255).setFont("helvetica", "bold").setFontSize(10);
  pdf.text("Grand Total", W - M - 61, ty + 1.3);
  pdf.text(rs(t.grand), W - M - 2, ty + 1.3, { align: "right" });

  pdf.setTextColor(60, 60, 60).setFont("helvetica", "italic").setFontSize(8.5);
  pdf.text(pdf.splitTextToSize(amountInWords(t.grand), 105), M, y);
  pdf.setFont("helvetica", "normal");
  y = Math.max(ty + 10, y + 12);

  const block = (title: string, body: string) => {
    if (!body.trim()) return;
    if (y > 250) { pdf.addPage(); y = M; }
    pdf.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(40, 40, 40).text(title, M, y);
    pdf.setFont("helvetica", "normal").setTextColor(80, 80, 80);
    const lines = pdf.splitTextToSize(body, 110);
    pdf.text(lines, M, y + 4.5);
    y += 6 + lines.length * 3.8;
  };
  const startNotes = y;
  block("Notes", d.notes);
  block("Terms & Conditions", d.terms);
  if (d.type === "invoice") block("Bank Details", c.bank);

  // Signature block
  let sy = Math.max(startNotes, 230);
  if (y > 270 && sy < y) { pdf.addPage(); sy = 30; }
  pdf.setFontSize(8.5).setTextColor(40, 40, 40).text(`For ${c.name}`, W - M, sy, { align: "right" });
  if (c.stamp) pdf.addImage(c.stamp, imgFormat(c.stamp), W - M - 72, sy + 2, 24, 24);
  if (c.signature) {
    const s = await imgSize(c.signature);
    const h = 16, w = Math.min((h * s.w) / s.h, 45);
    pdf.addImage(c.signature, imgFormat(c.signature), W - M - w, sy + 4, w, h);
  }
  pdf.setDrawColor(150, 150, 150).setLineWidth(0.2).line(W - M - 45, sy + 22, W - M, sy + 22);
  pdf.text(c.signatoryName || "Authorised Signatory", W - M, sy + 26, { align: "right" });

  pdf.save(fileName(d, "pdf"));
}

function dataUrlToBytes(dataUrl: string) {
  const b = atob(dataUrl.split(",")[1] || "");
  const u = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
  return u;
}

export async function downloadWord(d: Doc, c: Company) {
  const dx = await import("docx");
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun, BorderStyle, ShadingType } = dx;
  const t = totals(d);
  const color = (c.color || "#1f5a4c").replace("#", "");

  const img = async (src: string, maxW: number, maxH: number) => {
    const s = await imgSize(src);
    const r = Math.min(maxW / s.w, maxH / s.h);
    return new ImageRun({
      type: src.startsWith("data:image/png") ? "png" : "jpg",
      data: dataUrlToBytes(src),
      transformation: { width: Math.round(s.w * r), height: Math.round(s.h * r) },
    });
  };
  const p = (text: string, o: { bold?: boolean; size?: number; color?: string; align?: (typeof AlignmentType)[keyof typeof AlignmentType]; italics?: boolean } = {}) =>
    new Paragraph({ alignment: o.align, children: [new TextRun({ text, bold: o.bold, size: o.size ?? 18, color: o.color, italics: o.italics })] });
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };

  const children: (InstanceType<typeof Paragraph> | InstanceType<typeof Table>)[] = [];

  if (c.letterhead) {
    children.push(new Paragraph({ children: [await img(c.letterhead, 600, 160)] }));
  } else {
    const head: InstanceType<typeof Paragraph>[] = [];
    if (c.logo) head.push(new Paragraph({ children: [await img(c.logo, 140, 60)] }));
    head.push(p(c.name, { bold: true, size: 32, color }));
    [c.tagline, c.address, [c.phone, c.email].filter(Boolean).join("  |  "), c.gstin ? `GSTIN: ${c.gstin}` : ""]
      .filter(Boolean).forEach((l) => head.push(p(l, { size: 17 })));
    children.push(...head);
  }
  children.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 12, color } }, children: [] }));
  children.push(p(""));

  const metaCol = [
    p(docLabel(d.type).toUpperCase(), { bold: true, size: 26, color, align: AlignmentType.RIGHT }),
    p(`No: ${d.number}`, { align: AlignmentType.RIGHT }),
    p(`Date: ${fmtDate(d.date)}`, { align: AlignmentType.RIGHT }),
    ...(d.dueDate ? [p(`${d.type === "quote" ? "Valid till" : "Due date"}: ${fmtDate(d.dueDate)}`, { align: AlignmentType.RIGHT })] : []),
  ];
  const clientCol = [
    p(d.type === "quote" ? "QUOTATION FOR" : "BILL TO", { size: 15, color: "777777" }),
    p(d.client.name || "-", { bold: true, size: 21 }),
    ...[d.client.address, d.client.phone, d.client.gstin ? `GSTIN: ${d.client.gstin}` : ""].filter(Boolean).map((l) => p(l)),
  ];
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE }, borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ children: clientCol }), new TableCell({ children: metaCol })] })],
  }));
  if (d.subject) children.push(p(""), p(`Subject: ${d.subject}`, { bold: true }));
  children.push(p(""));

  const hdr = ["#", "Description", "Qty", "Unit", "Rate", "Disc %", "GST %", "Amount"];
  const cell = (txt: string, head = false, right = false) => new TableCell({
    shading: head ? { type: ShadingType.CLEAR, fill: color, color: "auto" } : undefined,
    children: [new Paragraph({ alignment: right ? AlignmentType.RIGHT : AlignmentType.LEFT, children: [new TextRun({ text: txt, bold: head, color: head ? "FFFFFF" : undefined, size: 17 })] })],
  });
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ tableHeader: true, children: hdr.map((h, i) => cell(h, true, i >= 2 && i !== 3)) }),
      ...d.lines.map((l, i) => new TableRow({ children: [
        cell(String(i + 1)), cell(l.name), cell(String(l.qty), false, true), cell(l.unit), cell(rs(l.rate), false, true),
        cell(l.discount ? String(l.discount) : "-", false, true), cell(String(l.gst), false, true), cell(rs(lineBase(l)), false, true),
      ] })),
    ],
  }));
  children.push(p(""));

  const rows: [string, string][] = [["Subtotal", rs(t.subtotal)]];
  if (d.interState) rows.push(["IGST", rs(t.tax)]);
  else rows.push(["CGST", rs(t.cgst)], ["SGST", rs(t.sgst)]);
  if (Math.abs(t.roundOff) > 0.001) rows.push(["Round off", rs(t.roundOff)]);
  rows.push(["Grand Total", rs(t.grand)]);
  rows.forEach(([k, v], i) => children.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text: `${k}:  `, size: 18, color: "555555", bold: i === rows.length - 1 }), new TextRun({ text: v, size: i === rows.length - 1 ? 22 : 18, bold: i === rows.length - 1, color: i === rows.length - 1 ? color : undefined })],
  })));
  children.push(p(amountInWords(t.grand), { italics: true }), p(""));

  const block = (title: string, body: string) => {
    if (!body.trim()) return;
    children.push(p(title, { bold: true }));
    body.split("\n").forEach((l) => children.push(p(l, { color: "555555" })));
    children.push(p(""));
  };
  block("Notes", d.notes);
  block("Terms & Conditions", d.terms);
  if (d.type === "invoice") block("Bank Details", c.bank);

  children.push(p(`For ${c.name}`, { align: AlignmentType.RIGHT }));
  const sigImgs = [];
  if (c.stamp) sigImgs.push(await img(c.stamp, 80, 80));
  if (c.signature) sigImgs.push(await img(c.signature, 150, 55));
  if (sigImgs.length) children.push(new Paragraph({ alignment: AlignmentType.RIGHT, children: sigImgs }));
  else children.push(p(""), p(""));
  children.push(p(c.signatoryName || "Authorised Signatory", { align: AlignmentType.RIGHT, bold: true }));

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri" } } } },
    sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 800, right: 800 } } }, children }],
  });
  const blob = await Packer.toBlob(doc);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName(d, "docx");
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
