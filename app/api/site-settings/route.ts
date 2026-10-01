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

    // Helper to safely extract Cloudinary secure_url from media object or string
    const getCloudinarySecureUrl = (media: any): string | null => {
      if (!media) return null
      if (typeof media === "string") {
        if (media.startsWith("/api/media/file")) return null
        return media
      }
      return (
        media.cloudinary?.secure_url ||
        (typeof media.thumbnailURL === "string" && media.thumbnailURL.includes("res.cloudinary.com") ? media.thumbnailURL : null) ||
        (typeof media.url === "string" && media.url.includes("res.cloudinary.com") ? media.url : null) ||
        media.cloudinary?.public_id ||
        null
      )
    }

    const logoUrl = getCloudinarySecureUrl(settings?.logo)
    const logoDarkUrl = getCloudinarySecureUrl(settings?.logoDark)
    const faviconUrl = getCloudinarySecureUrl(settings?.favicon)

    const copyright = settings?.copyright || `© {year} ${siteName}. All rights reserved.`
    const footerTagline = settings?.footerTagline || siteDescription
    const paymentMethods = settings?.paymentMethods || null
    const socialLinks = settings?.socialLinks || null
    const legal = settings?.legal || null

    const themeConfig = settings?.themeConfig?.themeEnabled ? settings.themeConfig : null
    const security = settings?.security || null

    return NextResponse.json(
      {
        success: true,
        globalType: "site-settings",
        siteName,
        siteTitle,
        siteDescription,
        copyright,
        footerTagline,
        paymentMethods,
        socialLinks,
        legal,
        logoText,
        logoUrl,
        logoDarkUrl,
        faviconUrl,
        logo: settings?.logo || null,
        logoDark: settings?.logoDark || null,
        favicon: settings?.favicon || null,
        themeConfig,
        security,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=18000, s-maxage=18000, stale-while-revalidate=36000",
        },
      }
    )
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
      socialLinks: null,
    })
  }
}
