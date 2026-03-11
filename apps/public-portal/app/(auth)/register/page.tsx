import { registerAction } from "./actions";

const INDIAN_STATES = [
  ["AN", "Andaman & Nicobar Islands"],
  ["AP", "Andhra Pradesh"],
  ["AR", "Arunachal Pradesh"],
  ["AS", "Assam"],
  ["BR", "Bihar"],
  ["CH", "Chandigarh"],
  ["CT", "Chhattisgarh"],
  ["DN", "Dadra & Nagar Haveli and Daman & Diu"],
  ["DL", "Delhi"],
  ["GA", "Goa"],
  ["GJ", "Gujarat"],
  ["HR", "Haryana"],
  ["HP", "Himachal Pradesh"],
  ["JK", "Jammu & Kashmir"],
  ["JH", "Jharkhand"],
  ["KA", "Karnataka"],
  ["KL", "Kerala"],
  ["LA", "Ladakh"],
  ["LD", "Lakshadweep"],
  ["MP", "Madhya Pradesh"],
  ["MH", "Maharashtra"],
  ["MN", "Manipur"],
  ["ML", "Meghalaya"],
  ["MZ", "Mizoram"],
  ["NL", "Nagaland"],
  ["OD", "Odisha"],
  ["PY", "Puducherry"],
  ["PB", "Punjab"],
  ["RJ", "Rajasthan"],
  ["SK", "Sikkim"],
  ["TN", "Tamil Nadu"],
  ["TS", "Telangana"],
  ["TR", "Tripura"],
  ["UP", "Uttar Pradesh"],
  ["UT", "Uttarakhand"],
  ["WB", "West Bengal"],
] as const;

interface Props {
  searchParams: Promise<{ error?: string }>;
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const labelCls = "block text-sm font-medium text-foreground mb-1.5";
const fieldCls = "col-span-1";

export default async function PublicRegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="w-full max-w-2xl py-8">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Create Citizen Account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Register to browse and purchase redistributed government assets at
            discounted prices.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700 font-medium">
              {decodeURIComponent(error)}
            </p>
          </div>
        )}

        <form action={registerAction} className="space-y-6">
          {/* ── Section 1: Personal Details ── */}
          <fieldset>
            <legend className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border w-full">
              Personal Information
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <div className={`${fieldCls} col-span-2`}>
                <label htmlFor="full_name" className={labelCls}>
                  Full Name (as per Aadhaar) <span className="text-red-500">*</span>
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Rahul Kumar Sharma"
                  className={inputCls}
                />
              </div>

              <div className={fieldCls}>
                <label htmlFor="date_of_birth" className={labelCls}>
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  required
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                    .toISOString()
                    .split("T")[0]}
                  className={inputCls}
                />
              </div>

              <div className={fieldCls}>
                <label htmlFor="gender" className={labelCls}>
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className={inputCls}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* ── Section 2: Contact ── */}
          <fieldset>
            <legend className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border w-full">
              Contact Details
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <div className={fieldCls}>
                <label htmlFor="mobile" className={labelCls}>
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-lg border border-border bg-neutral-50 px-3 text-sm text-muted-foreground shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    required
                    placeholder="98765 43210"
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </div>

              <div className={fieldCls}>
                <label htmlFor="email" className={labelCls}>
                  Email Address{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
            </div>
          </fieldset>

          {/* ── Section 3: Address ── */}
          <fieldset>
            <legend className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border w-full">
              Delivery Address
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <div className={`${fieldCls} col-span-2`}>
                <label htmlFor="address_line1" className={labelCls}>
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  id="address_line1"
                  name="address_line1"
                  type="text"
                  required
                  autoComplete="address-line1"
                  placeholder="House / Flat no., Building name, Street"
                  className={inputCls}
                />
              </div>

              <div className={`${fieldCls} col-span-2`}>
                <label htmlFor="address_line2" className={labelCls}>
                  Address Line 2{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  id="address_line2"
                  name="address_line2"
                  type="text"
                  autoComplete="address-line2"
                  placeholder="Locality / Area / Colony"
                  className={inputCls}
                />
              </div>

              <div className={fieldCls}>
                <label htmlFor="city" className={labelCls}>
                  City / Town <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  autoComplete="address-level2"
                  placeholder="Mumbai"
                  className={inputCls}
                />
              </div>

              <div className={fieldCls}>
                <label htmlFor="district" className={labelCls}>
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  required
                  placeholder="Mumbai Suburban"
                  className={inputCls}
                />
              </div>

              <div className={fieldCls}>
                <label htmlFor="state_code" className={labelCls}>
                  State / UT <span className="text-red-500">*</span>
                </label>
                <select
                  id="state_code"
                  name="state_code"
                  required
                  className={inputCls}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={fieldCls}>
                <label htmlFor="pincode" className={labelCls}>
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  inputMode="numeric"
                  pattern="[1-9][0-9]{5}"
                  maxLength={6}
                  required
                  placeholder="400001"
                  className={inputCls}
                />
              </div>
            </div>
          </fieldset>

          {/* ── Section 4: Set Password ── */}
          <fieldset>
            <legend className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border w-full">
              Set Password
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <div className={fieldCls}>
                <label htmlFor="password" className={labelCls}>
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className={inputCls}
                />
              </div>

              <div className={fieldCls}>
                <label htmlFor="confirm_password" className={labelCls}>
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter password"
                  className={inputCls}
                />
              </div>
            </div>
          </fieldset>

          {/* Terms */}
          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground">
              I confirm that the information provided is accurate. I agree to the{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              . I consent to verification of details through government databases
              as permitted under Aadhaar Act 2016.
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white
                       hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
