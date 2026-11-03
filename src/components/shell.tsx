import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PlanSync, useSaveStatus } from "@/components/plan-sync";
import { usePlanStore } from "@/lib/plan/store";

const LINKS = [
  { to: "/", label: "Plan" },
  { to: "/cashflow", label: "Cashflow" },
  { to: "/cards", label: "Cards" },
  { to: "/trips", label: "Trips" },
  { to: "/projection", label: "Projection" },
  { to: "/inputs", label: "Inputs" },
  { to: "/uat", label: "Test" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const saveState = useSaveStatus((s) => s.state);
  const saveLabel =
    saveState === "account"
      ? "Saved in the app"
      : saveState === "error"
        ? "Not saved to the app"
        : saveState === "browser"
          ? "Only in this browser"
          : "Saving to the app";
  useEffect(() => {
    void usePlanStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen">
      <PlanSync />
      <header className="border-b border-line bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="font-display text-2xl tracking-tight text-ink">
              Hearth
            </Link>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted">{saveLabel}</p>
              {isPending ? <div className="h-8 w-8 animate-pulse rounded-full bg-line" /> : user ? <UserButton /> : null}
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-1" aria-label="Sections">
            {LINKS.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                    active ? "bg-ink text-paper" : "text-muted hover:bg-paper hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
