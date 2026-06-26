import { resend } from "./mailer";
import type { ReactElement } from "react";

type Attachment = {
  filename: string;
  content: Buffer | string;
  contentType?: string;
};

export async function sendMail<T>({
  to,
  subject,
  template,
  props,
  attachments,
}: {
  to: string | string[];
  subject: string;
  template: (props: T) => ReactElement;
  props: T;
  attachments?: Attachment[];
}) {
  const reactElement = template(props);

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    react: reactElement,

    attachments: attachments?.map((file) => ({
      filename: file.filename,
      content: file.content,
      content_type: file.contentType,
    })),
  });

  if (error) {
    console.error("Resend API error:", JSON.stringify(error, null, 2));
    throw new Error(`Email sending failed: ${JSON.stringify(error)}`);
  }

  return data;
}
