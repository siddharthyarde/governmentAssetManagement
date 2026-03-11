import { loginAction } from "../actions";

interface Props {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function BuyerLoginPage({ searchParams }: Props) {
  const { error, next = "/dashboard" } = await searchParams;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">
            Institutional Sign In
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access the government asset redistribution marketplace for your
            organisation.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{decodeURIComponent(error)}</p>
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Official Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nodal.officer@institution.gov.in"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2
                         focus:ring-secondary/30 focus:border-secondary"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <a
                href="/auth/reset-password"
                className="text-xs text-secondary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2
                         focus:ring-secondary/30 focus:border-secondary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-secondary py-2.5 text-sm font-semibold text-white
                       hover:bg-secondary/90 active:scale-[0.98] transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-border space-y-3">
          <div className="flex gap-2 text-xs text-muted-foreground bg-green-50 border border-green-200 rounded-lg p-3">
            <span>✓</span>
            <span>
              Eligible organisations: Government bodies, PSUs, NGOs with
              FCRA/80G, educational institutions, district hospitals.
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            New institution?{" "}
            <a href="/register" className="text-secondary font-semibold hover:underline">
              Register now →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
