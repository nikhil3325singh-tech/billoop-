import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { StoreProvider } from "@/lib/store";
import { useSession } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: Gate,
});

function Gate() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login", replace: true });
  }, [loading, session, navigate]);
  if (loading || !session) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  return (
    <StoreProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </StoreProvider>
  );
}
