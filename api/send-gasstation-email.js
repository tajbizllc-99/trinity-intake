import { Resend } from "resend";

const resend  = new Resend(process.env.RESEND_API_KEY);
const TO      = process.env.TO_EMAIL   ?? "tajbizllc@gmail.com";
const FROM    = process.env.FROM_EMAIL ?? "intake@trinitysolutionsva.com";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  try {
    const { form } = req.body;
    if (!form) return res.status(400).json({ error: "Missing form data" });

    const subject = `Trinity Solutions — Gas Station Quote: ${form.companyName || "Unknown"} (${form.city || ""}, ${form.state || ""})`;

    const { error } = await resend.emails.send({
      from:    `Trinity Solutions Intake <${FROM}>`,
      to:      [TO],
      subject,
      html:    buildEmail(form),
    });

    if (error) throw new Error(error.message);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("[send-gasstation-email]", err);
    return res.status(500).json({ error: String(err) });
  }
}

function row(label, value) {
  if (!value && value !== 0) return "";
  return `
    <tr>
      <td style="color:#6a6458;padding:5px 16px 5px 0;font-size:13.5px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="color:#1a1a1a;font-weight:600;font-size:13.5px;padding:5px 0;">${value || "—"}</td>
    </tr>`;
}

function section(title, rows) {
  return `
    <div style="background:#e07a1a;padding:8px 20px;margin:20px 0 0">
      <h2 style="font-family:Arial,sans-serif;font-size:13.5px;font-weight:700;color:#fff;margin:0">${title}</h2>
    </div>
    <div style="padding:14px 20px;background:#faf8f4">
      <table style="border-collapse:collapse;width:100%">${rows}</table>
    </div>`;
}

function buildEmail(f) {
  return `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background:#f0ede6;font-family:Arial,sans-serif">
<div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">

  <div style="background:#1a1a1a;padding:24px 28px">
    <h1 style="font-family:Georgia,serif;font-size:20px;color:#fff;margin:0 0 4px">Trinity Solutions Insurance Agency</h1>
    <p style="font-size:12.5px;color:rgba(255,255,255,0.45);margin:0">New Submission — Gas Station / Convenience Store Questionnaire</p>
  </div>
  <div style="height:4px;background:linear-gradient(90deg,#ff6a09 33%,#2e8c3a 33% 66%,#c8920a 66%)"></div>

  <div style="padding:16px 20px;background:#fff2e8;border-bottom:1px solid #ffe0c8">
    <span style="font-size:20px;font-weight:700;color:#ff6a09">⛽</span>
    <strong style="font-size:17px;color:#1a1a1a;margin-left:8px">${f.companyName || "Unknown Business"}</strong>
    ${f.dbaName ? `<span style="font-size:13px;color:#6a6458;margin-left:8px">DBA: ${f.dbaName}</span>` : ""}
    <div style="font-size:13px;color:#6a6458;margin-top:4px">${[f.address1, f.city, f.state, f.zip].filter(Boolean).join(", ")}</div>
  </div>

  ${section("🏢 BUSINESS INFORMATION",
    row("Company Name",   f.companyName) +
    row("DBA",           f.dbaName) +
    row("FEIN",          f.fein) +
    row("Year in Business", f.yearInBusiness) +
    row("Owner",         f.ownerName) +
    row("Phone",         f.phone) +
    row("Email",         f.email) +
    row("Policy Date",   f.policyDate)
  )}

  ${section("🏗️ BUILDING DETAILS",
    row("Year Built",         f.yearBuilt) +
    row("Construction Type",  f.constructionType) +
    row("Square Footage",     f.squareFootage) +
    row("Stories",            f.numStories) +
    row("Roof Type",          f.roofType) +
    row("Roof Updated",       f.roofImproved) +
    row("HVAC Updated",       f.hvacImproved) +
    row("Plumbing Updated",   f.plumbingImproved) +
    row("Electrical Updated", f.electricalImproved)
  )}

  ${section("🚨 SAFETY & OPERATIONS",
    row("Fire Alarm",         f.fireAlarm) +
    row("Burglar Alarm",      f.burglarAlarm) +
    row("Sprinkler System",   f.sprinkler) +
    row("Grill / Fryer",      f.grillFryer) +
    row("Hood Suppression",   f.hoodSuppression) +
    row("Propane",            f.propane)
  )}

  ${section("💰 COVERAGE & FINANCIALS",
    row("Building Coverage",  `$${f.buildingCoverage}`) +
    row("Canopy Coverage",    `$${f.canopyCoverage}`) +
    row("BPP Value",          `$${f.bppValue}`) +
    row("Gross Sales",        `$${f.grossSales}`) +
    row("Grocery Sales",      `$${f.grocerySales}`) +
    row("Liquor/Beer/Wine",   `$${f.liquorSales}`) +
    row("Gasoline (gal/yr)",  f.gasolineGallons) +
    row("# of Pumps",         f.numPumps) +
    row("FT Employees",       f.fulltimeEmployees) +
    row("PT Employees",       f.parttimeEmployees) +
    row("Yearly Payroll",     `$${f.yearlyPayroll}`)
  )}

  ${f.specialNotes ? section("📝 SPECIAL NOTES", row("Notes", f.specialNotes)) : ""}

  <div style="padding:16px 20px;background:#f5f3ee;border-top:1px solid #e8e4dc;text-align:center">
    <p style="margin:0;font-size:12.5px;color:#6a6458">Trinity Solutions · 5348 Twin Hickory Rd, Glen Allen VA 23059 · (804) 944-6226</p>
  </div>
</div>
</body></html>`;
}
