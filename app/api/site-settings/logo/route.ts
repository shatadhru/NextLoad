import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { SiteConfig } from "@/config/site"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = searchParams.get("theme") || "light"

    let settings: any = null
    try {
      const payload = await getPayload({ config })
      settings = await payload.findGlobal({
        slug: "site-settings",
        depth: 1,
      })
    } catch (e) {
      // payload not initialized or DB down, fallback to SVG
    }

    const resolveSecureUrl = (media: any): string | null => {
      if (!media) return null
      if (typeof media === "string") {
        if (media.startsWith("/api/media/file")) return null
        return media
      }
      return (
        media.cloudinary?.secure_url ||
        (typeof media.thumbnailURL === "string" && media.thumbnailURL.includes("res.cloudinary.com") ? media.thumbnailURL : null) ||
        (typeof media.url === "string" && media.url.includes("res.cloudinary.com") ? media.url : null) ||
        null
      )
    }

    let targetLogoUrl: string | null = null
    if (theme === "dark" && settings?.logoDark) {
      targetLogoUrl = resolveSecureUrl(settings.logoDark)
    }
    if (!targetLogoUrl && settings?.logo) {
      targetLogoUrl = resolveSecureUrl(settings.logo)
    }

    if (targetLogoUrl) {
      return NextResponse.redirect(new URL(targetLogoUrl, request.url), {
        status: 307,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      })
    }

    function escapeXml(unsafe: string): string {
      return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case "<": return "&lt;"
          case ">": return "&gt;"
          case "&": return "&amp;"
          case "'": return "&apos;"
          case '"': return "&quot;"
          default: return c
        }
      })
    }

    // Default SVG fallback
    const siteName = escapeXml(settings?.siteName || SiteConfig.site.name)
    const logoText = escapeXml(settings?.logoText || SiteConfig.site.logoText)
    const textColor = theme === "dark" ? "#f8fafc" : "#0f172a"

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48" width="200" height="48" fill="none">
  <defs>
    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0d9488" flood-opacity="0.25" />
    </filter>
  </defs>
  <rect x="2" y="4" width="40" height="40" rx="10" fill="url(#logo-grad)" filter="url(#shadow)" />
  <text x="22" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">${logoText}</text>
  <text x="52" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="${textColor}" letter-spacing="-0.5">${siteName}</text>
</svg>`.trim()

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("GET /api/site-settings/logo error:", error)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width="160" height="40"><rect width="36" height="36" rx="8" fill="#0d9488"/><text x="18" y="24" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">NL</text><text x="46" y="26" font-size="18" font-weight="bold" fill="#0d9488">NextLoad</text></svg>`
    return new NextResponse(svg, {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    })
  }
}
