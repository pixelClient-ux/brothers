export function renewMemberTemplate({
  fullName,
  phone,
  gender,
  oldEndDate,
  newEndDate,
  addedMonths,
  totalPaid,
  method,
}: {
  fullName: string;
  phone: string;
  gender: string;
  oldEndDate: Date;
  newEndDate: Date;
  addedMonths: number;
  totalPaid: number;
  method: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Membership Renewal</title>
    <style>
      :root {
        --primary: oklch(70.755% 0.19742 46.444);
        --background: oklch(1 0 0);
        --foreground: oklch(0.141 0.005 285.823);
        --card: oklch(1 0 0);
        --muted: oklch(0.967 0.001 286.375);
        --border: oklch(0.92 0.004 286.32);
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --primary: oklch(0.78 0.18 50);
          --background: oklch(0.141 0.005 285.823);
          --foreground: oklch(0.985 0 0);
          --card: oklch(0.21 0.006 285.885);
          --muted: oklch(0.274 0.006 286.033);
          --border: oklch(1 0 0 / 10%);
        }
      }

      body {
        font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: var(--background);
        color: var(--foreground);
        margin: 0;
        padding: 0;
      }

      .email-wrapper {
        max-width: 600px;
        margin: 24px auto;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        background: var(--card);
      }

      .header {
        background: var(--primary);
        color: var(--foreground);
        text-align: center;
        padding: 24px;
      }

      .header h1 {
        margin: 0;
        font-size: 1.5rem;
        color: white;
      }

      .content {
        padding: 24px;
      }

      .section-title {
        font-weight: 600;
        font-size: 1.1rem;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }

      td {
        padding: 8px 4px;
        vertical-align: top;
      }

      tr:not(:last-child) td {
        border-bottom: 1px solid var(--border);
      }

      .footer {
        background: var(--muted);
        text-align: center;
        padding: 16px;
        font-size: 0.85rem;
        color: var(--foreground);
      }

      .highlight {
        color: var(--primary);
        font-weight: 600;
      }
    </style>
  </head>

  <body>
    <div class="email-wrapper">
      <div class="header">
        <h1>🔁 Membership Renewed</h1>
      </div>

      <div class="content">
        <p>Hello Admin,</p>
        <p>A member has successfully renewed their membership at <strong>Gym Fitness</strong>.</p>

        <div class="section-title">👤 Member Information</div>
        <table>
          <tr><td><strong>Name:</strong></td><td>${fullName}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
          <tr><td><strong>Gender:</strong></td><td>${gender}</td></tr>
        </table>

        <div class="section-title">📅 Renewal Details</div>
        <table>
          <tr><td><strong>Previous End Date:</strong></td><td>${oldEndDate.toDateString()}</td></tr>
          <tr><td><strong>New End Date:</strong></td><td>${newEndDate.toDateString()}</td></tr>
          <tr><td><strong>Added Duration:</strong></td><td>${addedMonths} month(s)</td></tr>
        </table>

        <div class="section-title">💳 Payment Info</div>
        <table>
          <tr><td><strong>Amount Paid:</strong></td><td class="highlight">${totalPaid} ETB</td></tr>
          <tr><td><strong>Payment Method:</strong></td><td>${method}</td></tr>
          <tr><td><strong>Payment Date:</strong></td><td>${new Date().toDateString()}</td></tr>
        </table>

        <p style="margin-top:1.5rem;">Keep your member database updated and ensure continuous engagement! 💪</p>
      </div>

      <div class="footer">
        <p>Gym Fitness Admin System © ${new Date().getFullYear()}</p>
      </div>
    </div>
  </body>
</html>
`;
}
