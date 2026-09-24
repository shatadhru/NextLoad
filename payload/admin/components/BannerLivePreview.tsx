"use client"

import React, { useState } from "react"
import { useFormFields } from "@payloadcms/ui"
import { computeBannerStyles } from "@/config/bannerPresets"
import {
  Megaphone,
  Bell,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Smartphone,
  Monitor,
  RotateCcw,
  ExternalLink,
  Eye,
  Check,
} from "lucide-react"

function renderBannerIcon(icon?: string) {
  const iconClass = "size-3.5 sm:size-4 shrink-0"
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

export function BannerLivePreview() {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop")
  const [isTestDismissed, setIsTestDismissed] = useState(false)

  // Safely extract live form fields via Payload UI hook
  const formData = useFormFields(([fields]) => {
    return {
      title: fields?.title?.value as string | undefined,
      content: fields?.content?.value as string | undefined,
      badge: fields?.badge?.value as string | undefined,
      icon: fields?.icon?.value as string | undefined,
      isActive: fields?.isActive?.value as boolean | undefined,
      backgroundType: fields?.backgroundType?.value as string | undefined,
      presetTheme: fields?.presetTheme?.value as string | undefined,
      customColor: fields?.customColor?.value as string | undefined,
      customGradient: fields?.customGradient?.value as string | undefined,
      textColor: fields?.textColor?.value as string | undefined,
      customTextColor: fields?.customTextColor?.value as string | undefined,
      isDismissible: fields?.isDismissible?.value !== false,
      enableLink: fields?.["link.enableLink"]?.value as boolean | undefined,
      linkLabel: fields?.["link.label"]?.value as string | undefined,
      linkUrl: fields?.["link.url"]?.value as string | undefined,
    }
  })

  const content =
    formData?.content || "🚀 Welcome to NextLoad! Enjoy our newest features and lightning-fast performance."
  const badge = formData?.badge !== undefined ? formData.badge : "Notice"
  const icon = formData?.icon || "megaphone"
  const isDismissible = formData?.isDismissible !== false
  const enableLink = Boolean(formData?.enableLink)
  const linkLabel = formData?.linkLabel || "Learn More"
  const linkUrl = formData?.linkUrl || "/updates"

  const styles = computeBannerStyles({
    backgroundType: formData?.backgroundType,
    presetTheme: formData?.presetTheme,
    customColor: formData?.customColor,
    customGradient: formData?.customGradient,
    textColor: formData?.textColor,
    customTextColor: formData?.customTextColor,
  })

  return (
    <div
      style={{
        backgroundColor: "var(--theme-elevation-50, #f8fafc)",
        border: "1px solid var(--theme-elevation-150, #e2e8f0)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "24px",
        fontFamily: "inherit",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Header controls (Mobile-friendly flex wrap) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Eye size={16} style={{ color: "var(--theme-elevation-600, #0d9488)" }} />
          <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--theme-elevation-900, #0f172a)" }}>
            Live Banner Preview
          </span>
          {formData?.isActive === false && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
              }}
            >
              Inactive
            </span>
          )}
        </div>

        {/* Viewport switch & Site preview link */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--theme-elevation-100, #e2e8f0)",
              borderRadius: "6px",
              padding: "2px",
            }}
          >
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                backgroundColor: deviceMode === "desktop" ? "var(--theme-elevation-0, #ffffff)" : "transparent",
                color: "var(--theme-elevation-800, #334155)",
                boxShadow: deviceMode === "desktop" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              <Monitor size={12} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                backgroundColor: deviceMode === "mobile" ? "var(--theme-elevation-0, #ffffff)" : "transparent",
                color: "var(--theme-elevation-800, #334155)",
                boxShadow: deviceMode === "mobile" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              <Smartphone size={12} />
              <span>Mobile</span>
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 10px",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "6px",
              backgroundColor: "var(--theme-elevation-150, #f1f5f9)",
              color: "var(--theme-elevation-700, #475569)",
              textDecoration: "none",
              border: "1px solid var(--theme-elevation-200, #cbd5e1)",
            }}
          >
            <ExternalLink size={11} />
            <span>Site</span>
          </a>
        </div>
      </div>

      {/* Preview container */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          transition: "all 0.25s ease",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: deviceMode === "mobile" ? "375px" : "100%",
            maxWidth: "100%",
            transition: "width 0.25s ease",
            borderRadius: deviceMode === "mobile" ? "14px" : "8px",
            border: deviceMode === "mobile" ? "2px solid #cbd5e1" : "none",
            overflow: "hidden",
            boxShadow:
              deviceMode === "mobile"
                ? "0 8px 24px -4px rgba(0, 0, 0, 0.12)"
                : "0 1px 3px rgba(0,0,0,0.05)",
            backgroundColor: "#ffffff",
          }}
        >
          {deviceMode === "mobile" && (
            <div
              style={{
                backgroundColor: "#f1f5f9",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "#64748b",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <span>9:41</span>
              <span style={{ fontWeight: 600 }}>Mobile Viewport (375px)</span>
              <span>100%</span>
            </div>
          )}

          {isTestDismissed ? (
            <div
              style={{
                padding: "16px",
                textAlign: "center",
                backgroundColor: "#f8fafc",
                color: "#64748b",
                fontSize: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>Banner was closed using the small close icon (X).</span>
              <button
                type="button"
                onClick={() => setIsTestDismissed(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderRadius: "4px",
                  backgroundColor: "#0d9488",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={12} />
                <span>Reset Preview</span>
              </button>
            </div>
          ) : (
            <div
              style={{
                background: styles.background,
                color: styles.textColor,
                padding: deviceMode === "mobile" ? "10px 12px" : "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                gap: "8px",
                fontSize: "13px",
                lineHeight: "1.4",
                boxSizing: "border-box",
                width: "100%",
              }}
            >
              {/* Content area: Icon, Badge, Message & Optional CTA */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: deviceMode === "mobile" ? "wrap" : "nowrap",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {/* Icon */}
                <div style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
                  {renderBannerIcon(icon)}
                </div>

                {/* Badge */}
                {badge && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "9999px",
                      backgroundColor: styles.badgeBg,
                      color: styles.badgeText,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {badge}
                  </span>
                )}

                {/* Message */}
                <span
                  style={{
                    fontWeight: 500,
                    wordBreak: "break-word",
                    fontSize: deviceMode === "mobile" ? "12px" : "13px",
                    flex: 1,
                  }}
                >
                  {content}
                </span>

                {/* CTA Link */}
                {enableLink && (
                  <a
                    href={linkUrl}
                    onClick={(e) => e.preventDefault()}
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(255, 255, 255, 0.25)",
                      color: styles.textColor,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      border: "1px solid rgba(255, 255, 255, 0.35)",
                      flexShrink: 0,
                      marginTop: deviceMode === "mobile" ? "4px" : "0",
                    }}
                  >
                    <span>{linkLabel}</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>

              {/* Small Close Icon (X) */}
              {isDismissible && (
                <button
                  type="button"
                  title="Close banner (Test click)"
                  onClick={() => setIsTestDismissed(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "none",
                    background: "transparent",
                    color: styles.textColor,
                    cursor: "pointer",
                    padding: 0,
                    flexShrink: 0,
                    opacity: 0.85,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = styles.closeBtnHover
                    e.currentTarget.style.opacity = "1"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.opacity = "0.85"
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "var(--theme-elevation-500, #64748b)",
        }}
      >
        <span>
          💡 Background: <strong>{formData?.backgroundType || "preset"}</strong>
          {formData?.backgroundType === "preset" ? ` (${formData?.presetTheme || "teal"})` : ""}
        </span>
        {isDismissible && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <Check size={11} style={{ color: "#10b981" }} /> Close icon active
          </span>
        )}
      </div>
    </div>
  )
}

export default BannerLivePreview
