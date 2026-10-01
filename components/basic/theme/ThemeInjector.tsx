'use client'

import { useEffect } from 'react'
import { THEME_PRESETS, RADIUS_PRESETS } from '@/config/themePresets'

const FIELD_TO_VAR: Record<string, string> = {
  background: '--background',
  foreground: '--foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  destructive: '--destructive',
  border: '--border',
  input: '--input',
  ring: '--ring',
}

/**
 * Merges preset base colors with admin overrides.
 * Empty strings from the admin form do NOT overwrite the pre-built preset colors.
 */
function mergeColors(
  base: Record<string, string> | undefined,
  overrides: Record<string, string> | null | undefined,
): Record<string, string> {
  const result: Record<string, string> = { ...(base || {}) }
  if (overrides) {
    for (const [key, val] of Object.entries(overrides)) {
      if (typeof val === 'string' && val.trim()) {
        result[key] = val.trim()
      }
    }
  }
  return result
}

function buildCssRules(values: Record<string, string> | null | undefined): string[] {
  if (!values) return []
  return Object.entries(FIELD_TO_VAR)
    .map(([field, cssVar]) => {
      const val = values[field]
      return val && val.trim() ? `  ${cssVar}: ${val.trim()};` : null
    })
    .filter(Boolean) as string[]
}

import { useSiteSettings } from '@/components/basic/context/SiteSettingsContext'

export function ThemeInjector() {
  const { settings } = useSiteSettings()

  useEffect(() => {
    // 1. Clean up any inline styles on <html> to prevent specificity collisions with .dark
    for (const cssVar of Object.values(FIELD_TO_VAR)) {
      document.documentElement.style.removeProperty(cssVar)
    }
    document.documentElement.style.removeProperty('--radius')

    const oldStyle = document.getElementById('admin-dark-theme')
    if (oldStyle) oldStyle.remove()

    const existingStyle = document.getElementById('admin-theme-styles')
    if (existingStyle) existingStyle.remove()

    if (!settings?.themeConfig) return

    const { themeConfig } = settings

    // 2. Select pre-built preset base (Zinc, Slate, Stone, Rose, Blue, Green, Orange, Violet, Red, Yellow)
    const presetKey = themeConfig.preset || 'zinc'
    const preset = THEME_PRESETS[presetKey] || THEME_PRESETS.zinc

    // 3. Resolve Border Radius
    const rawRadius = themeConfig.radius?.trim()
    const mappedRadius = rawRadius ? (RADIUS_PRESETS[rawRadius] || rawRadius) : null

    // 4. Merge pre-built complete palettes with any admin overrides
    const lightMerged = mergeColors(
      preset.light as unknown as Record<string, string>,
      themeConfig.lightMode,
    )
    const darkMerged = mergeColors(
      preset.dark as unknown as Record<string, string>,
      themeConfig.darkMode,
    )

    const lightEntries = buildCssRules(lightMerged)
    const darkEntries = buildCssRules(darkMerged)

    // 5. Inject stylesheet with :root and .dark rules (native CSS specificity)
    const style = document.createElement('style')
    style.id = 'admin-theme-styles'
    style.textContent = `
:root {
${mappedRadius ? `  --radius: ${mappedRadius};` : ''}
${lightEntries.join('\n')}
}

.dark {
${darkEntries.join('\n')}
}
`
    document.head.appendChild(style)
  }, [settings])

  return null
}

export default ThemeInjector
