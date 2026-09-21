import { SiteConfig } from "@/config/site"

interface BaseTemplateOptions {
  title: string
  previewText?: string
  content: string
}

export function renderBaseTemplate({
  title,
  previewText,
  content,
}: BaseTemplateOptions): string {
  const siteName = SiteConfig.site.name || "NextLoad"
  const currentYear = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  ${previewText ? `<meta name="description" content="${previewText}">` : ""}
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8fafc;
      padding-top: 40px;
      padding-bottom: 40px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 580px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .top-bar {
      height: 6px;
      background: linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
    }
    .header {
      padding: 32px 40px 24px 40px;
      text-align: center;
      border-bottom: 1px solid #f1f5f9;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .body {
      padding: 36px 40px 32px 40px;
      line-height: 1.6;
      font-size: 15px;
      color: #334155;
    }
    .btn {
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
      transition: background-color 0.2s;
    }
    .code-box {
      background-color: #f1f5f9;
      border: 1px dashed #cbd5e1;
      border-radius: 12px;
      padding: 18px 24px;
      text-align: center;
      margin: 24px 0;
    }
    .code-text {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 6px;
      color: #0f172a;
    }
    .alert-box {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 0 8px 8px 0;
      padding: 14px 18px;
      margin: 24px 0;
      font-size: 13.5px;
      color: #1e40af;
      line-height: 1.5;
    }
    .footer {
      padding: 24px 40px;
      background-color: #f8fafc;
      border-top: 1px solid #f1f5f9;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }
    .footer a {
      color: #475569;
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .body, .header, .footer {
        padding-left: 24px !important;
        padding-right: 24px !important;
      }
      .code-text {
        font-size: 24px !important;
        letter-spacing: 4px !important;
      }
    }
  </style>
</head>
<body>
  ${
    previewText
      ? `<div style="display:none;font-size:1px;color:#f8fafc;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
      ${previewText}
    </div>`
      : ""
  }
  <table role="presentation" class="wrapper">
    <tr>
      <td>
        <table role="presentation" class="main">
          <tr>
            <td class="top-bar"></td>
          </tr>
          <tr>
            <td class="header">
              <h1 class="brand-title">${siteName}</h1>
            </td>
          </tr>
          <tr>
            <td class="body">
              ${content}
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p style="margin: 0 0 8px 0;">This is an automated message sent from <strong>${siteName}</strong>.</p>
              <p style="margin: 0;">&copy; ${currentYear} ${siteName}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
