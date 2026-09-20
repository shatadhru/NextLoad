"use client"

import React, { useState, useEffect } from "react"
import { SiteConfig } from "@/config/site"

export function AdminLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoDarkUrl, setLogoDarkUrl] = useState<string | null>(null)
  const [siteName, setSiteName] = useState(SiteConfig.site.name)
  const [logoText, setLogoText] = useState(SiteConfig.site.logoText)

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.logoUrl) setLogoUrl(data.logoUrl)
          if (data.logoDarkUrl) setLogoDarkUrl(data.logoDarkUrl)
          if (data.siteName) setSiteName(data.siteName)
          if (data.logoText) setLogoText(data.logoText)
        }
      })
      .catch(() => {})
  }, [])

  const hasLogo = Boolean(logoUrl || logoDarkUrl)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {hasLogo ? (
        <>
          {/* Light Mode Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl || logoDarkUrl || ""}
            alt={siteName}
            className="pt-admin-logo-light"
            style={{ height: "28px", maxWidth: "140px", objectFit: "contain" }}
          />
          {/* Dark Mode Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDarkUrl || logoUrl || ""}
            alt={siteName}
            className="pt-admin-logo-dark"
            style={{ height: "28px", maxWidth: "140px", objectFit: "contain" }}
          />
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
