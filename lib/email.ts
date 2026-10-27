import { Resend } from "resend";

type Email = { to: string; subject: string; html: string; text: string };

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM; // e.g. "Struct <hello@yourdomain.com>"
const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail({ to, subject, html, text }: Email) {
  // Not configured: production fails loudly, development prints the email instead
  if (!resend || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email is not configured: set RESEND_API_KEY and EMAIL_FROM");
    }
    console.log(`\n[email not sent, dev mode]\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`);
    return;
  }

  const { error } = await resend.emails.send({ from, to, subject, html, text });
  if (error) throw new Error(`Resend failed: ${error.message}`);
}