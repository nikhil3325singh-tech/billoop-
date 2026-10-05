import { createFileRoute } from "@tanstack/react-router";
import { DocEditor } from "@/components/DocEditor";

export const Route = createFileRoute("/_authenticated/invoices/$id")({
  head: () => ({
    meta: [
      { title: "Invoice Builder — Billoop" },
      { name: "description", content: "Create a GST tax invoice and download it as PDF or Word." },
      { property: "og:title", content: "Invoice Builder — Billoop" },
      { property: "og:description", content: "Create a GST tax invoice and download as PDF or Word." },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <DocEditor key={id} type="invoice" id={id} />;
}
