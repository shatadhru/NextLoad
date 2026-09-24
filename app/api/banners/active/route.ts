import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const previewId = searchParams.get("id")

    // If a specific banner ID is requested for previewing
    if (previewId) {
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

    // Otherwise, fetch the active banner with highest priority
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

    return NextResponse.json({
      success: true,
      banner: validBanner || null,
    })
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
