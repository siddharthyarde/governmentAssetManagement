import { registerInstitutionAction } from "./actions";

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

const INSTITUTION_TYPES = [
  ["central_govt", "Central Government Ministry / Department"],
  ["state_govt", "State Government Department"],
  ["municipal_body", "Municipal Corporation / Council"],
  ["panchayat", "Gram Panchayat / Panchayat Samiti"],
  ["public_sector_undertaking", "Public Sector Undertaking (PSU)"],
  ["autonomous_body", "Autonomous Body / Statutory Authority"],
  ["ngo_registered", "NGO / Trust / Society (registered)"],
  ["educational_institution", "Government School / College / University"],
  ["hospital_govt", "Government Hospital / Health Centre"],
  ["defence", "Defence / Paramilitary"],
  ["police", "Police Department"],
  ["other", "Other (specify in notes)"],
] as const;

const inp =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary";
const lbl = "block text-sm font-medium text-foreground mb-1.5";
const sec =
  "text-xs font-bold text-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border w-full";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function BuyerRegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="w-full max-w-3xl py-8">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        <div className="mb-6">
          <div className="flex gap-2 mb-1">
            <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
              Government / NGO
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              GFR 2017 Compliant
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Register Your Institution
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access surplus government assets through approved redistribution
            channels. Applications are reviewed within 7 working days.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700 font-medium">
              {decodeURIComponent(error)}
            </p>
          </div>
        )}

        <form action={registerInstitutionAction} className="space-y-8">
          {/* ── 1. Portal Account ── */}
          <fieldset>
            <legend className={sec}>1. Portal Account</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="email" className={lbl}>
                  Official Email Address <span className="text-red-500">*</span>
                </label>
                <input id="email" name="email" type="email" required
                  autoComplete="email"
                  placeholder="nodal.officer@institution.gov.in" className={inp} />
              </div>
              <div>
                <label htmlFor="password" className={lbl}>
                  Password <span className="text-red-500">*</span>
                </label>
                <input id="password" name="password" type="password"
                  required minLength={8} autoComplete="new-password"
                  placeholder="Min. 8 characters" className={inp} />
              </div>
              <div>
                <label htmlFor="confirm_password" className={lbl}>
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input id="confirm_password" name="confirm_password" type="password"
                  required autoComplete="new-password"
                  placeholder="Re-enter password" className={inp} />
              </div>
            </div>
          </fieldset>

          {/* ── 2. Institution Details ── */}
          <fieldset>
            <legend className={sec}>2. Institution Details</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="name" className={lbl}>
                  Institution Full Name <span className="text-red-500">*</span>
                </label>
                <input id="name" name="name" type="text" required
                  placeholder="Office of the Collector, District XYZ" className={inp} />
              </div>
              <div className="col-span-2">
                <label htmlFor="institution_type" className={lbl}>
                  Institution Type <span className="text-red-500">*</span>
                </label>
                <select id="institution_type" name="institution_type" required className={inp}>
                  <option value="">Select type</option>
                  {INSTITUTION_TYPES.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="gov_level" className={lbl}>Government Level</label>
                <select id="gov_level" name="gov_level" className={inp}>
                  <option value="">Not applicable</option>
                  <option value="central">Central</option>
                  <option value="state">State</option>
                  <option value="municipal">Municipal / District</option>
                  <option value="panchayat">Panchayat</option>
                </select>
              </div>
              <div>
                <label htmlFor="registration_number" className={lbl}>
                  Registration / Reference No.
                </label>
                <input id="registration_number" name="registration_number" type="text"
                  placeholder="NGO reg, trust deed no., etc." className={inp} />
              </div>
              <div>
                <label htmlFor="pan" className={lbl}>PAN</label>
                <input id="pan" name="pan" type="text"
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  placeholder="AAAPT1234C" style={{ textTransform: "uppercase" }} className={inp} />
              </div>
              <div>
                <label htmlFor="gstin" className={lbl}>GSTIN</label>
                <input id="gstin" name="gstin" type="text"
                  placeholder="If GST registered" style={{ textTransform: "uppercase" }} className={inp} />
              </div>

              {/* NGO certifications */}
              <div className="col-span-2">
                <p className={lbl}>NGO / Trust Certifications</p>
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="is_80g" value="yes"
                      className="h-4 w-4 rounded accent-secondary" />
                    80G Certified
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="is_12a" value="yes"
                      className="h-4 w-4 rounded accent-secondary" />
                    12A Registered
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          {/* ── 3. Contact Persons ── */}
          <fieldset>
            <legend className={sec}>3. Contact Information</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="head_of_organisation" className={lbl}>
                  Head of Organisation
                </label>
                <input id="head_of_organisation" name="head_of_organisation" type="text"
                  placeholder="Name / Designation" className={inp} />
              </div>
              <div>
                <label htmlFor="contact_email" className={lbl}>
                  Official Email <span className="text-red-500">*</span>
                </label>
                <input id="contact_email" name="contact_email" type="email" required
                  placeholder="info@institution.gov.in" className={inp} />
              </div>
              <div>
                <label htmlFor="nodal_officer" className={lbl}>
                  Nodal Officer Name <span className="text-red-500">*</span>
                </label>
                <input id="nodal_officer" name="nodal_officer" type="text" required
                  placeholder="Full name" className={inp} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Person responsible for asset collection &amp; acknowledgement
                </p>
              </div>
              <div>
                <label htmlFor="nodal_officer_mobile" className={lbl}>
                  Nodal Officer Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-lg border border-border bg-neutral-50 px-3 text-sm text-muted-foreground shrink-0">
                    🇮🇳 +91
                  </span>
                  <input id="nodal_officer_mobile" name="nodal_officer_mobile"
                    type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}"
                    maxLength={10} required placeholder="98765 43210"
                    className={`${inp} flex-1`} />
                </div>
              </div>
              <div>
                <label htmlFor="contact_mobile" className={lbl}>
                  Institution Contact Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-lg border border-border bg-neutral-50 px-3 text-sm text-muted-foreground shrink-0">
                    🇮🇳 +91
                  </span>
                  <input id="contact_mobile" name="contact_mobile"
                    type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}"
                    maxLength={10} required placeholder="98765 43210"
                    className={`${inp} flex-1`} />
                </div>
              </div>
            </div>
          </fieldset>

          {/* ── 4. Address ── */}
          <fieldset>
            <legend className={sec}>4. Institutional Address</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="addr_line1" className={lbl}>
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input id="addr_line1" name="addr_line1" type="text" required
                  placeholder="Office / Building / Street" className={inp} />
              </div>
              <div className="col-span-2">
                <label htmlFor="addr_line2" className={lbl}>Address Line 2</label>
                <input id="addr_line2" name="addr_line2" type="text"
                  placeholder="Area / Colony / Taluka" className={inp} />
              </div>
              <div>
                <label htmlFor="addr_city" className={lbl}>City <span className="text-red-500">*</span></label>
                <input id="addr_city" name="addr_city" type="text" required className={inp} />
              </div>
              <div>
                <label htmlFor="addr_district" className={lbl}>District <span className="text-red-500">*</span></label>
                <input id="addr_district" name="addr_district" type="text" required className={inp} />
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
                  required placeholder="110001" className={inp} />
              </div>
            </div>
          </fieldset>

          {/* ── Documents checklist ── */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-green-900 mb-2">
              Documents required after registration (upload in dashboard):
            </p>
            <ul className="text-xs text-green-800 space-y-1 list-disc list-inside">
              <li>Institutional letter / authority letter on official letterhead</li>
              <li>PAN Card of institution</li>
              <li>Registration certificate (Society / Trust / NGO)</li>
              <li>80G / 12A certificate (if NGO)</li>
              <li>Nodal officer nomination letter signed by head of organisation</li>
              <li>District Magistrate / Ministry sanction (for govt bodies)</li>
            </ul>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2.5">
            <input type="checkbox" id="terms" required
              className="mt-0.5 h-4 w-4 rounded border-border accent-secondary" />
            <label htmlFor="terms" className="text-xs text-muted-foreground">
              I certify that my institution is eligible under GFR 2017 Rule 197
              for receipt of government surplus assets. I agree to the{" "}
              <a href="/terms" className="text-secondary hover:underline">Terms of Service</a> and confirm
              that assets received will be used solely for the stated institutional purpose.
            </label>
          </div>

          <button type="submit"
            className="w-full rounded-lg bg-secondary py-3 text-sm font-semibold text-white
                       hover:bg-secondary/90 active:scale-[0.98] transition-all">
            Submit Registration Application
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <a href="/login" className="text-secondary font-semibold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
