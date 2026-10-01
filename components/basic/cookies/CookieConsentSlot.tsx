import React from "react"
import { getPayload } from "payload"
import config from "@payload-config"
import { CookieConsentConfig } from "./types"
import { CookieConsentPopover } from "./CookieConsentPopover"

export async function CookieConsentSlot() {
  let cookieConfig: CookieConsentConfig | null = null

  try {
    const payload = await getPayload({ config })
    const globalData = await payload.findGlobal({
      slug: "cookie-consent",
    })

    if (globalData) {
      cookieConfig = {
        isEnabled: globalData.isEnabled !== false,
        title: globalData.title,
        description: globalData.description,
        badge: globalData.badge,
        position: (globalData.position as any) || "bottom-right",
        themeStyle: (globalData.themeStyle as any) || "default",
        delaySeconds: typeof globalData.delaySeconds === "number" ? globalData.delaySeconds : 1,
        accentColor: globalData.accentColor,
        acceptAllText: globalData.acceptAllText || "Accept All",
        declineText: globalData.declineText || "Reject Non-Essential",
        preferencesText: globalData.preferencesText || "Preferences",
        showDeclineButton: globalData.showDeclineButton !== false,
        showPreferencesButton: globalData.showPreferencesButton !== false,
        showCloseIcon: globalData.showCloseIcon !== false,
        showFloatingBadge: globalData.showFloatingBadge !== false,
        privacyPolicyUrl: globalData.privacyPolicyUrl || "/privacy",
        privacyPolicyLabel: globalData.privacyPolicyLabel || "Privacy Policy",
        cookiePolicyUrl: globalData.cookiePolicyUrl || "/cookies",
        cookiePolicyLabel: globalData.cookiePolicyLabel || "Cookie Policy",
        consentExpiryDays: typeof globalData.consentExpiryDays === "number" ? globalData.consentExpiryDays : 180,
        policyVersion: typeof globalData.policyVersion === "number" ? globalData.policyVersion : 1,
        necessaryTitle: globalData.necessaryTitle || "Strictly Necessary",
        necessaryDescription:
          globalData.necessaryDescription ||
          "Essential for site security, navigation, and authentication. Cannot be disabled.",
        analyticsEnabled: globalData.analyticsEnabled !== false,
        analyticsTitle: globalData.analyticsTitle || "Analytics & Performance",
        analyticsDescription:
          globalData.analyticsDescription ||
          "Measures site visits, bounce rates, and traffic sources to optimize user experience.",
        marketingEnabled: globalData.marketingEnabled !== false,
        marketingTitle: globalData.marketingTitle || "Marketing & Targeting",
        marketingDescription:
          globalData.marketingDescription ||
          "Used to build visitor profiles and display personalized, relevant advertisements.",
        functionalEnabled: globalData.functionalEnabled !== false,
        functionalTitle: globalData.functionalTitle || "Functional & Preferences",
        functionalDescription:
          globalData.functionalDescription ||
          "Remembers choices you make such as language, theme, and region.",
        updatedAt: (globalData as any).updatedAt,
      }
    }
  } catch (error) {
    // If DB is warming up or global not yet migrated, fall back to default enabled config
    console.warn("CookieConsentSlot could not query cookie-consent global, using defaults:", error)
    cookieConfig = {
      isEnabled: true,
      title: "We value your privacy",
      description:
        "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. You can manage your preferences or accept all cookies.",
      badge: "Cookie Policy",
      position: "bottom-right",
      themeStyle: "default",
      delaySeconds: 1,
      acceptAllText: "Accept All",
      declineText: "Reject Non-Essential",
      preferencesText: "Preferences",
      showDeclineButton: true,
      showPreferencesButton: true,
      showCloseIcon: true,
      showFloatingBadge: true,
      privacyPolicyUrl: "/privacy",
      privacyPolicyLabel: "Privacy Policy",
      cookiePolicyUrl: "/cookies",
      cookiePolicyLabel: "Cookie Policy",
      consentExpiryDays: 180,
      policyVersion: 1,
      necessaryTitle: "Strictly Necessary",
      necessaryDescription: "Essential for site security, navigation, and authentication. Cannot be disabled.",
      analyticsEnabled: true,
      analyticsTitle: "Analytics & Performance",
      analyticsDescription: "Measures site visits, bounce rates, and traffic sources to optimize user experience.",
      marketingEnabled: true,
      marketingTitle: "Marketing & Targeting",
      marketingDescription: "Used to build visitor profiles and display personalized advertisements.",
      functionalEnabled: true,
      functionalTitle: "Functional & Preferences",
      functionalDescription: "Remembers choices you make such as language, theme, and region.",
    }
  }

  return <CookieConsentPopover config={cookieConfig} />
}

export default CookieConsentSlot
