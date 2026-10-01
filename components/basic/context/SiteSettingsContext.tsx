'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface SiteSettingsData {
  siteName?: string
  siteTitle?: string
  siteDescription?: string
  copyright?: string
  footerTagline?: string
  paymentMethods?: any
  socialLinks?: any[]
  legal?: any
  logoText?: string
  logoUrl?: string | null
  logoDarkUrl?: string | null
  faviconUrl?: string | null
  logo?: any
  logoDark?: any
  favicon?: any
  themeConfig?: any
  security?: any
  [key: string]: any
}

interface SiteSettingsContextType {
  settings: SiteSettingsData | null
  isLoading: boolean
  refreshSettings: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  isLoading: true,
  refreshSettings: async () => {},
})

const CACHE_STORAGE_KEY = 'nextload_site_settings_cache'
// 5 Hours TTL in milliseconds (5 * 60 * 60 * 1000 = 18,000,000 ms)
const CACHE_TTL_MS = 5 * 60 * 60 * 1000

// In-memory module cache to avoid re-reading localStorage across components
let memoryCache: { data: SiteSettingsData; timestamp: number } | null = null
let inFlightPromise: Promise<SiteSettingsData | null> | null = null

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsData | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL_MS) {
        return memoryCache.data
      }
      const raw = localStorage.getItem(CACHE_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          memoryCache = parsed
          return parsed.data
        }
      }
    } catch {
      // Ignore storage errors
    }
    return null
  })

  const [isLoading, setIsLoading] = useState<boolean>(!settings)

  const fetchFreshSettings = useCallback(async (): Promise<SiteSettingsData | null> => {
    // If a request is already running, reuse the same promise (deduplication)
    if (inFlightPromise) {
      return inFlightPromise
    }

    inFlightPromise = fetch('/api/site-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SiteSettingsData | null) => {
        if (data) {
          const cachePayload = { data, timestamp: Date.now() }
          memoryCache = cachePayload
          try {
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cachePayload))
          } catch {
            // Storage quota exceeded or disabled
          }
          setSettings(data)
        }
        return data
      })
      .catch((err) => {
        console.warn('Failed to fetch site settings:', err)
        return null
      })
      .finally(() => {
        inFlightPromise = null
        setIsLoading(false)
      })

    return inFlightPromise
  }, [])

  useEffect(() => {
    // Check if we need to fetch or if cached version is still valid
    try {
      const raw = localStorage.getItem(CACHE_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          setSettings(parsed.data)
          setIsLoading(false)
          return
        }
      }
    } catch {
      // Fallback to fetch
    }

    // Cache expired or missing -> fetch fresh once
    fetchFreshSettings()
  }, [fetchFreshSettings])

  const refreshSettings = useCallback(async () => {
    try {
      localStorage.removeItem(CACHE_STORAGE_KEY)
      memoryCache = null
    } catch {}
    await fetchFreshSettings()
  }, [fetchFreshSettings])

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
