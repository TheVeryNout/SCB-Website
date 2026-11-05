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
const EMAIL_SHAPE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;
// A form with these field limits stays far below this; bigger posts are not from the form.
const MAX_BODY_BYTES = 20_000;

type Outcome = "danke" | "eingabe" | "senden";

// A plain form post gets a redirect (errors land on a note on /kontakt/ through the URL fragment, which
// needs no JavaScript). The page's script asks for JSON instead so the typed text stays in the form.
function reply(request: Request, outcome: Outcome) {
  if (request.headers.get("Accept")?.includes("application/json")) {
    if (outcome === "danke") return Response.json({ ok: true });
    return Response.json({ error: outcome }, { status: outcome === "eingabe" ? 400 : 502 });
  }
  const location = outcome === "danke" ? "/kontakt/danke/" : `/kontakt/#fehler-${outcome}`;
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

  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) {
    return reply(request, "eingabe");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(request, "eingabe");
  }

  if (field(form, "bot-field").trim() !== "") {
    return reply(request, "danke");
  }

  const name = oneLine(field(form, "name"));
  const email = oneLine(field(form, "email"));
  const subject = oneLine(field(form, "subject"));
  const message = field(form, "message").replace(/\r\n/g, "\n").trim();

  const valid =
    name !== "" &&
    message !== "" &&
    EMAIL_SHAPE.test(email) &&
    name.length <= LIMITS.name &&
    email.length <= LIMITS.email &&
    subject.length <= LIMITS.subject &&
    message.length <= LIMITS.message;

  if (!valid) {
    return reply(request, "eingabe");
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
    return reply(request, "senden");
  }

  return reply(request, "danke");
}
