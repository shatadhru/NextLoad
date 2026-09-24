import React from "react"
import { getPayload } from "payload"
import config from "@payload-config"
import { NoticeBanner, BannerData } from "./NoticeBanner"
import { BannerClientPreviewHandler } from "./BannerClientPreviewHandler"

export async function NoticeBannerSlot() {
  let activeBanner: BannerData | null = null

  try {
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

    const found = result.docs.find((doc: any) => {
      if (doc.startDate && new Date(doc.startDate) > now) return false
      if (doc.endDate && new Date(doc.endDate) < now) return false
      return true
    })

    if (found) {
      activeBanner = {
        id: String(found.id),
        title: found.title,
        content: found.content,
        badge: found.badge,
        icon: found.icon,
        isActive: found.isActive,
        backgroundType: found.backgroundType,
        presetTheme: found.presetTheme,
        customColor: found.customColor,
        customGradient: found.customGradient,
        textColor: found.textColor,
        customTextColor: found.customTextColor,
        isDismissible: found.isDismissible,
        dismissExpiryDays: found.dismissExpiryDays,
        isSticky: found.isSticky,
        link: found.link,
        updatedAt: found.updatedAt,
      }
    }
  } catch (error) {
    // Fail silently during build or when database is warming up
    console.warn("NoticeBannerSlot could not query banners collection:", error)
  }

  return (
    <BannerClientPreviewHandler initialBanner={activeBanner}>
      <NoticeBanner banner={activeBanner} />
    </BannerClientPreviewHandler>
  )
}

export default NoticeBannerSlot
