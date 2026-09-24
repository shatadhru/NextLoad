"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { computeBannerStyles } from "@/config/bannerPresets"
import {
  Megaphone,
  Bell,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react"

export interface BannerData {
  id: string
  title?: string | null
  content: string
  badge?: string | null
  icon?: string | null
  isActive?: boolean | null
  backgroundType?: string | null
  presetTheme?: string | null
  customColor?: string | null
  customGradient?: string | null
  textColor?: string | null
  customTextColor?: string | null
  isDismissible?: boolean | null
  dismissExpiryDays?: number | null
  isSticky?: boolean | null
  link?: {
    enableLink?: boolean | null
    label?: string | null
    url?: string | null
    newTab?: boolean | null
  } | null
  updatedAt?: string | null
}

function renderBannerIcon(icon?: string) {
  const iconClass = "size-4 shrink-0"
  switch (icon) {
    case "bell":
      return <Bell className={iconClass} />
    case "sparkles":
      return <Sparkles className={iconClass} />
    case "alert":
      return <AlertTriangle className={iconClass} />
    case "info":
      return <Info className={iconClass} />
    case "check":
      return <CheckCircle2 className={iconClass} />
    case "none":
      return null
    case "megaphone":
    default:
      return <Megaphone className={iconClass} />
  }
}

export function NoticeBanner({ banner }: { banner: BannerData | null | undefined }) {
  const [isDismissed, setIsDismissed] = useState<boolean>(true) // default true until hydrated
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    if (!banner || !banner.id) {
      setIsDismissed(true)
      return
    }

    if (banner.isDismissible === false) {
      setIsDismissed(false)
      return
    }

    // Check localStorage for dismissal record
    try {
      const storageKey = `nextload_banner_dismissed_${banner.id}`
      const raw = localStorage.getItem(storageKey)
      if (!raw) {
        setIsDismissed(false)
        return
      }

      const parsed = JSON.parse(raw)
      const dismissedAt = parsed.timestamp || 0
      const storedUpdatedAt = parsed.updatedAt

      // If the banner was edited/updated in Payload after dismissal, show it again!
      if (banner.updatedAt && storedUpdatedAt && new Date(banner.updatedAt) > new Date(storedUpdatedAt)) {
        localStorage.removeItem(storageKey)
        setIsDismissed(false)
        return
      }

      // Check expiry duration
      const expiryDays = typeof banner.dismissExpiryDays === "number" ? banner.dismissExpiryDays : 1
      if (expiryDays === 0) {
        // Session only: dismissal handled in memory, but clear from storage on reload
        setIsDismissed(false)
        return
      }

      const elapsedMs = Date.now() - dismissedAt
      const maxAgeMs = expiryDays * 24 * 60 * 60 * 1000

      if (elapsedMs > maxAgeMs) {
        localStorage.removeItem(storageKey)
        setIsDismissed(false)
      } else {
        setIsDismissed(true)
      }
    } catch {
      setIsDismissed(false)
    }
  }, [banner])

  if (!banner || !banner.content || isDismissed || !mounted) {
    return null
  }

  const styles = computeBannerStyles({
    backgroundType: banner.backgroundType,
    presetTheme: banner.presetTheme,
    customColor: banner.customColor,
    customGradient: banner.customGradient,
    textColor: banner.textColor,
    customTextColor: banner.customTextColor,
  })

  const handleDismiss = () => {
    setIsDismissed(true)
    if (banner.id) {
      try {
        const storageKey = `nextload_banner_dismissed_${banner.id}`
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            timestamp: Date.now(),
            updatedAt: banner.updatedAt || new Date().toISOString(),
          })
        )
      } catch {
        // Ignore localStorage quota errors
      }
    }
  }

  const isSticky = banner.isSticky !== false
  const hasLink = Boolean(banner.link?.enableLink && banner.link?.url && banner.link?.label)
  const isExternal = Boolean(banner.link?.url?.startsWith("http://") || banner.link?.url?.startsWith("https://"))

  return (
    <aside
      role="region"
      aria-label={banner.title || "Announcement Notice"}
      style={{
        background: styles.background,
        color: styles.textColor,
      }}
      className={`relative w-full ${isSticky ? "sticky top-0 z-50 shadow-md" : "relative z-30"} transition-all duration-300 ease-in-out border-b border-black/10 dark:border-white/10`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-2 flex items-center justify-between gap-2.5 sm:gap-4 text-xs sm:text-sm font-medium">
        {/* Main Content Area (Mobile Friendly & Flexible) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
          {/* Notice Icon */}
          <div className="shrink-0 flex items-center justify-center opacity-90">
            {renderBannerIcon(banner.icon || undefined)}
          </div>

          {/* Optional Badge */}
          {banner.badge && (
            <span
              style={{
                backgroundColor: styles.badgeBg,
                color: styles.badgeText,
              }}
              className="shrink-0 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs"
            >
              {banner.badge}
            </span>
          )}

          {/* Message Text */}
          <p className="flex-1 text-pretty leading-snug break-words">
            {banner.content}
          </p>

          {/* Optional Call-to-Action Link/Button */}
          {hasLink && (
            <div className="shrink-0 my-0.5 sm:my-0">
              {isExternal ? (
                <a
                  href={banner.link?.url || "#"}
                  target={banner.link?.newTab ? "_blank" : undefined}
                  rel={banner.link?.newTab ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 backdrop-blur-xs border border-white/30 transition-colors duration-150 shadow-xs active:scale-95"
                  style={{ color: styles.textColor }}
                >
                  <span>{banner.link?.label}</span>
                  <ExternalLink className="size-3 opacity-80" />
                </a>
              ) : (
                <Link
                  href={banner.link?.url || "/"}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 backdrop-blur-xs border border-white/30 transition-colors duration-150 shadow-xs active:scale-95"
                  style={{ color: styles.textColor }}
                >
                  <span>{banner.link?.label}</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Small Close Icon (X) */}
        {banner.isDismissible !== false && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss notice"
            title="Dismiss notice"
            className="shrink-0 size-7 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/15 active:scale-90 transition-all duration-150 cursor-pointer opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ color: styles.textColor }}
          >
            <X className="size-3.5 sm:size-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </aside>
  )
}

export default NoticeBanner
