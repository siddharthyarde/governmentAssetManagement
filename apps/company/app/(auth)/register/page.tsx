import { registerCompanyAction } from "./actions";

const INDIAN_STATES = [
  ["AN","Andaman & Nicobar Islands"],["AP","Andhra Pradesh"],["AR","Arunachal Pradesh"],
  ["AS","Assam"],["BR","Bihar"],["CH","Chandigarh"],["CT","Chhattisgarh"],
  ["DN","Dadra & Nagar Haveli and Daman & Diu"],["DL","Delhi"],["GA","Goa"],
  ["GJ","Gujarat"],["HR","Haryana"],["HP","Himachal Pradesh"],["JK","Jammu & Kashmir"],
  ["JH","Jharkhand"],["KA","Karnataka"],["KL","Kerala"],["LA","Ladakh"],
  ["LD","Lakshadweep"],["MP","Madhya Pradesh"],["MH","Maharashtra"],["MN","Manipur"],
  ["ML","Meghalaya"],["MZ","Mizoram"],["NL","Nagaland"],["OD","Odisha"],
  ["PY","Puducherry"],["PB","Punjab"],["RJ","Rajasthan"],["SK","Sikkim"],
  ["TN","Tamil Nadu"],["TS","Telangana"],["TR","Tripura"],["UP","Uttar Pradesh"],
  ["UT","Uttarakhand"],["WB","West Bengal"],
] as const;

