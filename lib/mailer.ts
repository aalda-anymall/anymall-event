import sgMail, { type MailDataRequired } from "@sendgrid/mail";

type SendApplicationReceivedEmailInput = {
  to: string;
};

export async function sendApplicationReceivedEmail({
  to
}: SendApplicationReceivedEmailInput): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY is missing.");
  }

  if (!from) {
    throw new Error("EMAIL_FROM is missing.");
  }

  sgMail.setApiKey(apiKey);

  const fromMatch = from.match(/^(.+?)\s*<([^>]+)>$/);
  const fromField: MailDataRequired["from"] = fromMatch
    ? {
        name: fromMatch[1].trim(),
        email: fromMatch[2].trim()
      }
    : from;

  const message: MailDataRequired = {
    from: fromField,
    to,
    subject: "Application Received",
    text: "Your application has been received successfully.",
    html: `
      <p>Thanks for applying.</p>
      <p>Your application has been received successfully.</p>
    `
  };

  try {
    await sgMail.send(message);
  } catch (error) {
    const maybeResponse = error as { response?: { body?: unknown } };
    if (maybeResponse.response?.body) {
      console.error("SendGrid response body:", maybeResponse.response.body);
    }
    throw error;
  }
}
