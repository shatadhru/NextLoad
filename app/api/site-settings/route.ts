import { NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { SiteConfig } from "@/config/site"

export async function GET() {
  try {
    const payload = await getPayload({ config })

    let settings: any = null
    try {
      settings = await payload.findGlobal({
        slug: "site-settings",
        depth: 1,
      })
    } catch (e) {
      console.warn("Could not query site-settings global, using default config:", e)
    }

    const siteName = settings?.siteName || SiteConfig.site.name
    const siteTitle = settings?.siteTitle || SiteConfig.site.title
    const siteDescription = settings?.siteDescription || SiteConfig.site.description
    const logoText = settings?.logoText || SiteConfig.site.logoText

    // Resolve uploaded logo URL if media object is present
    let logoUrl: string | null = null
    if (settings?.logo) {
      if (typeof settings.logo === "object" && settings.logo.url) {
        logoUrl = settings.logo.url
      } else if (typeof settings.logo === "string") {
        logoUrl = settings.logo
      }
    }

    let logoDarkUrl: string | null = null
    if (settings?.logoDark) {
      if (typeof settings.logoDark === "object" && settings.logoDark.url) {
        logoDarkUrl = settings.logoDark.url
      } else if (typeof settings.logoDark === "string") {
        logoDarkUrl = settings.logoDark
      }
    }

    return NextResponse.json({
      success: true,
      siteName,
      siteTitle,
      siteDescription,
      logoText,
      logoUrl,
      logoDarkUrl,
    })
  } catch (error: any) {
    console.error("GET /api/site-settings error:", error)
    return NextResponse.json({
      success: true,
      siteName: SiteConfig.site.name,
      siteTitle: SiteConfig.site.title,
      siteDescription: SiteConfig.site.description,
      logoText: SiteConfig.site.logoText,
      logoUrl: null,
      logoDarkUrl: null,
    })
  }
}
