import nodemailer, { type Transporter } from "nodemailer";

import { handleContact, type ContactMail } from "../../src/lib/contact/handle-contact";

// The repo has no Node typings; the function only reads environment variables.
declare const process: { env: Record<string, string | undefined> };

export const config = { path: "/api/contact" };

function setting(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export default async function contact(request: Request) {
  // Read inside the request so a missing setting becomes the visitor-facing send error, not a crash.
  let user = "";
  let to = "";
  let transport: Transporter | undefined;

  try {
    user = setting("SMTP_USER");
    to = setting("CONTACT_TO");
    transport = nodemailer.createTransport({
      host: setting("SMTP_HOST"),
      port: Number(setting("SMTP_PORT")),
      secure: process.env.SMTP_SECURE !== "false",
      auth: { user, pass: setting("SMTP_PASS") },
    });
  } catch (error) {
    console.error("contact: mail settings incomplete:", error instanceof Error ? error.message : error);
  }

  return handleContact(request, {
    from: user,
    to,
    sendMail: async (mail: ContactMail) => {
      if (!transport) throw new Error("mail settings incomplete");
      try {
        await transport.sendMail(mail);
      } catch (error) {
        console.error("contact: sending failed:", error instanceof Error ? error.message : error);
        throw error;
      }
    },
  });
}
