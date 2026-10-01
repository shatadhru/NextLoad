import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { cache } from "@/lib/cache"

const CACHE_KEY = "banners:active"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const previewId = searchParams.get("id")

    // If a specific banner ID is requested for previewing, bypass cache
    if (previewId) {
      const payload = await getPayload({ config })
      try {
        const previewDoc = await payload.findByID({
          collection: "banners",
          id: previewId,
        })
        if (previewDoc) {
          return NextResponse.json({
            success: true,
            banner: previewDoc,
            isPreview: true,
          })
        }
      } catch (e) {
        console.warn(`Could not find banner by ID ${previewId}:`, e)
      }
    }

    // Check hybrid cache (Redis / In-Memory)
    const cachedBanner = await cache.get<any>(CACHE_KEY)
    if (cachedBanner !== null) {
      return NextResponse.json(
        {
          success: true,
          banner: cachedBanner?.id ? cachedBanner : null,
        },
        {
          headers: {
            "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
          },
        }
      )
    }

    // Otherwise, fetch active banner from database
    const payload = await getPayload({ config })
    const now = new Date()
    const result = await payload.find({
      collection: "banners",
      where: {
        isActive: {
          equals: true,
        },
      },
      sort: "-priority -updatedAt",
      limit: 5,
    })

    // Filter by optional scheduling dates
    const validBanner = result.docs.find((doc: any) => {
      if (doc.startDate && new Date(doc.startDate) > now) return false
      if (doc.endDate && new Date(doc.endDate) < now) return false
      return true
    })

    // Cache result in Redis / In-Memory for 5 minutes (300 seconds)
    await cache.set(CACHE_KEY, validBanner || { _empty: true }, 300)

    return NextResponse.json(
      {
        success: true,
        banner: validBanner || null,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  } catch (error: any) {
    console.error("GET /api/banners/active error:", error)
    return NextResponse.json(
      {
        success: false,
        banner: null,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    )
  }
}
