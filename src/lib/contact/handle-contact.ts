export interface ContactMail {
  from: string;
  to: string;
  replyTo: { name: string; address: string };
  subject: string;
  text: string;
}

export type SendMail = (mail: ContactMail) => Promise<void>;

export interface ContactDeps {
  from: string;
  to: string;
  sendMail: SendMail;
}

const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 } as const;
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function redirect(location: string) {
  return new Response(null, { status: 303, headers: { Location: location } });
}

function field(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

// Line breaks in a header value could add extra mail headers.
function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function handleContact(request: Request, deps: ContactDeps): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirect("/kontakt/?fehler=eingabe");
  }

  if (field(form, "bot-field").trim() !== "") {
    return redirect("/kontakt/danke/");
  }

  const name = oneLine(field(form, "name"));
  const email = oneLine(field(form, "email"));
  const subject = oneLine(field(form, "subject"));
  const message = field(form, "message").trim();

  const valid =
    name !== "" &&
    message !== "" &&
    EMAIL_SHAPE.test(email) &&
    name.length <= LIMITS.name &&
    email.length <= LIMITS.email &&
    subject.length <= LIMITS.subject &&
    message.length <= LIMITS.message;

  if (!valid) {
    return redirect("/kontakt/?fehler=eingabe");
  }

  try {
    await deps.sendMail({
      from: deps.from,
      to: deps.to,
      replyTo: { name, address: email },
      subject: subject ? `Kontaktformular: ${subject}` : "Kontaktformular",
      text: `Name: ${name}\nE-Mail: ${email}\n\n${message}\n`,
    });
  } catch {
    return redirect("/kontakt/?fehler=senden");
  }

  return redirect("/kontakt/danke/");
}
