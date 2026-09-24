"use client"

import React, { useState } from "react"
import { useFormFields } from "@payloadcms/ui"
import {
  Cookie,
  ShieldCheck,
  SlidersHorizontal,
  X,
  Smartphone,
  Monitor,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Lock,
} from "lucide-react"

export function CookieLivePreview() {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop")
  const [showPreferences, setShowPreferences] = useState(false)
  const [userChoice, setUserChoice] = useState<string | null>(null)
  const [testCategories, setTestCategories] = useState({
    analytics: true,
    marketing: false,
    functional: true,
  })

  // Safely extract live form fields via Payload UI hook
  const formData = useFormFields(([fields]) => {
    return {
      isEnabled: fields?.isEnabled?.value !== false,
      title: fields?.title?.value as string | undefined,
      description: fields?.description?.value as string | undefined,
      badge: fields?.badge?.value as string | undefined,
      position: (fields?.position?.value as string) || "bottom-right",
      themeStyle: (fields?.themeStyle?.value as string) || "default",
      delaySeconds: (fields?.delaySeconds?.value as number) || 1,
      accentColor: fields?.accentColor?.value as string | undefined,
      acceptAllText: (fields?.acceptAllText?.value as string) || "Accept All",
      declineText: (fields?.declineText?.value as string) || "Reject Non-Essential",
      preferencesText: (fields?.preferencesText?.value as string) || "Preferences",
      showDeclineButton: fields?.showDeclineButton?.value !== false,
      showPreferencesButton: fields?.showPreferencesButton?.value !== false,
      showCloseIcon: fields?.showCloseIcon?.value !== false,
      showFloatingBadge: fields?.showFloatingBadge?.value !== false,
      privacyPolicyUrl: (fields?.privacyPolicyUrl?.value as string) || "/privacy",
      privacyPolicyLabel: (fields?.privacyPolicyLabel?.value as string) || "Privacy Policy",
      cookiePolicyUrl: fields?.cookiePolicyUrl?.value as string | undefined,
      cookiePolicyLabel: (fields?.cookiePolicyLabel?.value as string) || "Cookie Policy",
      necessaryTitle: (fields?.necessaryTitle?.value as string) || "Strictly Necessary",
      necessaryDescription:
        (fields?.necessaryDescription?.value as string) ||
        "Essential for core features and security. Cannot be disabled.",
      analyticsEnabled: fields?.analyticsEnabled?.value !== false,
      analyticsTitle: (fields?.analyticsTitle?.value as string) || "Analytics & Performance",
      marketingEnabled: fields?.marketingEnabled?.value !== false,
      marketingTitle: (fields?.marketingTitle?.value as string) || "Marketing & Targeting",
      functionalEnabled: fields?.functionalEnabled?.value !== false,
      functionalTitle: (fields?.functionalTitle?.value as string) || "Functional & Preferences",
    }
  })

  const isEnabled = formData?.isEnabled !== false
  const title = formData?.title || "We value your privacy"
  const description =
    formData?.description ||
    "We use cookies to improve your experience, personalize content, and analyze our traffic. You can choose which categories you agree to or accept all cookies."
  const badge = formData?.badge !== undefined ? formData.badge : "Cookie Policy"
  const position = formData?.position || "bottom-right"
  const accentColor = formData?.accentColor || ""

  const handleReset = () => {
    setUserChoice(null)
    setShowPreferences(false)
    setTestCategories({
      analytics: true,
      marketing: false,
      functional: true,
    })
  }

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
      {/* Header controls */}
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
            Cookie Popover Preview
          </span>
          {!isEnabled && (
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
              Disabled
            </span>
          )}
        </div>

        {/* Viewport switch */}
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

          {userChoice && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset test preview"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                fontSize: "11px",
                borderRadius: "6px",
                border: "1px solid var(--theme-elevation-200, #cbd5e1)",
                backgroundColor: "var(--theme-elevation-0, #ffffff)",
                cursor: "pointer",
                color: "var(--theme-elevation-700, #475569)",
              }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulated Device Frame / Preview Canvas */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: deviceMode === "mobile" ? "320px" : "100%",
          margin: "0 auto",
          minHeight: "260px",
          backgroundColor: "var(--theme-elevation-150, #f1f5f9)",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid var(--theme-elevation-200, #cbd5e1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: deviceMode === "mobile" ? "8px" : "16px",
          transition: "max-width 0.25s ease",
        }}
      >
        {/* Mock background content representing a website */}
        <div style={{ position: "absolute", top: 12, left: 16, right: 16, opacity: 0.25, pointerEvents: "none" }}>
          <div style={{ height: "12px", width: "40%", background: "#94a3b8", borderRadius: "4px", marginBottom: "8px" }} />
          <div style={{ height: "8px", width: "80%", background: "#cbd5e1", borderRadius: "3px", marginBottom: "6px" }} />
          <div style={{ height: "8px", width: "65%", background: "#cbd5e1", borderRadius: "3px" }} />
        </div>

        {/* If user clicked Accept or Reject in preview, show simulated result state */}
        {userChoice ? (
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              backgroundColor: "var(--theme-elevation-0, #ffffff)",
              borderRadius: "10px",
              border: "1px solid var(--theme-elevation-200, #e2e8f0)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "6px",
                borderRadius: "50%",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                marginBottom: "8px",
              }}
            >
              <Check size={20} />
            </div>
            <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--theme-elevation-900, #0f172a)" }}>
              Consent Saved: {userChoice}
            </div>
            <div style={{ fontSize: "11px", color: "var(--theme-elevation-500, #64748b)", marginTop: "4px" }}>
              Popover closed. Click Reset to preview again.
            </div>
          </div>
        ) : (
          /* Actual Simulated Cookie Popover Card */
          <div
            style={{
              backgroundColor: "var(--theme-elevation-0, #ffffff)",
              border: formData?.themeStyle === "accent" ? "2px solid #0d9488" : "1px solid var(--theme-elevation-200, #e2e8f0)",
              borderRadius: deviceMode === "mobile" ? "12px" : "14px",
              padding: deviceMode === "mobile" ? "12px" : "14px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Header: Icon, Title, Badge, Dismiss */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    backgroundColor: accentColor ? `${accentColor}18` : "rgba(13, 148, 136, 0.12)",
                    color: accentColor || "#0d9488",
                  }}
                >
                  <Cookie size={16} />
                </div>
                <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--theme-elevation-900, #0f172a)" }}>
                  {title}
                </span>
                {badge && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(13, 148, 136, 0.1)",
                      color: accentColor || "#0d9488",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </div>

              {formData?.showCloseIcon && (
                <button
                  type="button"
                  onClick={() => setUserChoice("Dismissed (X)")}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "var(--theme-elevation-400, #94a3b8)",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    borderRadius: "4px",
                  }}
                  title="Dismiss"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "11px",
                lineHeight: "1.45",
                color: "var(--theme-elevation-600, #475569)",
                margin: 0,
              }}
            >
              {description}
            </p>

            {/* Expandable Preferences Drawer */}
            {showPreferences && (
              <div
                style={{
                  backgroundColor: "var(--theme-elevation-50, #f8fafc)",
                  border: "1px solid var(--theme-elevation-150, #e2e8f0)",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "2px",
                }}
              >
                {/* Necessary category (locked on) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <ShieldCheck size={14} style={{ color: "#10b981" }} />
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--theme-elevation-800, #1e293b)" }}>
                      {formData?.necessaryTitle}
                    </span>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: "2px" }}>
                    <Lock size={10} /> Always Active
                  </span>
                </div>

                {/* Analytics category */}
                {formData?.analyticsEnabled && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px", borderTop: "1px solid var(--theme-elevation-100, #e2e8f0)" }}>
                    <span style={{ fontSize: "11px", color: "var(--theme-elevation-800, #1e293b)" }}>
                      {formData?.analyticsTitle}
                    </span>
                    <input
                      type="checkbox"
                      checked={testCategories.analytics}
                      onChange={(e) => setTestCategories({ ...testCategories, analytics: e.target.checked })}
                      style={{ cursor: "pointer", accentColor: accentColor || "#0d9488" }}
                    />
                  </div>
                )}

                {/* Marketing category */}
                {formData?.marketingEnabled && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px", borderTop: "1px solid var(--theme-elevation-100, #e2e8f0)" }}>
                    <span style={{ fontSize: "11px", color: "var(--theme-elevation-800, #1e293b)" }}>
                      {formData?.marketingTitle}
                    </span>
                    <input
                      type="checkbox"
                      checked={testCategories.marketing}
                      onChange={(e) => setTestCategories({ ...testCategories, marketing: e.target.checked })}
                      style={{ cursor: "pointer", accentColor: accentColor || "#0d9488" }}
                    />
                  </div>
                )}

                {/* Functional category */}
                {formData?.functionalEnabled && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px", borderTop: "1px solid var(--theme-elevation-100, #e2e8f0)" }}>
                    <span style={{ fontSize: "11px", color: "var(--theme-elevation-800, #1e293b)" }}>
                      {formData?.functionalTitle}
                    </span>
                    <input
                      type="checkbox"
                      checked={testCategories.functional}
                      onChange={(e) => setTestCategories({ ...testCategories, functional: e.target.checked })}
                      style={{ cursor: "pointer", accentColor: accentColor || "#0d9488" }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Buttons Row */}
            <div
              style={{
                display: "flex",
                flexWrap: deviceMode === "mobile" ? "wrap" : "nowrap",
                gap: "6px",
                marginTop: "4px",
              }}
            >
              {/* Accept All */}
              <button
                type="button"
                onClick={() => setUserChoice("All Accepted")}
                style={{
                  flex: deviceMode === "mobile" ? "1 1 100%" : 1,
                  padding: "7px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: accentColor || "#0d9488",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <span>{formData?.acceptAllText}</span>
              </button>

              {/* Reject Non-Essential */}
              {formData?.showDeclineButton && (
                <button
                  type="button"
                  onClick={() => setUserChoice("Rejected Non-Essential")}
                  style={{
                    flex: deviceMode === "mobile" ? "1 1 calc(50% - 3px)" : "auto",
                    padding: "7px 10px",
                    fontSize: "11px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    border: "1px solid var(--theme-elevation-200, #cbd5e1)",
                    backgroundColor: "transparent",
                    color: "var(--theme-elevation-700, #334155)",
                    cursor: "pointer",
                  }}
                >
                  <span>{formData?.declineText}</span>
                </button>
              )}

              {/* Preferences Toggle */}
              {formData?.showPreferencesButton && (
                <button
                  type="button"
                  onClick={() => setShowPreferences(!showPreferences)}
                  style={{
                    flex: deviceMode === "mobile" ? "1 1 calc(50% - 3px)" : "auto",
                    padding: "7px 10px",
                    fontSize: "11px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    border: "1px solid var(--theme-elevation-200, #cbd5e1)",
                    backgroundColor: showPreferences ? "var(--theme-elevation-100, #e2e8f0)" : "transparent",
                    color: "var(--theme-elevation-700, #334155)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  <SlidersHorizontal size={11} />
                  <span>{formData?.preferencesText}</span>
                  {showPreferences ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>
              )}
            </div>

            {/* Links footer preview */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "10px",
                color: "var(--theme-elevation-500, #64748b)",
                marginTop: "2px",
              }}
            >
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                {formData?.privacyPolicyLabel}
              </span>
              {formData?.cookiePolicyUrl && (
                <>
                  <span>•</span>
                  <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                    {formData?.cookiePolicyLabel}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          color: "var(--theme-elevation-500, #64748b)",
          marginTop: "10px",
        }}
      >
        <span>Position: <strong>{position}</strong></span>
        <span>Delay: <strong>{formData?.delaySeconds}s</strong></span>
      </div>
    </div>
  )
}

export default CookieLivePreview
