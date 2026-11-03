import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-muted">The plan is saved on this account, so a signed-in Grok bot sees the same figures.</p>
      <div className="mt-6 space-y-2">
        {authEnabled ? (
          GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
              className="min-h-11 w-full cursor-pointer rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink"
            >
              Continue with {provider.label}
            </button>
          ))
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
      </div>
    </main>
  );
}
