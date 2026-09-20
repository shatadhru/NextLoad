import { renderBaseTemplate } from "./base"
import { SiteConfig } from "@/config/site"

export interface BroadcastEmailOptions {
  title: string
  message: string
  priority?: "info" | "announcement" | "security" | "urgent"
  actionUrl?: string
  actionText?: string
  recipientName?: string | null
}

export function getBroadcastEmailTemplate({
  title,
  message,
  priority = "info",
  actionUrl,
  actionText,
  recipientName,
}: BroadcastEmailOptions) {
  const siteName = SiteConfig.site.name || "NextLoad"
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000"

  // Priority color scheme
  const priorityConfig = {
    info: {
      color: "#2563eb",
      bg: "#eff6ff",
      label: "Information",
      border: "#3b82f6",
    },
    announcement: {
      color: "#0d9488",
      bg: "#f0fdfa",
      label: "Platform Announcement",
      border: "#14b8a6",
    },
    security: {
      color: "#d97706",
      bg: "#fffbeb",
      label: "Security Alert",
      border: "#f59e0b",
    },
    urgent: {
      color: "#dc2626",
      bg: "#fef2f2",
      label: "Urgent Notification",
      border: "#ef4444",
    },
  }[priority]

  // Resolve action URL
  const resolvedUrl = actionUrl
    ? actionUrl.startsWith("http")
      ? actionUrl
      : `${baseUrl}${actionUrl.startsWith("/") ? "" : "/"}${actionUrl}`
    : null

  // Format message lines with paragraphs
  const messageHtml = message
    .split("\n\n")
    .map((paragraph) => `<p style="margin: 0 0 16px 0; line-height: 1.6;">${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("")

  const content = `
    <div style="margin-bottom: 20px;">
      <span style="
        display: inline-block;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: ${priorityConfig.color};
        background-color: ${priorityConfig.bg};
        border: 1px solid ${priorityConfig.border};
      ">
        ${priorityConfig.label}
      </span>
    </div>

    <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; line-height: 1.4;">
      ${title}
    </h2>

    ${recipientName ? `<p style="margin: 0 0 16px 0; font-weight: 500; color: #475569;">Hello ${recipientName},</p>` : ""}

    <div style="color: #334155; font-size: 15px;">
      ${messageHtml}
    </div>

    ${
      resolvedUrl
        ? `
      <div style="margin: 32px 0 24px 0; text-align: center;">
        <a href="${resolvedUrl}" class="btn" style="
          display: inline-block;
          padding: 14px 32px;
          background-color: #0f172a;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
        ">
          ${actionText || "View Details"} &rarr;
        </a>
      </div>
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
        Button not working? Copy and paste this link: <a href="${resolvedUrl}" style="color: #64748b; word-break: break-all;">${resolvedUrl}</a>
      </p>
    `
        : ""
    }
  `

  const subject = `[${siteName}] ${title}`
  const html = renderBaseTemplate({
    title,
    previewText: message.slice(0, 120),
    content,
  })

  const text = `${title}
${priorityConfig.label}

${recipientName ? `Hello ${recipientName},\n\n` : ""}${message}

${resolvedUrl ? `Action Link: ${resolvedUrl}\n\n` : ""}
Sent from ${siteName}`

  return { subject, html, text }
}
