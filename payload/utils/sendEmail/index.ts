import nodemailer from "nodemailer"
import { SiteConfig } from "@/config/site"
import { getResetPasswordEmailTemplate } from "./templates/reset-password"
import { getVerifyEmailTemplate } from "./templates/verify-email"
import { getPasswordChangedEmailTemplate } from "./templates/password-changed"
import { getBroadcastEmailTemplate } from "./templates/broadcast"

// Create nodemailer SMTP transporter using environment variables
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface SendEmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
  from?: string
}

/**
 * Generic email sending function
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: SendEmailOptions) {
  const defaultFrom =
    process.env.SMTP_FROM ||
    `"${SiteConfig.site.name || "NextLoad"}" <noreply@example.com>`

  // In development, if SMTP credentials are not configured, log to console for debugging
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("----------------------------------------")
    console.log("📨 [DEV EMAIL SIMULATION]")
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    if (text) console.log(`Text: ${text}`)
    console.log("----------------------------------------")
  }

  try {
    const info = await transporter.sendMail({
      from: from || defaultFrom,
      to,
      subject,
      text,
      html,
    })

    console.log(`Email sent to ${to}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error("Failed to send email:", error)
    return { success: false, error: error?.message || "Failed to send email" }
  }
}

/**
 * Helper: Send Password Reset Email with premium template
 */
export async function sendResetPasswordEmail({
  to,
  name,
  resetUrl,
  token,
  expiresIn = "1 hour",
}: {
  to: string
  name?: string | null
  resetUrl: string
  token?: string
  expiresIn?: string
}) {
  const { subject, html, text } = getResetPasswordEmailTemplate({
    name,
    resetUrl,
    token,
    expiresIn,
  })

  return sendEmail({
    to,
    subject,
    html,
    text,
  })
}

/**
 * Helper: Send Email Verification with premium template
 */
export async function sendVerificationEmail({
  to,
  name,
  verifyUrl,
  token,
  expiresIn = "24 hours",
}: {
  to: string
  name?: string | null
  verifyUrl: string
  token?: string
  expiresIn?: string
}) {
  const { subject, html, text } = getVerifyEmailTemplate({
    name,
    verifyUrl,
    token,
    expiresIn,
  })

  return sendEmail({
    to,
    subject,
    html,
    text,
  })
}

/**
 * Helper: Send Password Changed security notification
 */
export async function sendPasswordChangedEmail({
  to,
  name,
}: {
  to: string
  name?: string | null
}) {
  const { subject, html, text } = getPasswordChangedEmailTemplate({
    name,
  })

  return sendEmail({
    to,
    subject,
    html,
    text,
  })
}

/**
 * Helper: Send Broadcast Notification Email
 */
export async function sendBroadcastEmail({
  to,
  recipientName,
  title,
  message,
  priority = "info",
  actionUrl,
  actionText,
  imageUrl,
}: {
  to: string
  recipientName?: string | null
  title: string
  message: string
  priority?: "info" | "announcement" | "security" | "urgent"
  actionUrl?: string
  actionText?: string
  imageUrl?: string
}) {
  const { subject, html, text } = getBroadcastEmailTemplate({
    title,
    message,
    priority,
    actionUrl,
    actionText,
    recipientName,
    imageUrl,
  })

  return sendEmail({
    to,
    subject,
    html,
    text,
  })
}

export * from "./templates/base"
export * from "./templates/reset-password"
export * from "./templates/verify-email"
export * from "./templates/password-changed"
export * from "./templates/broadcast"
export * from "./payloadAdapter"
