"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { customAdminViews, CustomAdminViewConfig } from "@/config/adminCustomComponents"
import {
  BarChart3,
  Mail,
  HardDrive,
  Activity,
  Shield,
  Settings,
  Database,
  Users,
  Sparkles,
  Layers,
  Code2,
  FileText,
  Bell,
  Sliders,
  Globe,
  Image,
  Folder,
  Cookie,
  LucideIcon,
} from "lucide-react"

// Icon registry for dynamic resolution
const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Mail,
  HardDrive,
  Activity,
  Shield,
  Settings,
  Database,
  Users,
  Sparkles,
  Layers,
  Code2,
  FileText,
  Bell,
  Sliders,
  Globe,
  Image,
  Folder,
  Cookie,
}

function resolveIcon(iconName?: string): LucideIcon {
  if (!iconName) return Layers
  return ICON_MAP[iconName] || Layers
}

export function CustomAdminNavLinks() {
  const pathname = usePathname()

  // Real-time synchronization of payload-theme logo with active Cloudinary URLs
  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return
        const light = data.logoUrl || data.logo?.cloudinary?.secure_url
        const dark = data.logoDarkUrl || data.logoDark?.cloudinary?.secure_url || light
        if (light) {
          const lightImgs = document.querySelectorAll(".pt-nav__logo-img--light")
          lightImgs.forEach((img) => {
            const el = img as HTMLImageElement
            if (el.src !== light) el.src = light
          })
        }
        if (dark) {
          const darkImgs = document.querySelectorAll(".pt-nav__logo-img--dark")
          darkImgs.forEach((img) => {
            const el = img as HTMLImageElement
            if (el.src !== dark) el.src = dark
          })
        }
      })
      .catch(() => {})
  }, [pathname])

  if (!customAdminViews || customAdminViews.length === 0) {
    return null
  }

  // Group views by group name
  const groupedViews = customAdminViews.reduce((acc, view) => {
    const group = view.group || "Custom Tools"
    if (!acc[group]) acc[group] = []
    acc[group].push(view)
    return acc
  }, {} as Record<string, CustomAdminViewConfig[]>)

  return (
    <div style={{ marginTop: "16px", marginBottom: "16px", padding: "0 8px" }}>
      {Object.entries(groupedViews).map(([groupTitle, views]) => (
        <div key={groupTitle} style={{ marginBottom: "12px" }}>
          {/* Section Header */}
          <div
            style={{
              padding: "4px 8px 8px 8px",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--theme-elevation-450, #888)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Sparkles size={11} style={{ opacity: 0.7 }} />
            <span>{groupTitle}</span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {views.map((view) => {
              const Icon = resolveIcon(view.icon)
              const fullHref = `/admin${view.path}`
              const isActive = pathname === fullHref || pathname.startsWith(`${fullHref}/`)

              return (
                <Link
                  key={view.id}
                  href={fullHref}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    backgroundColor: isActive
                      ? "var(--theme-elevation-100, rgba(13, 148, 136, 0.12))"
                      : "transparent",
                    color: isActive
                      ? "var(--theme-success-500, #0d9488)"
                      : "var(--theme-elevation-800, #333)",
                    border: isActive
                      ? "1px solid rgba(13, 148, 136, 0.25)"
                      : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "var(--theme-elevation-50, rgba(0,0,0,0.04))"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                    <Icon size={15} style={{ opacity: isActive ? 1 : 0.7, flexShrink: 0 }} />
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {view.title}
                    </span>
                  </div>

                  {view.badge && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "4px",
                        backgroundColor: isActive
                          ? "var(--theme-success-500, #0d9488)"
                          : "var(--theme-elevation-150, rgba(0,0,0,0.08))",
                        color: isActive ? "#ffffff" : "var(--theme-elevation-700, #555)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {view.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CustomAdminNavLinks
