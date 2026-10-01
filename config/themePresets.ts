/**
 * Predefined shadcn theme presets.
 * Each preset defines all CSS custom property values for light and dark modes.
 * Values are hex for compatibility with native color pickers.
 */

export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  border: string
  input: string
  ring: string
}

export interface ThemePreset {
  label: string
  light: ThemeColors
  dark: ThemeColors
}

// Base gray scales
const ZINC_LIGHT: ThemeColors = {
  background: '#ffffff',
  foreground: '#09090b',
  card: '#ffffff',
  cardForeground: '#09090b',
  popover: '#ffffff',
  popoverForeground: '#09090b',
  primary: '#18181b',
  primaryForeground: '#fafafa',
  secondary: '#f4f4f5',
  secondaryForeground: '#18181b',
  muted: '#f4f4f5',
  mutedForeground: '#71717a',
  accent: '#f4f4f5',
  accentForeground: '#18181b',
  destructive: '#ef4444',
  border: '#e4e4e7',
  input: '#e4e4e7',
  ring: '#18181b',
}

const ZINC_DARK: ThemeColors = {
  background: '#09090b',
  foreground: '#fafafa',
  card: '#09090b',
  cardForeground: '#fafafa',
  popover: '#09090b',
  popoverForeground: '#fafafa',
  primary: '#fafafa',
  primaryForeground: '#18181b',
  secondary: '#27272a',
  secondaryForeground: '#fafafa',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
  accent: '#27272a',
  accentForeground: '#fafafa',
  destructive: '#7f1d1d',
  border: '#27272a',
  input: '#27272a',
  ring: '#d4d4d8',
}

/** Helper to create a colored theme variant from a zinc base */
function colorVariant(
  lightPrimary: string,
  lightPrimaryFg: string,
  darkPrimary: string,
  darkPrimaryFg: string,
): { light: ThemeColors; dark: ThemeColors } {
  return {
    light: { ...ZINC_LIGHT, primary: lightPrimary, primaryForeground: lightPrimaryFg, ring: lightPrimary },
    dark: { ...ZINC_DARK, primary: darkPrimary, primaryForeground: darkPrimaryFg, ring: darkPrimary },
  }
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  zinc: {
    label: 'Zinc (Default)',
    light: ZINC_LIGHT,
    dark: ZINC_DARK,
  },
  slate: {
    label: 'Slate',
    light: {
      ...ZINC_LIGHT,
      foreground: '#020817',
      cardForeground: '#020817',
      popoverForeground: '#020817',
      primary: '#0f172a',
      primaryForeground: '#f8fafc',
      secondary: '#f1f5f9',
      secondaryForeground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      accent: '#f1f5f9',
      accentForeground: '#0f172a',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: '#0f172a',
    },
    dark: {
      ...ZINC_DARK,
      background: '#020817',
      foreground: '#f8fafc',
      card: '#020817',
      cardForeground: '#f8fafc',
      popover: '#020817',
      popoverForeground: '#f8fafc',
      primary: '#f8fafc',
      primaryForeground: '#0f172a',
      secondary: '#1e293b',
      secondaryForeground: '#f8fafc',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
      accent: '#1e293b',
      accentForeground: '#f8fafc',
      border: '#1e293b',
      input: '#1e293b',
      ring: '#cbd5e1',
    },
  },
  stone: {
    label: 'Stone',
    light: {
      ...ZINC_LIGHT,
      foreground: '#1c1917',
      cardForeground: '#1c1917',
      popoverForeground: '#1c1917',
      primary: '#1c1917',
      primaryForeground: '#fafaf9',
      secondary: '#f5f5f4',
      secondaryForeground: '#1c1917',
      muted: '#f5f5f4',
      mutedForeground: '#78716c',
      accent: '#f5f5f4',
      accentForeground: '#1c1917',
      border: '#e7e5e4',
      input: '#e7e5e4',
      ring: '#1c1917',
    },
    dark: {
      ...ZINC_DARK,
      background: '#1c1917',
      foreground: '#fafaf9',
      card: '#1c1917',
      cardForeground: '#fafaf9',
      popover: '#1c1917',
      popoverForeground: '#fafaf9',
      primary: '#fafaf9',
      primaryForeground: '#1c1917',
      secondary: '#292524',
      secondaryForeground: '#fafaf9',
      muted: '#292524',
      mutedForeground: '#a8a29e',
      accent: '#292524',
      accentForeground: '#fafaf9',
      border: '#292524',
      input: '#292524',
      ring: '#d6d3d1',
    },
  },
  rose: { label: 'Rose', ...colorVariant('#e11d48', '#fff1f2', '#e11d48', '#fff1f2') },
  blue: { label: 'Blue', ...colorVariant('#2563eb', '#eff6ff', '#3b82f6', '#eff6ff') },
  green: { label: 'Green', ...colorVariant('#16a34a', '#f0fdf4', '#22c55e', '#052e16') },
  orange: { label: 'Orange', ...colorVariant('#ea580c', '#fff7ed', '#f97316', '#431407') },
  violet: { label: 'Violet', ...colorVariant('#7c3aed', '#f5f3ff', '#8b5cf6', '#1e1b4b') },
  red: { label: 'Red', ...colorVariant('#dc2626', '#fef2f2', '#ef4444', '#450a0a') },
  yellow: { label: 'Yellow', ...colorVariant('#ca8a04', '#fefce8', '#eab308', '#422006') },
}

/** Radius presets mapping size names to CSS values */
export const RADIUS_PRESETS: Record<string, string> = {
  none: '0',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  default: '0.625rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
}

/** Options for Payload select field */
export const PRESET_OPTIONS = Object.entries(THEME_PRESETS).map(([value, preset]) => ({
  label: preset.label,
  value,
}))

export const RADIUS_OPTIONS = [
  { label: 'None (0)', value: 'none' },
  { label: 'XS (0.25rem)', value: 'xs' },
  { label: 'SM (0.375rem)', value: 'sm' },
  { label: 'MD (0.5rem)', value: 'md' },
  { label: 'Default (0.625rem)', value: 'default' },
  { label: 'LG (0.75rem)', value: 'lg' },
  { label: 'XL (1rem)', value: 'xl' },
  { label: '2XL (1.5rem)', value: '2xl' },
]
