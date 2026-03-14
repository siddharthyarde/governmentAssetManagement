import { sendOtpAction, verifyOtpAction } from "../actions";

interface Props {
  searchParams: Promise<{
    error?: string;
    next?: string;
    step?: string;
    phone?: string;
  }>;
}

export default async function PublicLoginPage({ searchParams }: Props) {
  const {
    error,
    next = "/public/account",
    step,
    phone = "",
  } = await searchParams;

  const isOtpStep = step === "otp" && phone;

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        {!isOtpStep ? (
          /* ── Step 1: Enter mobile number ── */
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Sign In with Mobile
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll send a one-time password to your registered mobile
                number.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-700">{decodeURIComponent(error)}</p>
              </div>
            )}

            <form action={sendOtpAction} className="space-y-4">
              <input type="hidden" name="next" value={next} />

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-lg border border-border bg-neutral-50 px-3 text-sm text-muted-foreground shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    required
                    placeholder="98765 43210"
                    className="flex-1 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm
                               placeholder:text-muted-foreground focus:outline-none focus:ring-2
                               focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter 10-digit mobile without country code
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white
                           hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                Send OTP
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                New here?{" "}
                <a href="/public/register" className="text-primary font-semibold hover:underline">
                  Create account →
                </a>
              </p>
            </div>
          </>
        ) : (
          /* ── Step 2: Enter OTP ── */
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Enter OTP</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                A 6-digit OTP was sent to{" "}
                <span className="font-semibold text-foreground">
                  +91 {decodeURIComponent(phone)}
                </span>
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
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  6-digit OTP
                </label>
                <input
                  id="token"
                  name="token"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="• • • • • •"
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-center
                             text-xl tracking-[0.5em] font-bold placeholder:text-muted-foreground
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white
                           hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                Verify &amp; Sign In
              </button>
            </form>

            <div className="mt-4 text-center">
              <a
                href={`/public/login?next=${encodeURIComponent(next)}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Use a different number
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
