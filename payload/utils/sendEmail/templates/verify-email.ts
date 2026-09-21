import { renderBaseTemplate } from "./base"

interface VerifyEmailTemplateProps {
  name?: string | null
  verifyUrl: string
  token?: string
  expiresIn?: string
}

export function getVerifyEmailTemplate({
  name,
  verifyUrl,
  token,
  expiresIn = "24 hours",
}: VerifyEmailTemplateProps) {
  const greeting = name ? `Welcome, ${name}!` : "Welcome!"

  const content = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Verify Your Email Address</h2>
    <p style="margin: 0 0 16px 0;">${greeting}</p>
    <p style="margin: 0 0 24px 0;">Thank you for registering. To ensure the security of your account and complete your setup, please verify your email address by clicking the button below:</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" class="btn" target="_blank" rel="noopener noreferrer">Verify Email Address</a>
    </div>

    ${
      token
        ? `
    <p style="margin: 24px 0 8px 0; font-size: 14px; text-align: center; color: #64748b;">Or enter this verification code:</p>
    <div class="code-box">
      <div class="code-text">${token}</div>
    </div>
    `
        : ""
    }

    <div class="alert-box">
      <strong>Note:</strong> This verification link will expire in <strong>${expiresIn}</strong>.
    </div>

    <p style="margin: 24px 0 0 0; font-size: 13px; color: #94a3b8; word-break: break-all;">
      If the button above doesn't work, copy and paste this link into your browser:<br>
      <a href="${verifyUrl}" style="color: #6366f1; text-decoration: underline;">${verifyUrl}</a>
    </p>
  `

  const html = renderBaseTemplate({
    title: "Verify Your Email Address",
    previewText: "Please verify your email address to complete registration.",
    content,
  })

  const text = `${greeting}

Thank you for registering. Please verify your email address using the link below:

Verification link: ${verifyUrl}
${token ? `Verification code: ${token}\n` : ""}
This link will expire in ${expiresIn}.`

  return {
    subject: "Verify your email address",
    html,
    text,
  }
}
