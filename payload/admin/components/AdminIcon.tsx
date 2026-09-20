"use client"

import React, { useState, useEffect } from "react"
import { SiteConfig } from "@/config/site"

export function AdminIcon() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoText, setLogoText] = useState(SiteConfig.site.logoText)

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.logoUrl) setLogoUrl(data.logoUrl)
          if (data.logoText) setLogoText(data.logoText)
        }
      })
      .catch(() => {})
  }, [])

  if (logoUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={logoUrl}
        alt="Icon"
        style={{ width: "24px", height: "24px", objectFit: "contain" }}
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
