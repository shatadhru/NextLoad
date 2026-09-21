"use client"

import React, { useState, useEffect } from "react"
import { SiteConfig } from "@/config/site"
import { CldImage } from "next-cloudinary"
import { isCloudinarySrc, extractCloudinarySecureUrl } from "@/components/ui/SafeCldImage"


export function AdminLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoDarkUrl, setLogoDarkUrl] = useState<string | null>(null)
  const [siteName, setSiteName] = useState(SiteConfig.site.name)
  const [logoText, setLogoText] = useState(SiteConfig.site.logoText)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return

        if (data.siteName) setSiteName(data.siteName)
        if (data.logoText) setLogoText(data.logoText)

        // Properly extract Cloudinary secure_url from API response
        const light = extractCloudinarySecureUrl(data.logo) || extractCloudinarySecureUrl(data.logoUrl)
        const dark = extractCloudinarySecureUrl(data.logoDark) || extractCloudinarySecureUrl(data.logoDarkUrl)

        if (light) setLogoUrl(light)
        if (dark) setLogoDarkUrl(dark)
      })
      .catch((err) => console.warn("Failed to fetch site settings in AdminLogo:", err))
  }, [])

  const lightSrc = logoUrl || logoDarkUrl || ""
  const darkSrc = logoDarkUrl || logoUrl || ""
  const isLightValid = isCloudinarySrc(lightSrc)
  const isDarkValid = isCloudinarySrc(darkSrc)
  const hasLogo = (isLightValid || isDarkValid) && !imageError

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {hasLogo ? (
        <>
          {/* Light Mode Logo */}
          {isLightValid && (
            <CldImage
              width="280"
              height="56"
              src={lightSrc}
              alt={siteName}
              className="pt-admin-logo-light"
              style={{ height: "28px", maxWidth: "140px", objectFit: "contain" }}
              onError={() => setImageError(true)}
            />
          )}
          {/* Dark Mode Logo */}
          {isDarkValid && (
            <CldImage
              width="280"
              height="56"
              src={darkSrc}
              alt={siteName}
              className="pt-admin-logo-dark"
              style={{ height: "28px", maxWidth: "140px", objectFit: "contain" }}
              onError={() => setImageError(true)}
            />
          )}
          <style>{`
            html[data-theme='dark'] .pt-admin-logo-light { display: none !important; }
            html[data-theme='dark'] .pt-admin-logo-dark { display: block !important; }
            html:not([data-theme='dark']) .pt-admin-logo-light { display: block !important; }
            html:not([data-theme='dark']) .pt-admin-logo-dark { display: none !important; }
          `}</style>
        </>
      ) : (
        /* Default Normal NextLoad Logo */
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #0d9488, #0284c7)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "13px",
            letterSpacing: "0.5px",
            boxShadow: "0 2px 6px rgba(13, 148, 136, 0.3)",
          }}
        >
          {logoText || "NL"}
        </div>
      )}

      <span
        style={{
          fontWeight: 700,
          fontSize: "16px",
          letterSpacing: "-0.02em",
          color: "currentColor",
        }}
      >
        {siteName}
      </span>
    </div>
  )
}
