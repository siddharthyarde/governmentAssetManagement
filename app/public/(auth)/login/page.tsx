import { emailLoginAction, sendOtpAction, verifyOtpAction } from "../actions";

interface Props {
  searchParams: Promise<{
    error?: string;
    next?: string;
    step?: string;
    phone?: string;
    tab?: string;
  }>;
}

export default async function PublicLoginPage({ searchParams }: Props) {
  const {
    error,
    next = "/public/account",
    step,
    phone = "",
    tab = "email",
  } = await searchParams;

  // OTP verify step (after SMS sent)
  if (step === "otp" && phone) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Enter OTP</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A 6-digit OTP was sent to{" "}
              <span className="font-semibold text-foreground">+91 {decodeURIComponent(phone)}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{decodeURIComponent(error)}</p>
            </div>
          )}

          <form action={verifyOtpAction} className="space-y-4">
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="next" value={next} />
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-foreground mb-1.5">
                6-digit OTP
              </label>
              <input
                id="token" name="token" type="text" inputMode="numeric"
                pattern="[0-9]{6}" maxLength={6} required autoFocus
                placeholder="• • • • • •"
                className="w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-center
                           text-xl tracking-[0.5em] font-bold placeholder:text-muted-foreground
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <button type="submit"
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 active:scale-[0.98] transition-all">
              Verify &amp; Sign In
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href={`/public/login?tab=otp&next=${encodeURIComponent(next)}`} className="text-sm text-muted-foreground hover:text-foreground">
              ← Use a different number
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isOtpTab = tab === "otp";

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">

        {/* Tab switcher */}
        <div className="flex border-b border-border">
          <a
            href={`/public/login?tab=email&next=${encodeURIComponent(next)}`}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
              !isOtpTab
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:bg-surface"
            }`}
          >
            📧 Email &amp; Password
          </a>
          <a
            href={`/public/login?tab=otp&next=${encodeURIComponent(next)}`}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
              isOtpTab
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:bg-surface"
            }`}
          >
            📱 Mobile OTP
          </a>
        </div>

        <div className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">{isOtpTab ? "📱" : "📧"}</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {isOtpTab ? "Sign In with Mobile" : "Sign In"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isOtpTab
                ? "We\u2019ll send a one-time password to your registered number."
                : "Access the GAMS Citizen Marketplace."}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{decodeURIComponent(error)}</p>
            </div>
          )}

          {!isOtpTab ? (
            /* ── Email + Password Form ── */
            <form action={emailLoginAction} className="space-y-4">
              <input type="hidden" name="next" value={next} />
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email Address
                </label>
                <input
                  id="email" name="email" type="email" autoComplete="email" required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm
                             placeholder:text-muted-foreground focus:outline-none focus:ring-2
                             focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                  <a href="/public/auth/reset-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password" name="password" type="password" autoComplete="current-password" required
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm
                             placeholder:text-muted-foreground focus:outline-none focus:ring-2
                             focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <button type="submit"
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 active:scale-[0.98] transition-all">
                Sign In
              </button>
            </form>
          ) : (
            /* ── Mobile OTP Form ── */
            <form action={sendOtpAction} className="space-y-4">
              <input type="hidden" name="next" value={next} />
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-lg border border-border bg-neutral-50 px-3 text-sm text-muted-foreground shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    id="phone" name="phone" type="tel" inputMode="numeric"
                    pattern="[6-9][0-9]{9}" maxLength={10} required
                    placeholder="98765 43210"
                    className="flex-1 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm
                               placeholder:text-muted-foreground focus:outline-none focus:ring-2
                               focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">10-digit mobile without country code</p>
              </div>
              <button type="submit"
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 active:scale-[0.98] transition-all">
                Send OTP
              </button>
              <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2">
                <p className="text-xs text-yellow-800">
                  SMS OTP requires a pre-registered mobile. If SMS is unavailable, use the Email &amp; Password tab.
                </p>
              </div>
            </form>
          )}

          <div className="mt-5 pt-5 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <a href="/public/register" className="text-primary font-semibold hover:underline">
                Create account \u2192
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
