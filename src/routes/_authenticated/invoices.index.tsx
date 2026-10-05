import { createFileRoute } from "@tanstack/react-router";
import { DocList } from "@/components/DocList";

export const Route = createFileRoute("/_authenticated/invoices/")({
  head: () => ({
    meta: [
      { title: "Invoices — Billoop" },
      { name: "description", content: "GST tax invoices and billing for your electrical business." },
      { property: "og:title", content: "Invoices — Billoop" },
      { property: "og:description", content: "GST tax invoices and billing." },
    ],
  }),
  component: () => <DocList type="invoice" />,
});
