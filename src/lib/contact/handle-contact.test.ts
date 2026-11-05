import { describe, expect, it } from "bun:test";

import { handleContact, type ContactMail } from "./handle-contact";

function post(fields: Record<string, string>) {
  return new Request("https://example.test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields),
  });
}

const valid = { name: "Max", email: "max@example.de", subject: "Frage", message: "Hallo Verein" };

async function run(request: Request, sendMail?: (mail: ContactMail) => Promise<void>) {
  const sent: ContactMail[] = [];
  const deps = {
    from: "info@club.test",
    to: "inbox@club.test",
    sendMail:
      sendMail ??
      (async (mail: ContactMail) => {
        sent.push(mail);
      }),
  };
  const response = await handleContact(request, deps);
  return { response, sent };
}

function location(response: Response) {
  return response.headers.get("Location");
}

function hasLineBreak(value: string) {
  return /[\r\n]/.test(value);
}

describe("handleContact", () => {
  it("sends one mail and redirects to the thank-you page", async () => {
    const { response, sent } = await run(post(valid));

    expect(response.status).toBe(303);
    expect(location(response)).toBe("/kontakt/danke/");
    expect(sent).toHaveLength(1);
    expect(sent[0]!.from).toBe("info@club.test");
    expect(sent[0]!.to).toBe("inbox@club.test");
    expect(sent[0]!.replyTo).toEqual({ name: "Max", address: "max@example.de" });
    expect(sent[0]!.subject).toBe("Kontaktformular: Frage");
    expect(sent[0]!.text.includes("Hallo Verein")).toBe(true);
  });

  it("works without a subject", async () => {
    const { sent } = await run(post({ ...valid, subject: "" }));
    expect(sent[0]!.subject).toBe("Kontaktformular");
  });

  for (const key of ["name", "email", "message"]) {
    it(`rejects a missing ${key}`, async () => {
      const { response, sent } = await run(post({ ...valid, [key]: "" }));
      expect(location(response)).toBe("/kontakt/?fehler=eingabe");
      expect(sent).toHaveLength(0);
    });
  }

  it("rejects an implausible email", async () => {
    const { response, sent } = await run(post({ ...valid, email: "kein-at-zeichen" }));
    expect(location(response)).toBe("/kontakt/?fehler=eingabe");
    expect(sent).toHaveLength(0);
  });

  for (const [key, length] of [
    ["name", 101],
    ["subject", 151],
    ["message", 5001],
  ] as const) {
    it(`rejects an over-long ${key}`, async () => {
      const { response, sent } = await run(post({ ...valid, [key]: "x".repeat(length) }));
      expect(location(response)).toBe("/kontakt/?fehler=eingabe");
      expect(sent).toHaveLength(0);
    });
  }

  it("removes line breaks from name and subject", async () => {
    const { sent } = await run(post({ ...valid, name: "Max\r\nBcc: evil@x.de", subject: "Hi\nBcc: evil@x.de" }));
    expect(hasLineBreak(sent[0]!.subject)).toBe(false);
    expect(hasLineBreak(sent[0]!.replyTo.name)).toBe(false);
  });

  it("rejects an email with line breaks", async () => {
    const { response, sent } = await run(post({ ...valid, email: "max@example.de\r\nBcc: evil@x.de" }));
    expect(location(response)).toBe("/kontakt/?fehler=eingabe");
    expect(sent).toHaveLength(0);
  });

  it("sends nothing but looks successful when the honeypot is filled", async () => {
    const { response, sent } = await run(post({ ...valid, "bot-field": "spam" }));
    expect(location(response)).toBe("/kontakt/danke/");
    expect(sent).toHaveLength(0);
  });

  it("redirects with an error when sending fails", async () => {
    const { response } = await run(post(valid), async () => {
      throw new Error("smtp down");
    });
    expect(response.status).toBe(303);
    expect(location(response)).toBe("/kontakt/?fehler=senden");
  });

  it("answers anything but POST with 405", async () => {
    const { response, sent } = await run(new Request("https://example.test/api/contact"));
    expect(response.status).toBe(405);
    expect(sent).toHaveLength(0);
  });
});
