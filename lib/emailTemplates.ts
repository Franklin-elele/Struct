// Struct email templates.
// Emails don't support Tailwind or CSS variables, so styles are inline and colours are plain hex.

export const EMAIL_COLORS = {
  cream: "#F1F3E0",
  sageLight: "#D2DCB6",
  sageMid: "#A1BC98",
  sageDark: "#778873",
  forest: "#2d3328",
  body: "#4f5c49",
  terracotta: "#C97B5A", // accent: decoration only
};
const C = EMAIL_COLORS;
const FONT = "Ubuntu, 'Segoe UI', Helvetica, Arial, sans-serif";

// Anything a user typed must be escaped before it goes into HTML
export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const appUrl = () => process.env.APP_URL ?? "http://localhost:3000";

type LayoutOptions = {
  preheader: string; // the preview line shown in the inbox
  heading: string; // plain text, escaped here
  bodyHtml: string; // trusted HTML: escape any user data before passing it in
  cta?: { label: string; url: string };
  footerNote: string; // plain text, escaped here
};

export function renderLayout({ preheader, heading, bodyHtml, cta, footerNote }: LayoutOptions) {
  // Button imitates the app's: forest fill, cream text, hard sage offset
  const button = cta
    ? `<tr><td style="padding:20px 28px 0;">
         <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
           <td bgcolor="${C.forest}" style="background:${C.forest};border-radius:12px;border-right:3px solid ${C.sageMid};border-bottom:3px solid ${C.sageMid};">
             <a href="${escapeHtml(cta.url)}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:15px;font-weight:700;color:${C.cream};text-decoration:none;">${escapeHtml(cta.label)}</a>
           </td>
         </tr></table>
       </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.cream}" style="background:${C.cream};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

        <tr><td align="center" style="padding:0 0 20px;font-family:${FONT};font-size:28px;font-weight:700;letter-spacing:-0.5px;color:${C.sageDark};">Struct.</td></tr>

        <tr><td>
          <!-- card: the right and bottom borders imitate the app's hard offset shadow -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background:#ffffff;border:1px solid ${C.sageLight};border-right:4px solid ${C.sageLight};border-bottom:4px solid ${C.sageLight};border-radius:16px;">
            <tr><td style="padding:32px 28px 0;font-family:${FONT};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                <td width="40" height="4" bgcolor="${C.terracotta}" style="background:${C.terracotta};border-radius:2px;font-size:0;line-height:0;">&nbsp;</td>
              </tr></table>
              <h1 style="margin:16px 0 0;font-size:24px;line-height:1.25;font-weight:700;letter-spacing:-0.3px;color:${C.forest};">${escapeHtml(heading)}</h1>
            </td></tr>
            <tr><td style="padding:14px 28px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.body};">${bodyHtml}</td></tr>
            ${button}
            <tr><td style="height:28px;font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>
        </td></tr>

        <tr><td align="center" style="padding:20px 8px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.body};">
          ${escapeHtml(footerNote)}<br />Struct &middot; Structure your life
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const step = (n: number, text: string) => `
<tr>
  <td width="28" valign="top" style="padding:0 12px 12px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="28" height="28" align="center" bgcolor="${C.sageLight}" style="background:${C.sageLight};border-radius:14px;font-family:${FONT};font-size:14px;font-weight:700;color:${C.forest};">${n}</td>
    </tr></table>
  </td>
  <td valign="top" style="padding:3px 0 12px;font-family:${FONT};font-size:15px;line-height:1.5;color:${C.body};">${text}</td>
</tr>`;

const callout = (text: string) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 0;">
  <tr><td bgcolor="${C.cream}" style="background:${C.cream};border-left:4px solid ${C.terracotta};border-radius:8px;padding:14px 16px;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.forest};">${text}</td></tr>
</table>`;

export function welcomeEmail(firstName: string) {
  // strip line breaks so a name can never mess with the subject line
  const first = firstName.replace(/[\r\n]+/g, " ").trim() || "there";
  const url = `${appUrl()}/dashboard/home`;

  const bodyHtml = `
    <p style="margin:0 0 16px;">Your account is ready. Struct turns one goal into 90 days of daily action. We give you the system, you show up.</p>
    <p style="margin:0 0 12px;font-weight:700;color:${C.forest};">Here's how it works</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${step(1, "Open your dashboard. Today's tasks are made from the habits you set up.")}
      ${step(2, "Tick them off as you go.")}
      ${step(3, "Come back tomorrow. Showing up is the whole system.")}
    </table>
    ${callout("Start small. One finished task today beats a perfect plan you never run.")}`;

  const html = renderLayout({
    preheader: "Your account is ready. Here's how to start your first 90 days.",
    heading: `Welcome to Struct, ${first}.`,
    bodyHtml,
    cta: { label: "Open my dashboard", url },
    footerNote: "You're getting this email because you created a Struct account.",
  });

  const text = [
    `Welcome to Struct, ${first}.`,
    "",
    "Your account is ready. Struct turns one goal into 90 days of daily action. We give you the system, you show up.",
    "",
    "Here's how it works:",
    "1. Open your dashboard. Today's tasks are made from the habits you set up.",
    "2. Tick them off as you go.",
    "3. Come back tomorrow. Showing up is the whole system.",
    "",
    `Open your dashboard: ${url}`,
    "",
    "You're getting this email because you created a Struct account.",
  ].join("\n");

  return { subject: `Welcome to Struct, ${first}`, html, text };
}