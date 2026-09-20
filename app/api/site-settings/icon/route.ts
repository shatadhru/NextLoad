import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { SiteConfig } from "@/config/site"

export async function GET(request: NextRequest) {
  try {
    let settings: any = null
    try {
      const payload = await getPayload({ config })
      settings = await payload.findGlobal({
        slug: "site-settings",
        depth: 1,
      })
    } catch (e) {
      // payload not initialized or DB down
    }

    if (settings?.favicon) {
      const faviconUrl = typeof settings.favicon === "object" ? settings.favicon.url : settings.favicon
      if (faviconUrl) {
        return NextResponse.redirect(new URL(faviconUrl, request.url), {
          status: 307,
        })
      }
    }

    const logoText = settings?.logoText || SiteConfig.site.logoText

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" fill="none">
  <defs>
    <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <rect width="40" height="40" rx="10" fill="url(#icon-grad)" />
  <text x="20" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">${logoText}</text>
</svg>`.trim()

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("GET /api/site-settings/icon error:", error)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="6" fill="#0d9488"/><text x="16" y="21" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">NL</text></svg>`
    return new NextResponse(svg, {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    })
  }
}
