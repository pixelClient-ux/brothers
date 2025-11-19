// utils/newMemberTemplate.ts

interface NewMemberTemplateData {
  fullName: string;
  phone: string;
  gender: "male" | "female";
  memberCode: string;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  amount?: number; // optional (free trials)
  method?: string;
}

export function newMemberTemplate(data: NewMemberTemplateData): string {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const amountDisplay =
    data.amount !== undefined
      ? `${data.amount.toLocaleString()} ETB`
      : "Free / Trial";

  const methodDisplay = data.method || "Cash";

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>New Member • Gym Fitness</title>
    <style>
      /* Theme Colors (kept from your design) */
      :root {
        --primary: oklch(70.755% 0.19742 46.444);
        --background: #ffffff;
        --foreground: #0f172a;
        --card: #ffffff;
        --muted: #f8fafc;
        --border: #e2e8f0;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --primary: oklch(0.78 0.18 50);
          --background: #0f172a;
          --foreground: #f1f5f9;
          --card: #1e293b;
          --muted: #1e293b;
          --border: #334155;
        }
      }

      body {
        font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: var(--background);
        color: var(--foreground);
        margin: 0;
        padding: 0;
      }

      .email-wrapper {
        max-width: 680px;
        margin: 28px auto;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border);
        box-shadow: 0 8px 30px rgba(2,6,23,0.08);
        background: var(--card);
      }

      .header {
        background: var(--primary);
        color: #ffffff;
        text-align: center;
        padding: 28px 20px;
      }

      .header h1 {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .content {
        padding: 22px 26px;
      }

      .intro {
        margin-bottom: 14px;
        font-size: 1rem;
      }

      .member-id {
        display: inline-block;
        margin-top: 12px;
        padding: 10px 14px;
        background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
        border-radius: 10px;
        border: 1px solid var(--border);
        font-weight: 700;
        color: var(--primary);
      }

      .section-title {
        font-weight: 700;
        font-size: 1.05rem;
        margin: 18px 0 8px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.97rem;
      }

      td {
        padding: 10px 6px;
        vertical-align: top;
      }

      tr:not(:last-child) td {
        border-bottom: 1px solid var(--border);
      }

      .label {
        width: 170px;
        font-weight: 700;
        color: var(--primary);
      }

      .value {
        color: var(--foreground);
      }

      .highlight {
        display: inline-block;
        padding: 8px 10px;
        background: #ecfdf5;
        border: 1px solid #86efac;
        color: #065f46;
        border-radius: 8px;
        font-weight: 700;
      }

      .note {
        background: var(--muted);
        padding: 16px;
        border-radius: 10px;
        margin-top: 18px;
        color: #64748b;
        font-size: 0.95rem;
      }

      .footer {
        background: var(--muted);
        text-align: center;
        padding: 16px;
        font-size: 0.85rem;
        color: #64748b;
      }

      @media (max-width: 520px) {
        .label { display: block; width: 100%; font-size: 0.95rem; }
        td { display: block; padding: 8px 0; }
      }
    </style>
  </head>

  <body>
    <div class="email-wrapper" role="article" aria-roledescription="email">
      <div class="header">
        <h1>🏋️‍♀️ New Member Registered</h1>
      </div>

      <div class="content">
        <p class="intro">Hello Admin,</p>
        <p class="intro">A new member has been successfully registered in <strong>Gym Fitness</strong>.</p>

        <div>
          <span class="member-id">Member ID: ${data.memberCode}</span>
        </div>

        <div class="section-title">👤 Member Details</div>
        <table role="table" aria-label="Member details">
          <tr>
            <td class="label">Name</td>
            <td class="value">${data.fullName}</td>
          </tr>
          <tr>
            <td class="label">Phone</td>
            <td class="value">${data.phone}</td>
          </tr>
          <tr>
            <td class="label">Gender</td>
            <td class="value">${data.gender === "male" ? "Male" : "Female"}</td>
          </tr>
          <tr>
            <td class="label">Start Date</td>
            <td class="value">${formatDate(data.startDate)}</td>
          </tr>
          <tr>
            <td class="label">End Date</td>
            <td class="value">${formatDate(data.endDate)}</td>
          </tr>
          <tr>
            <td class="label">Duration</td>
            <td class="value">${data.durationMonths} month${
    data.durationMonths > 1 ? "s" : ""
  }</td>
          </tr>
        </table>

        <div class="section-title">💳 Payment Info</div>
        <table role="table" aria-label="Payment details">
          <tr>
            <td class="label">Amount</td>
            <td class="value"><span class="highlight">${amountDisplay}</span></td>
          </tr>
          <tr>
            <td class="label">Method</td>
            <td class="value">${methodDisplay}</td>
          </tr>
          <tr>
            <td class="label">Recorded</td>
            <td class="value">${formatDate(new Date())}</td>
          </tr>
        </table>

        <div class="note">
          Membership Card (PDF) is attached. Please print and hand it to the member at reception.
        </div>

        <p style="margin-top: 18px;">Keep building the strongest gym in town — good luck! 💪</p>
      </div>

      <div class="footer">
        Gym Fitness Admin System • © ${new Date().getFullYear()}
      </div>
    </div>
  </body>
</html>
`;
}
