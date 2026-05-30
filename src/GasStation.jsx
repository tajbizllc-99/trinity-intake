import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@400;600;700&display=swap');`;

const brand = {
  orange: "#ff6a09", orangeLight: "#ff8c3a", orangePale: "#fff4ed",
  green: "#2e8c3a", greenLight: "#3da34a", greenPale: "#edf7ef",
  gold: "#c8920a",
  black: "#1a1a1a", dark: "#333",
  bg: "#fafaf7", bgWarm: "#f5f3ee", bgCard: "#ffffff",
  border: "#d8d4cc", borderLight: "#e8e4dc",
  text: "#1a1a1a", textMuted: "#6a6458", textLight: "#9a9488",
  error: "#c0392b", success: "#2e8c3a",
};

const inputBase = {
  width: "100%", padding: "11px 14px",
  border: `1.5px solid ${brand.border}`,
  borderRadius: 8, fontSize: 15,
  fontFamily: "'DM Sans', sans-serif",
  background: brand.bg, color: brand.text,
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};
const focusRing = { borderColor: brand.orange, boxShadow: `0 0 0 3px rgba(255,106,9,0.12)` };

function Field({ label, children, span, required }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{
        display: "block", fontSize: 11.5, fontWeight: 600,
        letterSpacing: "0.05em", textTransform: "uppercase",
        color: brand.textMuted, marginBottom: 6,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}{required && <span style={{ color: brand.orange }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ label, span, required, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={label} span={span} required={required}>
      <input
        style={{ ...inputBase, ...(focused ? focusRing : {}) }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </Field>
  );
}

function Select({ label, options, span, required, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={label} span={span} required={required}>
      <select
        style={{
          ...inputBase, ...(focused ? focusRing : {}),
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236a6458' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      >
        {options.map(o =>
          typeof o === "string"
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
    </Field>
  );
}

function YesNo({ label, value, onChange, required }) {
  return (
    <Field label={label} required={required}>
      <div style={{ display: "flex", gap: 10 }}>
        {["Yes", "No"].map(opt => (
          <label key={opt} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "10px 14px",
            border: `1.5px solid ${value === opt ? brand.orange : brand.border}`,
            borderRadius: 8, cursor: "pointer",
            background: value === opt ? brand.orangePale : brand.bg,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            color: value === opt ? brand.orange : brand.textMuted,
            transition: "all 0.2s",
          }}>
            <input
              type="radio" name={label} value={opt}
              checked={value === opt} onChange={() => onChange(opt)}
              style={{ display: "none" }}
            />
            <span>{opt === "Yes" ? "✓" : "✗"}</span> {opt}
          </label>
        ))}
      </div>
    </Field>
  );
}

function Grid({ cols = 2, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "14px 18px" }}>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: `1px solid ${brand.borderLight}`, margin: "24px 0" }} />;
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 20, color: brand.black, margin: 0 }}>
          {title}
        </h3>
      </div>
      {subtitle && <p style={{ fontSize: 13, color: brand.textLight, margin: 0, paddingLeft: 30 }}>{subtitle}</p>}
    </div>
  );
}

