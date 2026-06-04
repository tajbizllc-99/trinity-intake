import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO     = process.env.TO_EMAIL   ?? "tajbizllc@gmail.com";
const FROM   = process.env.FROM_EMAIL ?? "intake@trinitysolutionsva.com";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  try {
    const { form } = req.body;
    if (!form) return res.status(400).json({ error: "Missing form data" });

    const subject = `Trinity Solutions — Restaurant Quote: ${form.businessName || "Unknown"} (${form.cuisineType || ""})`;

    const { error } = await resend.emails.send({
      from: `Trinity Solutions Intake <${FROM}>`,
      to:   [TO],
      subject,
      html: buildEmail(form),
    });

    if (error) throw new Error(error.message);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("[send-restaurant-email]", err);
    return res.status(500).json({ error: String(err) });
  }
}

function row(label, value) {
  if (!value) return "";
  return `
    <tr>
      <td style="color:#6a6458;padding:5px 16px 5px 0;font-size:13.5px;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="color:#1a1a1a;font-weight:600;font-size:13.5px;padding:5px 0">${value}</td>
    </tr>`;
}

function section(title, rows) {
  return `
    <div style="background:#ff6a09;padding:8px 20px;margin:20px 0 0">
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
    <p style="font-size:12.5px;color:rgba(255,255,255,0.45);margin:0">New Submission — Restaurant Insurance Quote</p>
  </div>
  <div style="height:4px;background:linear-gradient(90deg,#ff6a09 33%,#2e8c3a 33% 66%,#c8920a 66%)"></div>

  <div style="padding:16px 20px;background:#fff2e8;border-bottom:1px solid #ffe0c8">
    <span style="font-size:20px">🍽️</span>
    <strong style="font-size:17px;color:#1a1a1a;margin-left:8px">${f.businessName || "Unknown Restaurant"}</strong>
    ${f.cuisineType ? `<span style="font-size:13px;color:#6a6458;margin-left:8px">${f.cuisineType}</span>` : ""}
    <div style="font-size:13px;color:#6a6458;margin-top:4px">${f.businessAddress || ""}</div>
  </div>

  ${section("👤 OWNER & BUSINESS",
    row("Owner Name",       f.ownerName) +
    row("Date of Birth",    f.dob) +
    row("Home Address",     f.ownerAddress) +
    row("Phone",            f.phone) +
    row("Email",            f.email) +
    row("Business Name",    f.businessName) +
    row("Business Address", f.businessAddress) +
    row("EIN",              f.ein) +
    row("VIN",              f.vinNumber) +
    row("Driver License",   f.driversLicense)
  )}

  ${section("🏗️ BUILDING & OPERATIONS",
    row("Construction Year", f.buildingYear) +
    row("Square Footage",    f.squareFootage) +
    row("Dine-In Tables",    f.numTables) +
    row("Cuisine Type",      f.cuisineType) +
    row("Catering Services", f.catering)
  )}

  ${section("🚨 SAFETY SYSTEMS",
    row("Fire Alarm",        f.fireAlarm) +
    row("Burglar Alarm",     f.burglarAlarm) +
    row("Sprinkler System",  f.sprinkler) +
    row("Grill / Oven",      f.grillOven) +
    row("Hood Suppression",  f.hoodSuppression)
  )}

  ${section("💰 FINANCIALS & COVERAGE",
    row("FT Employees",    f.fulltimeEmployees) +
    row("PT Employees",    f.parttimeEmployees) +
    row("Annual Revenue",  `$${f.annualRevenue}`) +
    row("Annual Payroll",  `$${f.annualPayroll}`) +
    row("BPP Coverage",    f.bppCoverage ? `$${f.bppCoverage}` : "") +
    row("Life Insurance",  f.lifeInsurance)
  )}

  <div style="padding:16px 20px;background:#f5f3ee;border-top:1px solid #e8e4dc;text-align:center">
    <p style="margin:0;font-size:12.5px;color:#6a6458">Trinity Solutions · 5348 Twin Hickory Rd, Glen Allen VA 23059 · (804) 944-6226</p>
  </div>
</div>
</body></html>`;
}
