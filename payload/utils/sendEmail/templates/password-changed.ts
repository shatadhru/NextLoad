import { renderBaseTemplate } from "./base"

interface PasswordChangedTemplateProps {
  name?: string | null
  date?: string
}

export function getPasswordChangedEmailTemplate({
  name,
  date = new Date().toUTCString(),
}: PasswordChangedTemplateProps) {
  const greeting = name ? `Hello ${name},` : "Hello,"

  const content = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Password Changed Successfully</h2>
    <p style="margin: 0 0 16px 0;">${greeting}</p>
    <p style="margin: 0 0 24px 0;">This is a confirmation that the password for your account was recently updated on <strong>${date}</strong>.</p>

    <div class="alert-box" style="border-left-color: #ef4444; background-color: #fef2f2; color: #991b1b;">
      <strong>Did not request this change?</strong><br>
      If you did not make this change, your account may have been compromised. Please reset your password immediately or contact our support team.
    </div>

    <p style="margin: 24px 0 0 0; font-size: 14px; color: #64748b;">
      If you did change your password, no further action is required.
    </p>
  `

  const html = renderBaseTemplate({
    title: "Password Changed",
    previewText: "Your account password was recently changed.",
    content,
  })

  const text = `${greeting}

This is a confirmation that the password for your account was recently updated on ${date}.

If you did not make this change, please reset your password immediately or contact support.`

  return {
    subject: "Security Alert: Password Changed",
    html,
    text,
  }
}
