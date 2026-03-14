import { loginAction } from "../actions";

interface Props {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function ManageLoginPage({ searchParams }: Props) {
  const { error, next = "/" } = await searchParams;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-foreground">
            Management Portal Sign In
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Authorised government personnel only
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
              placeholder="you@nic.in"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2
                         focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Password
            </label>
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
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <span className="font-medium text-foreground">
              Contact your department administrator.
            </span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            For technical support:{" "}
            <a
              href="mailto:helpdesk@nic.in"
              className="text-primary hover:underline"
            >
              helpdesk@nic.in
            </a>
          </p>
        </div>
      </div>

      {/* Security notice */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        🔒 This portal is monitored and all activity is logged per IT Act 2000.
        Unauthorised access is a criminal offence.
      </p>
    </div>
  );
}