const inp =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const lbl = "block text-sm font-medium text-foreground mb-1.5";
const sec = "text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border w-full";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function CompanyRegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="w-full max-w-3xl py-8">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        <div className="mb-6">
          <div className="flex gap-2 items-center mb-1">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
              GFR 2017 Compliant
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Register Your Company
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All fields marked <span className="text-red-500">*</span> are
            mandatory. Your application will be reviewed within 5 working days.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700 font-medium">
              {decodeURIComponent(error)}
            </p>
          </div>
        )}

        <form action={registerCompanyAction} className="space-y-8">
          {/* ── 1. Account Credentials ── */}
          <fieldset>
            <legend className={sec}>1. Account Credentials</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="email" className={lbl}>
                  Login Email <span className="text-red-500">*</span>
                </label>
                <input id="email" name="email" type="email" required
                  autoComplete="email" placeholder="accounts@yourcompany.com" className={inp} />
              </div>
              <div>
                <label htmlFor="password" className={lbl}>
                  Password <span className="text-red-500">*</span>
                </label>
                <input id="password" name="password" type="password" required
                  minLength={8} autoComplete="new-password" placeholder="Min. 8 characters" className={inp} />
              </div>
              <div>
                <label htmlFor="confirm_password" className={lbl}>
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input id="confirm_password" name="confirm_password" type="password"
                  required autoComplete="new-password" placeholder="Re-enter password" className={inp} />
              </div>
            </div>
          </fieldset>

          {/* ── 2. Company Identity ── */}
          <fieldset>
            <legend className={sec}>2. Company Identity</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="legal_name" className={lbl}>
                  Legal / Registered Name <span className="text-red-500">*</span>
                </label>
                <input id="legal_name" name="legal_name" type="text" required
                  placeholder="As per MCA / GST registration" className={inp} />
              </div>
              <div>
                <label htmlFor="trade_name" className={lbl}>
                  Trade / Brand Name
                </label>
                <input id="trade_name" name="trade_name" type="text"
                  placeholder="Brand name (if different)" className={inp} />
              </div>
              <div>
                <label htmlFor="cin" className={lbl}>
                  CIN{" "}
                  <span className="text-muted-foreground text-xs font-normal">(for Pvt/Public Ltd)</span>
                </label>
                <input id="cin" name="cin" type="text"
                  placeholder="L17110MH1973PLC019786" className={inp} />
              </div>
              <div>
                <label htmlFor="gstin" className={lbl}>
                  GSTIN <span className="text-red-500">*</span>
                </label>
                <input id="gstin" name="gstin" type="text" required
                  placeholder="27AAPFU0939F1ZV" style={{ textTransform: "uppercase" }} className={inp} />
              </div>
              <div>
                <label htmlFor="pan" className={lbl}>
                  PAN <span className="text-red-500">*</span>
                </label>
                <input id="pan" name="pan" type="text" required
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  placeholder="AAPFU0939F" style={{ textTransform: "uppercase" }} className={inp} />
              </div>

              {/* MSME */}
              <div className="col-span-2">
                <p className={lbl}>MSME Status</p>
                <div className="flex gap-6">
                  {["yes", "no"].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="is_msme" value={v}
                        defaultChecked={v === "no"} className="accent-primary h-4 w-4" />
                      {v === "yes" ? "Yes, MSME registered" : "No"}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="msme_number" className={lbl}>
                  Udyam Registration No.
                </label>
                <input id="msme_number" name="msme_number" type="text"
                  placeholder="UDYAM-MH-01-0000001" className={inp} />
              </div>
              <div>
                <label htmlFor="msme_category" className={lbl}>
                  MSME Category
                </label>
                <select id="msme_category" name="msme_category" className={inp}>
                  <option value="">Not applicable</option>
                  <option value="micro">Micro</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* ── 3. Contact Information ── */}
          <fieldset>
            <legend className={sec}>3. Contact Information</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_email" className={lbl}>
                  Official Contact Email <span className="text-red-500">*</span>
                </label>
                <input id="contact_email" name="contact_email" type="email" required
                  placeholder="info@yourcompany.com" className={inp} />
              </div>
              <div>
                <label htmlFor="contact_mobile" className={lbl}>
                  Contact Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-lg border border-border bg-neutral-50 px-3 text-sm text-muted-foreground shrink-0">
                    🇮🇳 +91
                  </span>
                  <input id="contact_mobile" name="contact_mobile" type="tel"
                    inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10}
                    required placeholder="98765 43210" className={`${inp} flex-1`} />
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="website" className={lbl}>
                  Company Website
                </label>
                <input id="website" name="website" type="url"
                  placeholder="https://www.yourcompany.com" className={inp} />
              </div>
            </div>
          </fieldset>

          {/* ── 4. Registered Address ── */}
          <fieldset>
            <legend className={sec}>4. Registered Office Address</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="addr_line1" className={lbl}>
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input id="addr_line1" name="addr_line1" type="text" required
                  placeholder="Plot / Building / Street" className={inp} />
              </div>
              <div className="col-span-2">
                <label htmlFor="addr_line2" className={lbl}>Address Line 2</label>
                <input id="addr_line2" name="addr_line2" type="text"
                  placeholder="Area / Colony" className={inp} />
              </div>
              <div>
                <label htmlFor="addr_city" className={lbl}>City <span className="text-red-500">*</span></label>
                <input id="addr_city" name="addr_city" type="text" required
                  placeholder="Mumbai" className={inp} />
              </div>
              <div>
                <label htmlFor="addr_district" className={lbl}>District <span className="text-red-500">*</span></label>
                <input id="addr_district" name="addr_district" type="text" required
                  placeholder="Mumbai" className={inp} />
              </div>
              <div>
                <label htmlFor="addr_state" className={lbl}>State <span className="text-red-500">*</span></label>
                <select id="addr_state" name="addr_state" required className={inp}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="addr_pincode" className={lbl}>PIN Code <span className="text-red-500">*</span></label>
                <input id="addr_pincode" name="addr_pincode" type="text"
                  inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6}
                  required placeholder="400001" className={inp} />
              </div>
            </div>
          </fieldset>

          {/* ── 5. Bank Details ── */}
          <fieldset>
            <legend className={sec}>5. Bank Account (for Payments)</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bank_name" className={lbl}>Bank Name <span className="text-red-500">*</span></label>
                <input id="bank_name" name="bank_name" type="text" required
                  placeholder="State Bank of India" className={inp} />
              </div>
              <div>
                <label htmlFor="bank_ifsc" className={lbl}>IFSC Code <span className="text-red-500">*</span></label>
                <input id="bank_ifsc" name="bank_ifsc" type="text" required
                  pattern="[A-Z]{4}0[A-Z0-9]{6}"
                  placeholder="SBIN0001234" style={{ textTransform: "uppercase" }} className={inp} />
              </div>
              <div className="col-span-2">
                <label htmlFor="bank_account_no" className={lbl}>Account Number <span className="text-red-500">*</span></label>
                <input id="bank_account_no" name="bank_account_no" type="text"
                  inputMode="numeric" minLength={9} maxLength={18}
                  required placeholder="Enter bank account number" className={inp} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Only last 4 digits will be stored. Full number is not retained.
                </p>
              </div>
            </div>
          </fieldset>

          {/* ── 6. Documents checklist (informational) ── */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              Documents required after registration (upload in dashboard):
            </p>
            <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
              <li>GST Registration Certificate</li>
              <li>PAN Card (company)</li>
              <li>Certificate of Incorporation / Partnership Deed</li>
              <li>Udyam Certificate (if MSME)</li>
              <li>Cancelled Cheque / Bank Passbook</li>
              <li>Director/Partner Aadhaar & PAN</li>
              <li>Last 2 years ITR</li>
              <li>Product samples or catalogue</li>
            </ul>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2.5">
            <input type="checkbox" id="terms" required
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary" />
            <label htmlFor="terms" className="text-xs text-muted-foreground">
              I certify that the above information is true and accurate. I agree to
              the GAMS{" "}
              <a href="/terms" className="text-primary hover:underline">Supplier Terms</a> and{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              I understand that false information may result in blacklisting under GFR 2017.
            </label>
          </div>

          <button type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white
                       hover:bg-primary/90 active:scale-[0.98] transition-all">
            Submit Registration Application
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <a href="/login" className="text-primary font-semibold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