function StepIndicator({ current, steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: i <= current
                ? `linear-gradient(135deg, ${brand.orange}, ${brand.green})`
                : brand.borderLight,
              color: i <= current ? "#fff" : brand.textLight,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s",
              boxShadow: i === current ? `0 2px 10px rgba(255,106,9,0.3)` : "none",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: i <= current ? brand.black : brand.textLight,
              fontFamily: "'DM Sans', sans-serif",
            }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 52, height: 2, margin: "0 6px", marginBottom: 22,
              background: i < current ? brand.orange : brand.borderLight,
              borderRadius: 1, transition: "background 0.3s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function ReviewRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      padding: "6px 0", borderBottom: `1px solid ${brand.borderLight}`,
      fontSize: 13.5,
    }}>
      <span style={{ color: brand.textMuted, fontWeight: 500 }}>{label}</span>
      <span style={{ color: brand.black, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function StatusBanner({ status, message }) {
  if (!status) return null;
  const styles = {
    sending: { bg: "#fef6ee", bd: brand.border,    tx: brand.textMuted },
    success: { bg: "#edf7ef", bd: "#a5d6a7",       tx: brand.success },
    error:   { bg: "#fce8e6", bd: "#f5b7b1",       tx: brand.error },
  }[status];
  return (
    <div style={{
      padding: "14px 20px", borderRadius: 10, marginTop: 16,
      background: styles.bg, border: `1.5px solid ${styles.bd}`,
      color: styles.tx, fontSize: 14, fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {status === "sending" && <span>⏳</span>}
      {status === "success" && <span>✓</span>}
      {status === "error"   && <span>✕</span>}
      {message}
    </div>
  );
}

const defaultForm = {
  companyName: "", dbaName: "", fein: "", yearInBusiness: "",
  address1: "", address2: "", city: "", state: "", zip: "",
  ownerName: "", phone: "", email: "", policyDate: "",
  yearBuilt: "", constructionType: "", squareFootage: "", numStories: "",
  roofType: "", roofImproved: "", hvacImproved: "", plumbingImproved: "", electricalImproved: "",
  fireAlarm: "", burglarAlarm: "", sprinkler: "", grillFryer: "", hoodSuppression: "",
  buildingCoverage: "0", canopyCoverage: "0", bppValue: "",
  grossSales: "", grocerySales: "", liquorSales: "", gasolineGallons: "", numPumps: "",
  fulltimeEmployees: "", parttimeEmployees: "", yearlyPayroll: "",
  propane: "", specialNotes: "",
};

export default function GasStationIntake() {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState(defaultForm);
  const [status, setStatus]   = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setVal = (k) => (v) => setForm({ ...form, [k]: v });

  const steps = ["Business", "Building", "Safety & Ops", "Coverage"];

  const handleSubmit = async () => {
    setStatus("sending");
    setStatusMsg("Saving your submission…");
    try {
      const { error } = await supabase.from("gas_station_submissions").insert({
        ...form,
        submitted_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);

      setStatusMsg("Sending notification email…");
      const res = await fetch("/api/send-gasstation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Email API error ${res.status}`);
      }

      setStatus("success");
      setStatusMsg(`Submission received! We'll follow up with ${form.companyName || "you"} shortly.`);
    } catch (err) {
      setStatus("error");
      setStatusMsg(`Something went wrong — call (804) 944-6226. (${err.message})`);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(170deg, #f0ede6 0%, ${brand.bg} 35%, #edeae3 100%)`,
      fontFamily: "'DM Sans', sans-serif", color: brand.text,
    }}>
      <style>{FONTS}</style>

      {/* Header */}
      <div style={{ background: brand.black, position: "relative", overflow: "hidden" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${brand.orange} 33%, ${brand.green} 33% 66%, ${brand.gold} 66%)` }} />
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <img
              src="https://img1.wsimg.com/isteam/ip/b8cb52fe-c39d-4111-a8ce-3a2dba74e251/Trinity%20Solutions.png"
              alt="Trinity Solutions"
              style={{ width: 52, height: 52, borderRadius: 10, background: "#fff", padding: 4 }}
              onError={e => { e.target.style.display = "none"; }}
            />
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, color: "#fff", margin: 0 }}>
                Trinity Solutions
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "2px 0 0", letterSpacing: "0.05em" }}>
                Insurance Agency
              </p>
            </div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.06)", borderRadius: 12,
            padding: "16px 22px", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 5, height: 32, borderRadius: 3, background: `linear-gradient(180deg, ${brand.orange}, ${brand.green})` }} />
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 19, color: "#fff", margin: 0 }}>
                  ⛽ Gas Station / Convenience Store — Insurance Questionnaire
                </h2>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", margin: "2px 0 0" }}>
                  Complete all fields marked * for an accurate quote
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div style={{ maxWidth: 760, margin: "-14px auto 0", padding: "0 20px 60px", position: "relative", zIndex: 1 }}>
        <div style={{
          background: "#fff", borderRadius: 20,
          padding: "32px 36px 36px",
          boxShadow: "0 4px 24px rgba(26,26,26,0.07)",
          border: `1px solid ${brand.borderLight}`,
        }}>
          <StepIndicator current={step} steps={steps} />

          <div key={step} style={{ animation: "slideUp 0.3s ease-out" }}>
            <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>

            {/* ── STEP 0: Business Info ── */}
            {step === 0 && (
              <div>
                <SectionHeader icon="🏢" title="Business Information" subtitle="Basic details about the business applying for coverage" />
                <Grid cols={2}>
                  <Input label="Company Name"    required value={form.companyName}    onChange={set("companyName")} />
                  <Input label="DBA Name"                 value={form.dbaName}        onChange={set("dbaName")} placeholder="If different from company name" />
                  <Input label="FEIN Number"     required value={form.fein}           onChange={set("fein")} placeholder="XX-XXXXXXX" />
                  <Input label="Year in Business" required value={form.yearInBusiness} onChange={set("yearInBusiness")} placeholder="e.g. 2010" />
                </Grid>
                <Divider />
                <SectionHeader icon="📍" title="Business Address" />
                <Grid cols={2}>
                  <Input label="Address Line 1" required value={form.address1} onChange={set("address1")} span={2} />
                  <Input label="Address Line 2"          value={form.address2} onChange={set("address2")} span={2} placeholder="Suite, unit, etc." />
                  <Input label="City"           required value={form.city}     onChange={set("city")} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px" }}>
                    <Input label="State" required value={form.state} onChange={set("state")} placeholder="VA" />
                    <Input label="ZIP"   required value={form.zip}   onChange={set("zip")} placeholder="23059" />
                  </div>
                </Grid>
                <Divider />
                <SectionHeader icon="👤" title="Owner & Contact" />
                <Grid cols={2}>
                  <Input label="Owner Legal First &amp; Last Name" required value={form.ownerName} onChange={set("ownerName")} span={2} />
                  <Input label="Phone Number"   required type="tel"   value={form.phone}       onChange={set("phone")} />
                  <Input label="Email Address"  required type="email" value={form.email}       onChange={set("email")} />
                  <Input label="Policy Effective Date" required type="date" value={form.policyDate} onChange={set("policyDate")} />
                </Grid>
              </div>
            )}

            {/* ── STEP 1: Building Details ── */}
            {step === 1 && (
              <div>
                <SectionHeader icon="🏗️" title="Building Details" subtitle="Physical characteristics of the property" />
                <Grid cols={2}>
                  <Input label="Year Built"              required value={form.yearBuilt}      onChange={set("yearBuilt")} placeholder="e.g. 1998" />
                  <Select label="Construction Type"      required value={form.constructionType} onChange={set("constructionType")}
                    options={["", "Frame", "Joisted Masonry", "Non-Combustible", "Masonry Non-Combustible", "Modified Fire Resistive", "Fire Resistive"]} />
                  <Input label="Area in Square Footage"  required value={form.squareFootage}  onChange={set("squareFootage")} placeholder="e.g. 3500" />
                  <Input label="Number of Stories"               value={form.numStories}     onChange={set("numStories")} placeholder="e.g. 1" />
                  <Select label="Roof Type"                       value={form.roofType}       onChange={set("roofType")}
                    options={["", "Flat", "Gable", "Hip", "Metal", "Shingle", "Tile", "Other"]} span={2} />
                </Grid>
                <Divider />
                <SectionHeader icon="🔧" title="Last Improvements" subtitle="Enter the year each system was last updated" />
                <Grid cols={2}>
                  <Input label="Roof"       required value={form.roofImproved}      onChange={set("roofImproved")} placeholder="e.g. 2018" />
                  <Input label="HVAC"       required value={form.hvacImproved}      onChange={set("hvacImproved")} placeholder="e.g. 2020" />
                  <Input label="Plumbing"   required value={form.plumbingImproved}  onChange={set("plumbingImproved")} placeholder="e.g. 2015" />
                  <Input label="Electrical" required value={form.electricalImproved} onChange={set("electricalImproved")} placeholder="e.g. 2019" />
                </Grid>
              </div>
            )}

            {/* ── STEP 2: Safety & Operations ── */}
            {step === 2 && (
              <div>
                <SectionHeader icon="🚨" title="Safety Systems" subtitle="Select Yes or No for each system" />
                <Grid cols={2}>
                  <YesNo label="Fire Alarm"                   required value={form.fireAlarm}      onChange={setVal("fireAlarm")} />
                  <YesNo label="Burglar Alarm"                         value={form.burglarAlarm}   onChange={setVal("burglarAlarm")} />
                  <YesNo label="Sprinkler System"                      value={form.sprinkler}      onChange={setVal("sprinkler")} />
                </Grid>
                <Divider />
                <SectionHeader icon="🍳" title="Cooking & Operations" />
                <Grid cols={2}>
                  <YesNo label="Grill / Fryer"                required value={form.grillFryer}     onChange={setVal("grillFryer")} />
                  <YesNo label="Hood with Fire Suppression"   required value={form.hoodSuppression} onChange={setVal("hoodSuppression")} />
                </Grid>
                <Divider />
                <SectionHeader icon="⛽" title="Propane" />
                <Select
                  label="Propane Filling Station or Propane Tank Swap?"
                  required value={form.propane} onChange={set("propane")}
                  options={["", "Propane Filling Station", "Propane Tank Swap", "None"]}
                />
              </div>
            )}

            {/* ── STEP 3: Coverage & Financials ── */}
            {step === 3 && (
              <div>
                <SectionHeader icon="🏠" title="Coverage Amounts" subtitle="Enter 0 if not needed" />
                <Grid cols={2}>
                  <Input label="Building Coverage Amount ($)"          value={form.buildingCoverage} onChange={set("buildingCoverage")} placeholder="0" />
                  <Input label="Canopy Coverage Amount ($)"            value={form.canopyCoverage}   onChange={set("canopyCoverage")} placeholder="0" />
                  <Input label="Business Personal Property Value ($)"  required value={form.bppValue} onChange={set("bppValue")} placeholder="e.g. 150000" span={2} />
                </Grid>
                <Divider />
                <SectionHeader icon="💰" title="Sales & Revenue" />
                <Grid cols={2}>
                  <Input label="Gross Sales ($)"              required value={form.grossSales}     onChange={set("grossSales")} />
                  <Input label="Grocery (Food) Sales ($)"     required value={form.grocerySales}   onChange={set("grocerySales")} />
                  <Input label="Liquor, Beer &amp; Wine Sales ($)"  required value={form.liquorSales}    onChange={set("liquorSales")} />
                  <Input label="Gasoline Sales (Gallons/yr)"  required value={form.gasolineGallons} onChange={set("gasolineGallons")} placeholder="e.g. 500000" />
                  <Input label="Number of Gas &amp; Diesel Pumps" required value={form.numPumps} onChange={set("numPumps")} placeholder="e.g. 6" span={2} />
                </Grid>
                <Divider />
                <SectionHeader icon="👥" title="Employees & Payroll" />
                <Grid cols={2}>
                  <Input label="Full-Time Employees"  required value={form.fulltimeEmployees}  onChange={set("fulltimeEmployees")} />
                  <Input label="Part-Time Employees"  required value={form.parttimeEmployees}  onChange={set("parttimeEmployees")} />
                  <Input label="Yearly Payroll ($)"   required value={form.yearlyPayroll}      onChange={set("yearlyPayroll")} span={2} />
                </Grid>
                <Divider />
                <Field label="Any Special Information to Share With Us">
                  <textarea
                    style={{ ...inputBase, minHeight: 90, resize: "vertical" }}
                    value={form.specialNotes}
                    onChange={set("specialNotes")}
                    placeholder="Anything else we should know about this account…"
                  />
                </Field>

                <Divider />

                {/* Review Summary */}
                <SectionHeader icon="📋" title="Review Your Submission" subtitle="Please confirm everything looks correct before submitting" />

                <div style={{ background: brand.bgWarm, borderRadius: 12, padding: "16px 20px", marginBottom: 16, border: `1px solid ${brand.borderLight}` }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, color: brand.black, marginBottom: 10 }}>🏢 Business</div>
                  <ReviewRow label="Company"     value={form.companyName} />
                  <ReviewRow label="DBA"         value={form.dbaName} />
                  <ReviewRow label="FEIN"        value={form.fein} />
                  <ReviewRow label="Address"     value={`${form.address1}${form.city ? `, ${form.city}` : ""}${form.state ? `, ${form.state}` : ""} ${form.zip}`} />
                  <ReviewRow label="Owner"       value={form.ownerName} />
                  <ReviewRow label="Phone"       value={form.phone} />
                  <ReviewRow label="Email"       value={form.email} />
                  <ReviewRow label="Policy Date" value={form.policyDate} />
                </div>

                <div style={{ background: brand.bgWarm, borderRadius: 12, padding: "16px 20px", marginBottom: 16, border: `1px solid ${brand.borderLight}` }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, color: brand.black, marginBottom: 10 }}>🏗️ Building</div>
                  <ReviewRow label="Year Built"     value={form.yearBuilt} />
                  <ReviewRow label="Construction"   value={form.constructionType} />
                  <ReviewRow label="Square Footage" value={form.squareFootage} />
                  <ReviewRow label="Stories"        value={form.numStories} />
                  <ReviewRow label="Roof Type"      value={form.roofType} />
                  <ReviewRow label="Roof Updated"   value={form.roofImproved} />
                  <ReviewRow label="HVAC Updated"   value={form.hvacImproved} />
                  <ReviewRow label="Plumbing Updated"   value={form.plumbingImproved} />
                  <ReviewRow label="Electrical Updated" value={form.electricalImproved} />
                </div>

                <div style={{ background: brand.bgWarm, borderRadius: 12, padding: "16px 20px", marginBottom: 16, border: `1px solid ${brand.borderLight}` }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, color: brand.black, marginBottom: 10 }}>⚙️ Safety & Operations</div>
                  <ReviewRow label="Fire Alarm"        value={form.fireAlarm} />
                  <ReviewRow label="Burglar Alarm"     value={form.burglarAlarm} />
                  <ReviewRow label="Sprinkler"         value={form.sprinkler} />
                  <ReviewRow label="Grill / Fryer"     value={form.grillFryer} />
                  <ReviewRow label="Hood Suppression"  value={form.hoodSuppression} />
                  <ReviewRow label="Propane"           value={form.propane} />
                </div>

                <div style={{ background: brand.bgWarm, borderRadius: 12, padding: "16px 20px", marginBottom: 20, border: `1px solid ${brand.borderLight}` }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, color: brand.black, marginBottom: 10 }}>💰 Coverage & Financials</div>
                  <ReviewRow label="Building Coverage"  value={`$${form.buildingCoverage}`} />
                  <ReviewRow label="Canopy Coverage"    value={`$${form.canopyCoverage}`} />
                  <ReviewRow label="BPP Value"          value={`$${form.bppValue}`} />
                  <ReviewRow label="Gross Sales"        value={`$${form.grossSales}`} />
                  <ReviewRow label="Grocery Sales"      value={`$${form.grocerySales}`} />
                  <ReviewRow label="Liquor/Beer/Wine"   value={`$${form.liquorSales}`} />
                  <ReviewRow label="Gas (Gallons/yr)"   value={form.gasolineGallons} />
                  <ReviewRow label="Pumps"              value={form.numPumps} />
                  <ReviewRow label="FT Employees"       value={form.fulltimeEmployees} />
                  <ReviewRow label="PT Employees"       value={form.parttimeEmployees} />
                  <ReviewRow label="Yearly Payroll"     value={`$${form.yearlyPayroll}`} />
                  {form.specialNotes && <ReviewRow label="Notes" value={form.specialNotes} />}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: step === 0 ? "flex-end" : "space-between", marginTop: 28 }}>
            {step > 0 && (
              <button
                onClick={() => { setStep(step - 1); setStatus(null); }}
                style={{
                  padding: "12px 28px", border: `1.5px solid ${brand.border}`,
                  borderRadius: 10, background: "transparent", cursor: "pointer",
                  fontSize: 15, fontWeight: 600, color: brand.textMuted,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ← Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  padding: "12px 32px", border: "none", borderRadius: 10, cursor: "pointer",
                  background: `linear-gradient(135deg, ${brand.orange}, ${brand.green})`,
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: `0 4px 14px rgba(255,106,9,0.25)`,
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={status === "sending" || status === "success"}
                style={{
                  padding: "12px 36px", border: "none", borderRadius: 10,
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                  background: status === "success"
                    ? `linear-gradient(135deg, ${brand.green}, #1a6b2a)`
                    : `linear-gradient(135deg, ${brand.orange}, ${brand.green})`,
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: status === "sending" ? 0.7 : 1,
                  boxShadow: `0 4px 14px rgba(255,106,9,0.25)`,
                  transition: "all 0.3s",
                }}
              >
                {status === "sending" ? "Submitting…" : status === "success" ? "✓ Submitted!" : "Submit Questionnaire →"}
              </button>
            )}
          </div>

          {step === 3 && <StatusBanner status={status} message={statusMsg} />}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, paddingBottom: 16 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: brand.black, margin: "0 0 3px" }}>
            Trinity Solutions Insurance Agency
          </p>
          <p style={{ fontSize: 12, color: brand.textLight, margin: 0 }}>
            5348 Twin Hickory Rd, Glen Allen VA 23059 &nbsp;|&nbsp; (804) 944-6226 &nbsp;|&nbsp; info@taj-biz.com
          </p>
        </div>
      </div>
    </div>
  );
}
