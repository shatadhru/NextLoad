import type { EmailAdapter } from "payload"
import { transporter } from "./index"
import { SiteConfig } from "@/config/site"

/**
 * Custom Payload CMS 3.0 Email Adapter using Nodemailer
 */
export const payloadEmailAdapter = (): EmailAdapter => ({ payload }) => {
  const defaultFromName = SiteConfig.site.name || "NextLoad"
  const defaultFromAddress =
    process.env.SMTP_FROM ||
    `"${defaultFromName}" <noreply@${process.env.SMTP_DOMAIN || "example.com"}>`

  return {
    name: "nodemailer",
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      // In development, log email sending attempt
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        payload.logger.info({
          msg: `[PAYLOAD EMAIL DEV] To: ${message.to}, Subject: ${message.subject}`,
        })
      }

      try {
        const from = message.from || defaultFromAddress
        const result = await transporter.sendMail({
          from,
          to: message.to,
          subject: message.subject,
          text: message.text,
          html: message.html,
          replyTo: message.replyTo,
          attachments: message.attachments,
        })

        payload.logger.info({
          msg: `Email successfully sent to ${message.to} (Message ID: ${result.messageId})`,
        })

        return result
      } catch (error: any) {
        payload.logger.error({
          err: error,
          msg: `Failed to send email to ${message.to}: ${error?.message || error}`,
        })
        throw error
      }
    },
  }
}
