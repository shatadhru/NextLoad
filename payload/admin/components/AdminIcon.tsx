"use client"

import React, { useState, useEffect } from "react"
import { SiteConfig } from "@/config/site"
import { CldImage } from "next-cloudinary"
import { isCloudinarySrc, extractCloudinarySecureUrl } from "@/components/ui/SafeCldImage"


export function AdminIcon() {
  const [iconUrl, setIconUrl] = useState<string | null>(null)
  const [logoText, setLogoText] = useState(SiteConfig.site.logoText)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return
        if (data.logoText) setLogoText(data.logoText)

        const icon =
          extractCloudinarySecureUrl(data.favicon) ||
          extractCloudinarySecureUrl(data.faviconUrl) ||
          extractCloudinarySecureUrl(data.logoDark) ||
          extractCloudinarySecureUrl(data.logoDarkUrl) ||
          extractCloudinarySecureUrl(data.logo) ||
          extractCloudinarySecureUrl(data.logoUrl)

        if (icon) setIconUrl(icon)
      })
      .catch((err) => console.warn("Failed to fetch site settings in AdminIcon:", err))
  }, [])

  if (iconUrl && isCloudinarySrc(iconUrl) && !hasError) {
    return (
      <CldImage
        width="48"
        height="48"
        src={iconUrl}
        alt="Icon"
        style={{ width: "24px", height: "24px", objectFit: "contain" }}
        onError={() => setHasError(true)}
      />
    )
  }

  return (
    <div
      style={{
        width: "24px",
        height: "24px",
        borderRadius: "6px",
        backgroundColor: "#0d9488",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: "10px",
      }}
    >
      {logoText || "NL"}
    </div>
  )
}

export default AdminIcon
