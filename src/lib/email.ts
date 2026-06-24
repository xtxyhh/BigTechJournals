import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.FROM_EMAIL ?? "BigTechJournals <noreply@bigtechjournals.com>";
const adminEmail = process.env.ADMIN_EMAIL ?? "tanishqgupta891@gmail.com";

export async function sendSubmissionConfirmation(to: string, name: string, title: string) {
  if (!resend) {
    console.warn("Resend not configured — skipping email");
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to,
    subject: "We received your story — BigTechJournals",
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for submitting your story <strong>"${title}"</strong> to BigTechJournals.</p>
      <p>Our editorial team will review it and get back to you within 5–7 business days.</p>
      <p>Keep building. Keep sharing.</p>
      <p>— The BigTechJournals Team</p>
    `,
  });
}

export async function sendAdminSubmissionAlert(
  submitterName: string,
  title: string,
  submissionId: string,
) {
  if (!resend) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New story submission: ${title}`,
    html: `
      <h2>New Story Submission</h2>
      <p><strong>From:</strong> ${submitterName}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><a href="${appUrl}/admin/submissions">Review in Admin Dashboard →</a></p>
      <p>Submission ID: ${submissionId}</p>
    `,
  });
}
