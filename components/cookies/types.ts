export type CookiePosition = "bottom-right" | "bottom-left" | "bottom-center" | "bottom-bar"
export type CookieThemeStyle = "default" | "subtle" | "accent"

export interface CookieConsentConfig {
  isEnabled?: boolean | null
  title?: string | null
  description?: string | null
  badge?: string | null
  position?: CookiePosition | null
  themeStyle?: CookieThemeStyle | null
  delaySeconds?: number | null
  accentColor?: string | null
  acceptAllText?: string | null
  declineText?: string | null
  preferencesText?: string | null
  showDeclineButton?: boolean | null
  showPreferencesButton?: boolean | null
  showCloseIcon?: boolean | null
  showFloatingBadge?: boolean | null
  privacyPolicyUrl?: string | null
  privacyPolicyLabel?: string | null
  cookiePolicyUrl?: string | null
  cookiePolicyLabel?: string | null
  consentExpiryDays?: number | null
  policyVersion?: number | null
  // Categories
  necessaryTitle?: string | null
  necessaryDescription?: string | null
  analyticsEnabled?: boolean | null
  analyticsTitle?: string | null
  analyticsDescription?: string | null
  marketingEnabled?: boolean | null
  marketingTitle?: string | null
  marketingDescription?: string | null
  functionalEnabled?: boolean | null
  functionalTitle?: string | null
  functionalDescription?: string | null
  updatedAt?: string | null
}

export interface UserCookiePreferences {
  necessary: boolean // Always true
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp: number
  version: number
  decision: "all" | "rejected" | "custom"
}
