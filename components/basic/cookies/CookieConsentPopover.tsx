"use client"

import React, { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CookieConsentConfig, UserCookiePreferences } from "./types"
import {
  Cookie,
  ShieldCheck,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Lock,
  ExternalLink,
  Check,
} from "lucide-react"

const STORAGE_KEY = "nextload_cookie_consent"
const COOKIE_NAME = "cookie_consent"

interface Props {
  config: CookieConsentConfig | null
}

export function CookieConsentPopover({ config: initialConfig }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [isSavedFeedback, setIsSavedFeedback] = useState(false)
  const [activeConfig, setActiveConfig] = useState<CookieConsentConfig | null>(initialConfig)
  const [, startTransition] = useTransition()

  // Always keep activeConfig in sync with incoming props
  useEffect(() => {
    setActiveConfig(initialConfig)
  }, [initialConfig])

  // Also query fresh settings from Payload API on mount to bypass any RSC layout cache
  useEffect(() => {
    fetch("/api/globals/cookie-consent")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setActiveConfig((prev) => ({
            ...prev,
            ...data,
            isEnabled: data.isEnabled !== false,
            showFloatingBadge: data.showFloatingBadge !== false,
          }))
        }
      })
      .catch(() => {
        // Fallback gracefully to server-passed config
      })
  }, [])

  // Category toggles state
  const [preferences, setPreferences] = useState<{
    analytics: boolean
    marketing: boolean
    functional: boolean
  }>({
    analytics: true,
    marketing: false,
    functional: true,
  })

  // Read stored preferences on mount
  useEffect(() => {
    setIsMounted(true)

    if (!activeConfig || activeConfig.isEnabled === false) {
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: UserCookiePreferences = JSON.parse(stored)
        const currentVersion = activeConfig.policyVersion || 1
        const expiryDays = activeConfig.consentExpiryDays || 180
        const isExpired = Date.now() - parsed.timestamp > expiryDays * 24 * 60 * 60 * 1000

        // If policy version increased or consent expired, re-prompt
        if (parsed.version === currentVersion && !isExpired) {
          setPreferences({
            analytics: parsed.analytics,
            marketing: parsed.marketing,
            functional: parsed.functional,
          })
          return
        }
      }
    } catch {
      // Fallback: prompt user
    }

    // Auto popup with configurable delay
    const delayMs = Math.max(0, (activeConfig.delaySeconds ?? 1) * 1000)
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsOpen(true)
      })
    }, delayMs)

    return () => clearTimeout(timer)
  }, [activeConfig])

  // Support re-opening via custom event (e.g. from footer link)
  useEffect(() => {
    const handleOpen = () => {
      setShowPreferences(true)
      setIsOpen(true)
    }

    window.addEventListener("open-cookie-preferences", handleOpen)
    return () => window.removeEventListener("open-cookie-preferences", handleOpen)
  }, [])

  if (!isMounted || !activeConfig || activeConfig.isEnabled === false) {
    return null
  }

  // Active non-null config verified by guard
  const config = activeConfig

  const saveConsent = (
    categories: { analytics: boolean; marketing: boolean; functional: boolean },
    decision: "all" | "rejected" | "custom"
  ) => {
    const payload: UserCookiePreferences = {
      necessary: true,
      analytics: categories.analytics,
      marketing: categories.marketing,
      functional: categories.functional,
      timestamp: Date.now(),
      version: config.policyVersion || 1,
      decision,
    }

    try {
      // 1. Save in LocalStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))

      // 2. Write client cookie with configurable expiry
      const expiryDays = config.consentExpiryDays || 180
      const maxAge = expiryDays * 24 * 60 * 60
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify(payload)
      )}; max-age=${maxAge}; path=/; SameSite=Lax`

      // 3. Dispatch global browser event for scripts & analytics tags
      window.dispatchEvent(
        new CustomEvent("cookie-consent-updated", {
          detail: payload,
        })
      )
    } catch (e) {
      console.warn("Could not save cookie consent:", e)
    }

    setIsSavedFeedback(true)
    setTimeout(() => {
      setIsOpen(false)
      setShowPreferences(false)
      setIsSavedFeedback(false)
    }, 400)
  }

  const handleAcceptAll = () => {
    const all = { analytics: true, marketing: true, functional: true }
    setPreferences(all)
    saveConsent(all, "all")
  }

  const handleRejectNonEssential = () => {
    const none = { analytics: false, marketing: false, functional: false }
    setPreferences(none)
    saveConsent(none, "rejected")
  }

  const handleSavePreferences = () => {
    saveConsent(preferences, "custom")
  }

  const handleDismiss = () => {
    // Dismissing sets minimal necessary consent
    handleRejectNonEssential()
  }

  // Positioning class calculations
  const position = config.position || "bottom-right"
  const isBottomBar = position === "bottom-bar"

  let positionClasses = "fixed z-50 p-3 sm:p-4"
  if (isBottomBar) {
    positionClasses += " bottom-0 inset-x-0 sm:p-0"
  } else if (position === "bottom-left") {
    positionClasses += " bottom-0 inset-x-0 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md sm:w-full"
  } else if (position === "bottom-center") {
    positionClasses +=
      " bottom-0 inset-x-0 sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-lg sm:w-full"
  } else {
    // bottom-right (default)
    positionClasses += " bottom-0 inset-x-0 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:max-w-md sm:w-full"
  }

  // Style customization
  const customAccent = config.accentColor?.trim() || null

  return (
    <>
      {/* Floating Popover Container */}
      {isOpen && (
        <aside
          role="dialog"
          aria-modal="false"
          aria-label={config.title || "Cookie Consent Preferences"}
          className={`${positionClasses} animate-in fade-in-0 slide-in-from-bottom-5 duration-300 ease-out`}
        >
          <div
            className={`relative overflow-hidden bg-background/95 dark:bg-card/95 backdrop-blur-md text-foreground transition-all duration-200 border shadow-2xl ${
              isBottomBar
                ? "rounded-t-2xl sm:rounded-none border-b-0 sm:border-x-0 border-t border-border px-4 py-4 sm:px-8 sm:py-5"
                : "rounded-2xl border-border/80 p-4 sm:p-5 ring-1 ring-black/5 dark:ring-white/10"
            } ${config.themeStyle === "accent" ? "border-t-4 border-t-primary" : ""}`}
          >
            {/* Header: Icon, Badge, Title, Close Button */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div
                  className="size-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary"
                  style={customAccent ? { backgroundColor: `${customAccent}18`, color: customAccent } : undefined}
                >
                  <Cookie className="size-4.5" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base leading-tight tracking-tight">
                  {config.title || "We value your privacy"}
                </h3>
                {config.badge && (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary uppercase tracking-wider"
                    style={customAccent ? { backgroundColor: `${customAccent}15`, color: customAccent } : undefined}
                  >
                    {config.badge}
                  </span>
                )}
              </div>

              {config.showCloseIcon !== false && (
                <button
                  type="button"
                  onClick={handleDismiss}
                  aria-label="Dismiss cookie notice"
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Description message */}
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
              {config.description ||
                "We use cookies to improve your experience, personalize content, and analyze our traffic. You can choose which categories you agree to or accept all cookies."}
            </p>

            {/* Expandable Preferences Drawer */}
            {showPreferences && (
              <div className="mt-3.5 space-y-2.5 rounded-xl border border-border/80 bg-muted/30 p-3 sm:p-3.5 animate-in fade-in-0 zoom-in-98 duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground pb-1 border-b border-border/50">
                  <span>Custom Cookie Preferences</span>
                  <span className="text-[10px] text-muted-foreground font-normal">GDPR / ePrivacy</span>
                </div>

                {/* Strictly Necessary (Locked ON) */}
                <div className="flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                      <span>{config.necessaryTitle || "Strictly Necessary"}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {config.necessaryDescription ||
                        "Essential for site security, navigation, and authentication. Cannot be disabled."}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    <Lock className="size-2.5" />
                    <span>Required</span>
                  </div>
                </div>

                {/* Analytics */}
                {config.analyticsEnabled !== false && (
                  <div className="flex items-start justify-between gap-3 text-xs pt-2 border-t border-border/50">
                    <div className="space-y-0.5 pr-2">
                      <label htmlFor="cookie-analytics" className="font-medium text-foreground cursor-pointer block">
                        {config.analyticsTitle || "Analytics & Performance"}
                      </label>
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        {config.analyticsDescription ||
                          "Measures site visits, bounce rates, and traffic sources to optimize user experience."}
                      </p>
                    </div>
                    <Switch
                      id="cookie-analytics"
                      size="sm"
                      checked={preferences.analytics}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, analytics: checked }))
                      }
                    />
                  </div>
                )}

                {/* Marketing */}
                {config.marketingEnabled !== false && (
                  <div className="flex items-start justify-between gap-3 text-xs pt-2 border-t border-border/50">
                    <div className="space-y-0.5 pr-2">
                      <label htmlFor="cookie-marketing" className="font-medium text-foreground cursor-pointer block">
                        {config.marketingTitle || "Marketing & Targeting"}
                      </label>
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        {config.marketingDescription ||
                          "Used to build visitor profiles and display personalized, relevant advertisements."}
                      </p>
                    </div>
                    <Switch
                      id="cookie-marketing"
                      size="sm"
                      checked={preferences.marketing}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, marketing: checked }))
                      }
                    />
                  </div>
                )}

                {/* Functional */}
                {config.functionalEnabled !== false && (
                  <div className="flex items-start justify-between gap-3 text-xs pt-2 border-t border-border/50">
                    <div className="space-y-0.5 pr-2">
                      <label htmlFor="cookie-functional" className="font-medium text-foreground cursor-pointer block">
                        {config.functionalTitle || "Functional & Preferences"}
                      </label>
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        {config.functionalDescription ||
                          "Remembers choices you make such as language, theme, and region."}
                      </p>
                    </div>
                    <Switch
                      id="cookie-functional"
                      size="sm"
                      checked={preferences.functional}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, functional: checked }))
                      }
                    />
                  </div>
                )}
              </div>
            )}

            {/* Interactive Actions Row */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Accept All Button */}
              <Button
                type="button"
                size="sm"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto flex-1 font-semibold shadow-xs"
                style={
                  customAccent
                    ? {
                        backgroundColor: customAccent,
                        borderColor: customAccent,
                        color: "#ffffff",
                      }
                    : undefined
                }
              >
                {isSavedFeedback ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="size-3.5" /> Saved
                  </span>
                ) : (
                  config.acceptAllText || "Accept All"
                )}
              </Button>

              {/* Preferences / Save Preferences Button */}
              {showPreferences ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSavePreferences}
                  className="w-full sm:w-auto flex-1 font-semibold"
                >
                  Save Choices
                </Button>
              ) : (
                config.showPreferencesButton !== false && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreferences(true)}
                    className="w-full sm:w-auto font-medium"
                  >
                    <SlidersHorizontal className="size-3.5 mr-1" />
                    {config.preferencesText || "Preferences"}
                    <ChevronDown className="size-3 ml-1 opacity-70" />
                  </Button>
                )
              )}

              {/* Reject Non-Essential Button */}
              {config.showDeclineButton !== false && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRejectNonEssential}
                  className="w-full sm:w-auto text-muted-foreground hover:text-foreground font-medium"
                >
                  {config.declineText || "Reject Non-Essential"}
                </Button>
              )}
            </div>

            {/* Privacy Links Footer */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground/80 border-t border-border/40 pt-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                {config.privacyPolicyUrl && (
                  <Link
                    href={config.privacyPolicyUrl}
                    className="hover:underline hover:text-foreground transition-colors inline-flex items-center gap-0.5"
                  >
                    <span>{config.privacyPolicyLabel || "Privacy Policy"}</span>
                    <ExternalLink className="size-2.5 opacity-60" />
                  </Link>
                )}
                {config.cookiePolicyUrl && (
                  <>
                    <span>•</span>
                    <Link
                      href={config.cookiePolicyUrl}
                      className="hover:underline hover:text-foreground transition-colors inline-flex items-center gap-0.5"
                    >
                      <span>{config.cookiePolicyLabel || "Cookie Details"}</span>
                      <ExternalLink className="size-2.5 opacity-60" />
                    </Link>
                  </>
                )}
              </div>

              {showPreferences && (
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  <span>Collapse</span>
                  <ChevronUp className="size-2.5" />
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Floating Re-Open Badge Trigger (Allows visitors to re-open consent anytime, toggleable from admin) */}
      {!isOpen && activeConfig.showFloatingBadge !== false && (
        <button
          type="button"
          onClick={() => {
            setShowPreferences(true)
            setIsOpen(true)
          }}
          aria-label="Manage cookie consent preferences"
          title="Cookie & Privacy Settings"
          className="fixed z-40 bottom-3 left-3 size-9 sm:size-10 rounded-full bg-background/80 hover:bg-background text-foreground/80 hover:text-foreground backdrop-blur-md border border-border shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Cookie className="size-4 sm:size-5 text-primary" />
        </button>
      )}
    </>
  )
}

export default CookieConsentPopover
