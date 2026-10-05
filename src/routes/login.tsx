import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Billoop by Foci Tech" },
      { name: "description", content: "Log in to Billoop to manage your electrical quotations and invoices." },
      { property: "og:title", content: "Log in — Billoop" },
      { property: "og:description", content: "Log in to manage quotations and invoices." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
