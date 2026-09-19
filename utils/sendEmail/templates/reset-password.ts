import { renderBaseTemplate } from "./base"

interface ResetPasswordTemplateProps {
  name?: string | null
  resetUrl: string
  token?: string
  expiresIn?: string
}

export function getResetPasswordEmailTemplate({
  name,
  resetUrl,
  token,
  expiresIn = "1 hour",
}: ResetPasswordTemplateProps) {
  const greeting = name ? `Hello ${name},` : "Hello,"

  const content = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Reset Your Password</h2>
    <p style="margin: 0 0 16px 0;">${greeting}</p>
    <p style="margin: 0 0 24px 0;">We received a request to reset the password for your account. Click the button below to proceed with setting a new password:</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="btn" target="_blank" rel="noopener noreferrer">Reset Password</a>
    </div>

    ${
      token
        ? `
    <p style="margin: 24px 0 8px 0; font-size: 14px; text-align: center; color: #64748b;">Or enter this reset code on the verification page:</p>
    <div class="code-box">
      <div class="code-text">${token}</div>
    </div>
    `
        : ""
    }

    <div class="alert-box">
      <strong>Important:</strong> This link and code will expire in <strong>${expiresIn}</strong>. If you did not request a password reset, you can safely ignore this email — your account remains secure.
    </div>

    <p style="margin: 24px 0 0 0; font-size: 13px; color: #94a3b8; word-break: break-all;">
      If the button above doesn't work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #6366f1; text-decoration: underline;">${resetUrl}</a>
    </p>
  `

  const html = renderBaseTemplate({
    title: "Reset Your Password",
    previewText: "Password reset request for your account.",
    content,
  })

  const text = `${greeting}

We received a request to reset the password for your account.

Reset link: ${resetUrl}
${token ? `Reset code: ${token}\n` : ""}
This link will expire in ${expiresIn}.

If you did not request this password reset, please ignore this email.`

  return {
    subject: "Reset your password",
    html,
    text,
  }
}
