import { NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { cache } from "@/lib/cache"

const CACHE_KEY = "cookie:consent"

export async function GET() {
  try {
    const cached = await cache.get<any>(CACHE_KEY)
    if (cached) {
      return NextResponse.json(
        {
          success: true,
          config: cached,
        },
        {
          headers: {
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      )
    }

    const payload = await getPayload({ config })
    const globalData = await payload.findGlobal({
      slug: "cookie-consent",
    })

    if (globalData) {
      await cache.set(CACHE_KEY, globalData, 3600)
    }

    return NextResponse.json(
      {
        success: true,
        config: globalData,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    )
  } catch (error: any) {
    console.warn("GET /api/cookie-consent warning:", error)
    return NextResponse.json({
      success: true,
      config: {
        isEnabled: true,
        title: "We value your privacy",
        description:
          "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.",
        position: "bottom-right",
        delaySeconds: 1,
        acceptAllText: "Accept All",
        declineText: "Reject Non-Essential",
        preferencesText: "Preferences",
      },
    })
  }
}
