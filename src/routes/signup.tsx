import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Billoop by Foci Tech" },
      { name: "description", content: "Create a free Billoop account for quotations and GST billing." },
      { property: "og:title", content: "Sign up — Billoop" },
      { property: "og:description", content: "Create a free account for quotations and GST billing." },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
