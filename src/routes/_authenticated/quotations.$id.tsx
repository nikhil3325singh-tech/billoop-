import { createFileRoute } from "@tanstack/react-router";
import { DocEditor } from "@/components/DocEditor";

export const Route = createFileRoute("/_authenticated/quotations/$id")({
  head: () => ({
    meta: [
      { title: "Quotation Builder — Billoop" },
      { name: "description", content: "Build a quotation from inventory and download it as PDF or Word." },
      { property: "og:title", content: "Quotation Builder — Billoop" },
      { property: "og:description", content: "Build a quotation and download as PDF or Word." },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <DocEditor key={id} type="quote" id={id} />;
}
