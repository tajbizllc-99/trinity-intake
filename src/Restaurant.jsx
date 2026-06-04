import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@400;600;700&display=swap');`;

const brand = {
  orange: "#ff6a09", orangePale: "#fff4ed",
  green: "#2e8c3a", gold: "#c8920a",
  black: "#1a1a1a",
  bg: "#fafaf7", bgWarm: "#f5f3ee",
  border: "#d8d4cc", borderLight: "#e8e4dc",
  text: "#1a1a1a", textMuted: "#6a6458", textLight: "#9a9488",
  error: "#c0392b", success: "#2e8c3a",
};

const inputBase = {
  width: "100%", padding: "11px 14px",
  border: `1.5px solid ${brand.border}`, borderRadius: 8,
  fontSize: 15, fontFamily: "'DM Sans', sans-serif",
  background: brand.bg, color: brand.text, outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
};
const focusRing = { borderColor: brand.orange, boxShadow: `0 0 0 3px rgba(255,106,9,0.12)` };

function Field({ label, children, span, required }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{
        display: "block", fontSize: 11.5, fontWeight: 600,
        letterSpacing: "0.05em", textTransform: "uppercase",
        color: brand.textMuted, marginBottom: 6, fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}{required && <span style={{ color: brand.orange }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ label, span, required, ...props }) {
  const [f, setF] = useState(false);
  return (
    <Field label={label} span={span} required={required}>
      <input style={{ ...inputBase, ...(f ? focusRing : {}) }}
        onFocus={() => setF(true)} onBlur={() => setF(false)} {...props} />
    </Field>
  );
}

function RadioGroup({ label, options, value, onChange, required, span }) {
  return (
    <Field label={label} span={span} required={required}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {options.map(opt => (
          <label key={opt} style={{
            flex: 1, minWidth: 80, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 7, padding: "10px 12px",
            border: `1.5px solid ${value === opt ? brand.orange : brand.border}`,
            borderRadius: 8, cursor: "pointer",
            background: value === opt ? brand.orangePale : brand.bg,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600,
            color: value === opt ? brand.orange : brand.textMuted,
            transition: "all 0.2s",
          }}>
            <input type="radio" value={opt} checked={value === opt}
              onChange={() => onChange(opt)} style={{ display: "none" }} />
            {opt}
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
              background: i <= current ? `linear-gradient(135deg, ${brand.orange}, ${brand.green})` : brand.borderLight,
              color: i <= current ? "#fff" : brand.textLight,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s",
              boxShadow: i === current ? `0 2px 10px rgba(255,106,9,0.3)` : "none",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif",
              color: i <= current ? brand.black : brand.textLight,
            }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 44, height: 2, margin: "0 6px", marginBottom: 22,
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
  if (!value) return null;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      padding: "6px 0", borderBottom: `1px solid ${brand.borderLight}`, fontSize: 13.5,
    }}>
      <span style={{ color: brand.textMuted, fontWeight: 500 }}>{label}</span>
      <span style={{ color: brand.black, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function StatusBanner({ status, message }) {
  if (!status) return null;
  const s = {
    sending: { bg: "#fef6ee", bd: brand.border,  tx: brand.textMuted },
    success: { bg: "#edf7ef", bd: "#a5d6a7",     tx: brand.success },
    error:   { bg: "#fce8e6", bd: "#f5b7b1",     tx: brand.error },
  }[status];
  return (
    <div style={{
      padding: "14px 20px", borderRadius: 10, marginTop: 16,
      background: s.bg, border: `1.5px solid ${s.bd}`, color: s.tx,
      fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
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
  ownerEmail: "", ownerName: "", dob: "", ownerAddress: "",
  phone: "", email: "", businessName: "",
  vinNumber: "", driversLicense: "", businessAddress: "", ein: "",
  buildingYear: "", squareFootage: "", numTables: "",
  cuisineType: "", catering: "",
  fireAlarm: "", burglarAlarm: "", sprinkler: "",
  grillOven: "", hoodSuppression: "",
  parttimeEmployees: "", fulltimeEmployees: "",
  annualRevenue: "", annualPayroll: "",
  bppCoverage: "", lifeInsurance: "",
};

export default function RestaurantIntake() {
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState(defaultForm);
  const [status, setStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const set    = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setVal = (k) => (v) => setForm({ ...form, [k]: v });

  const steps = ["Owner & Business", "Building & Ops", "Safety", "Financials"];

  const handleSubmit = async () => {
    setStatus("sending");
    setStatusMsg("Saving your submission…");
    try {
      const { error } = await supabase.from("restaurant_submissions").insert({
        ...form, submitted_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);

      setStatusMsg("Sending notification email…");
      const res = await fetch("/api/send-restaurant-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });
      if (!res.ok) throw new Error(`Email API error ${res.status}`);

      setStatus("success");
      setStatusMsg(`Submission received! We'll follow up with ${form.businessName || "you"} shortly.`);
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
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ background: brand.black }}>
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
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "2px 0 0" }}>Insurance Agency</p>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 22px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 5, height: 32, borderRadius: 3, background: `linear-gradient(180deg, ${brand.orange}, ${brand.green})` }} />
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 19, color: "#fff", margin: 0 }}>
                  🍽️ Restaurant — Insurance Quote Form
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
          background: "#fff", borderRadius: 20, padding: "32px 36px 36px",
          boxShadow: "0 4px 24px rgba(26,26,26,0.07)", border: `1px solid ${brand.borderLight}`,
        }}>
          <StepIndicator current={step} steps={steps} />

          <div key={step} style={{ animation: "slideUp 0.3s ease-out" }}>

            {/* ── STEP 0: Owner & Business ── */}
            {step === 0 && (
              <div>
                <SectionHeader icon="👤" title="Owner Information" />
                <Grid cols={2}>
                  <Input label="Owner's Name"        value={form.ownerName}    onChange={set("ownerName")} />
                  <Input label="Date of Birth"        type="date" value={form.dob} onChange={set("dob")} />
                  <Input label="Home Address of Owner" value={form.ownerAddress} onChange={set("ownerAddress")} span={2} placeholder="Street, City, State, ZIP" />
                  <Input label="Phone Number"         required type="tel"   value={form.phone}      onChange={set("phone")} />
                  <Input label="Email Address"        required type="email" value={form.email}      onChange={set("email")} />
                </Grid>
                <Divider />
                <SectionHeader icon="🍽️" title="Business Information" />
                <Grid cols={2}>
                  <Input label="Business Name &amp; DBA" required value={form.businessName}    onChange={set("businessName")} span={2} />
                  <Input label="Business Address"     required value={form.businessAddress} onChange={set("businessAddress")} span={2} />
                  <Input label="EIN (Employer ID #)"  required value={form.ein}              onChange={set("ein")} placeholder="XX-XXXXXXX" />
                </Grid>
                <Divider />
                <SectionHeader icon="🚚" title="Food Truck / Vehicle (if applicable)" subtitle="Leave blank if not applicable" />
                <Grid cols={2}>
                  <Input label="Food Truck or Vehicle VIN"       value={form.vinNumber}      onChange={set("vinNumber")} />
                  <Input label="Driver's License # of Driver"    value={form.driversLicense} onChange={set("driversLicense")} />
                </Grid>
              </div>
            )}

            {/* ── STEP 1: Building & Operations ── */}
            {step === 1 && (
              <div>
                <SectionHeader icon="🏗️" title="Building Details" />
                <Grid cols={2}>
                  <Input label="Building Construction Year" required value={form.buildingYear}  onChange={set("buildingYear")} placeholder="e.g. 2005" />
                  <Input label="Building Sq. Ft."           required value={form.squareFootage} onChange={set("squareFootage")} placeholder="e.g. 2800" />
                  <Input label="Number of Tables (Dine-In)" required value={form.numTables}     onChange={set("numTables")} placeholder="e.g. 20" />
                </Grid>
                <Divider />
                <SectionHeader icon="🍜" title="Restaurant Type" />
                <Grid cols={2}>
                  <Input label="Type of Cuisine Served" required value={form.cuisineType} onChange={set("cuisineType")} placeholder="e.g. Mexican, Italian, American..." span={2} />
                </Grid>
                <div style={{ height: 14 }} />
                <RadioGroup
                  label="Do you offer catering services?"
                  value={form.catering} onChange={setVal("catering")}
                  options={["Yes", "No"]}
                />
              </div>
            )}

            {/* ── STEP 2: Safety Systems ── */}
            {step === 2 && (
              <div>
                <SectionHeader icon="🚨" title="Safety & Fire Systems" subtitle="Select the option that applies to your location" />
                <Grid cols={1}>
                  <RadioGroup label="Fire Alarm"    required value={form.fireAlarm}   onChange={setVal("fireAlarm")}   options={["Central System", "Local System", "None"]} />
                  <div style={{ height: 4 }} />
                  <RadioGroup label="Burglar Alarm" required value={form.burglarAlarm} onChange={setVal("burglarAlarm")} options={["Central System", "Local System", "None"]} />
                  <div style={{ height: 4 }} />
                  <RadioGroup label="Sprinkler System" required value={form.sprinkler} onChange={setVal("sprinkler")} options={["Yes", "No", "Partial"]} />
                </Grid>
                <Divider />
                <SectionHeader icon="🍳" title="Cooking Equipment" />
                <Grid cols={1}>
                  <RadioGroup label="Grill / Oven on premises?" required value={form.grillOven} onChange={setVal("grillOven")} options={["Yes", "No"]} />
                  <div style={{ height: 4 }} />
                  <RadioGroup
                    label="Fire suppression system &amp; hood cleaning contract in place?"
                    required value={form.hoodSuppression} onChange={setVal("hoodSuppression")}
                    options={["Yes", "No"]}
                  />
                </Grid>
              </div>
            )}

            {/* ── STEP 3: Financials + Review ── */}
            {step === 3 && (
              <div>
                <SectionHeader icon="👥" title="Employees & Revenue" />
                <Grid cols={2}>
                  <Input label="Full-Time Employees"  required value={form.fulltimeEmployees}  onChange={set("fulltimeEmployees")} />
                  <Input label="Part-Time Employees"  required value={form.parttimeEmployees}  onChange={set("parttimeEmployees")} />
                  <Input label="Annual Revenue ($)"   required value={form.annualRevenue}       onChange={set("annualRevenue")} />
                  <Input label="Annual Payroll ($)"   required value={form.annualPayroll}       onChange={set("annualPayroll")} />
                </Grid>
                <Divider />
                <SectionHeader icon="🛡️" title="Coverage Requested" />
                <Grid cols={2}>
                  <Input label="Business Asset / PP Coverage Amount ($)" value={form.bppCoverage}   onChange={set("bppCoverage")} placeholder="Enter 0 if not needed" span={2} />
                  <Input label="Life Insurance Coverage (Collateral Assignment)" value={form.lifeInsurance} onChange={set("lifeInsurance")} placeholder="Enter amount or leave blank" span={2} />
                </Grid>
                <Divider />

                {/* Review */}
                <SectionHeader icon="📋" title="Review Your Submission" subtitle="Confirm everything looks correct before submitting" />
                {[
                  { title: "👤 Owner & Business", rows: [
                    ["Owner Name",       form.ownerName],
                    ["Date of Birth",    form.dob],
                    ["Home Address",     form.ownerAddress],
                    ["Phone",            form.phone],
                    ["Email",            form.email],
                    ["Business Name",    form.businessName],
                    ["Business Address", form.businessAddress],
                    ["EIN",              form.ein],
                    form.vinNumber      ? ["VIN",             form.vinNumber]      : null,
                    form.driversLicense ? ["Driver License",  form.driversLicense] : null,
                  ].filter(Boolean)},
                  { title: "🏗️ Building & Operations", rows: [
                    ["Construction Year", form.buildingYear],
                    ["Square Footage",    form.squareFootage],
                    ["Dine-In Tables",    form.numTables],
                    ["Cuisine Type",      form.cuisineType],
                    ["Catering",          form.catering],
                  ]},
                  { title: "🚨 Safety Systems", rows: [
                    ["Fire Alarm",       form.fireAlarm],
                    ["Burglar Alarm",    form.burglarAlarm],
                    ["Sprinkler",        form.sprinkler],
                    ["Grill / Oven",     form.grillOven],
                    ["Hood Suppression", form.hoodSuppression],
                  ]},
                  { title: "💰 Financials & Coverage", rows: [
                    ["FT Employees",    form.fulltimeEmployees],
                    ["PT Employees",    form.parttimeEmployees],
                    ["Annual Revenue",  `$${form.annualRevenue}`],
                    ["Annual Payroll",  `$${form.annualPayroll}`],
                    form.bppCoverage    ? ["BPP Coverage",     `$${form.bppCoverage}`]    : null,
                    form.lifeInsurance  ? ["Life Insurance",   form.lifeInsurance]         : null,
                  ].filter(Boolean)},
                ].map(block => (
                  <div key={block.title} style={{ background: brand.bgWarm, borderRadius: 12, padding: "16px 20px", marginBottom: 14, border: `1px solid ${brand.borderLight}` }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 15, color: brand.black, marginBottom: 10 }}>{block.title}</div>
                    {block.rows.map(([l, v]) => <ReviewRow key={l} label={l} value={v} />)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: step === 0 ? "flex-end" : "space-between", marginTop: 28 }}>
            {step > 0 && (
              <button onClick={() => { setStep(step - 1); setStatus(null); }} style={{
                padding: "12px 28px", border: `1.5px solid ${brand.border}`,
                borderRadius: 10, background: "transparent", cursor: "pointer",
                fontSize: 15, fontWeight: 600, color: brand.textMuted,
                fontFamily: "'DM Sans', sans-serif",
              }}>← Back</button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} style={{
                padding: "12px 32px", border: "none", borderRadius: 10, cursor: "pointer",
                background: `linear-gradient(135deg, ${brand.orange}, ${brand.green})`,
                color: "#fff", fontSize: 15, fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: `0 4px 14px rgba(255,106,9,0.25)`,
              }}>Continue →</button>
            ) : (
              <button onClick={handleSubmit} disabled={status === "sending" || status === "success"} style={{
                padding: "12px 36px", border: "none", borderRadius: 10,
                cursor: status === "sending" ? "not-allowed" : "pointer",
                background: status === "success"
                  ? `linear-gradient(135deg, ${brand.green}, #1a6b2a)`
                  : `linear-gradient(135deg, ${brand.orange}, ${brand.green})`,
                color: "#fff", fontSize: 15, fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                opacity: status === "sending" ? 0.7 : 1, transition: "all 0.3s",
              }}>
                {status === "sending" ? "Submitting…" : status === "success" ? "✓ Submitted!" : "Submit Quote Request →"}
              </button>
            )}
          </div>

          {step === 3 && <StatusBanner status={status} message={statusMsg} />}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, paddingBottom: 16 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: brand.black, margin: "0 0 3px" }}>Trinity Solutions Insurance Agency</p>
          <p style={{ fontSize: 12, color: brand.textLight, margin: 0 }}>5348 Twin Hickory Rd, Glen Allen VA 23059 &nbsp;|&nbsp; (804) 944-6226</p>
        </div>
      </div>
    </div>
  );
}
