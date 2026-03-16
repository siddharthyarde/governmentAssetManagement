import { loginAction } from "../actions";
import { AshokaChakra } from "@gams/ui";

interface Props {
  searchParams: Promise<{ error?: string; next?: string }>;
}

const ROLE_INFO = [
  { role: "Admin",       color: "bg-purple-50 border-purple-200 text-purple-700",     desc: "Full system management"                },
  { role: "Inspector",   color: "bg-blue-50 border-blue-200 text-blue-700",           desc: "Rate assets & report defects"          },
  { role: "Volunteer",   color: "bg-green-50 border-green-200 text-green-700",        desc: "QR scanning at events"                 },
  { role: "Viewer",      color: "bg-gray-50 border-gray-200 text-gray-600",           desc: "Read-only dashboard access"            },
];

export default async function ManageLoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;

  // Only pass next if it's a real manage deep-link (not "/" which would cause redirect back to public)
  const safeNext = next && next.startsWith("/manage") && next !== "/manage/login" ? next : "";

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Role info cards */}
      <div className="grid grid-cols-2 gap-2">
        {ROLE_INFO.map(({ role, color, desc }) => (
          <div key={role} className={`rounded-xl border px-3 py-2.5 ${color}`}>
            <p className="text-xs font-black">{role}</p>
            <p className="text-[10px] mt-0.5 opacity-80">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-3">
            <AshokaChakra size={36} />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Management Portal Sign In
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All roles · Authorised government personnel only
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{decodeURIComponent(error)}</p>
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          {/* Only include next if it's a real deep link */}
          {safeNext && <input type="hidden" name="next" value={safeNext} />}

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
            Sign In → Go to My Dashboard
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
      <p className="text-center text-xs text-muted-foreground">
        🔒 This portal is monitored and all activity is logged per IT Act 2000.
        Unauthorised access is a criminal offence.
      </p>
    </div>
  );
}
