import { NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const globalData = await payload.findGlobal({
      slug: "cookie-consent",
    })

    return NextResponse.json({
      success: true,
      config: globalData,
    })
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
