import { createFileRoute } from "@tanstack/react-router";
import { DocList } from "@/components/DocList";

export const Route = createFileRoute("/_authenticated/quotations/")({
  head: () => ({
    meta: [
      { title: "Quotations — Billoop" },
      { name: "description", content: "All quotations for your electrical projects." },
      { property: "og:title", content: "Quotations — Billoop" },
      { property: "og:description", content: "All quotations for your electrical projects." },
    ],
  }),
  component: () => <DocList type="quote" />,
});
