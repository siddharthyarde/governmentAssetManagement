import { loginAction } from "../actions";

interface Props {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function CompanyLoginPage({ searchParams }: Props) {
  const { error, next = "/company/dashboard" } = await searchParams;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your supplier account to manage products &amp; deliveries.
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
              Business Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2
                         focus:ring-primary/30 focus:border-primary"
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
                href="/company/auth/reset-password"
                className="text-xs text-primary hover:underline"
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
                         focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white
                       hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            New supplier?{" "}
            <a href="/company/register" className="text-primary font-semibold hover:underline">
              Register your company →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
