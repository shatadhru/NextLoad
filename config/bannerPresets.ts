export interface BannerPreset {
  id: string
  name: string
  background: string
  textColor: string
  badgeBg: string
  badgeText: string
  closeBtnHover: string
}

export const BANNER_PRESETS: Record<string, BannerPreset> = {
  teal: {
    id: 'teal',
    name: 'Teal Ocean (Brand Primary)',
    background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
    textColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
    closeBtnHover: 'rgba(255, 255, 255, 0.2)',
  },
  blue: {
    id: 'blue',
    name: 'Sapphire Blue (Information)',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    textColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
    closeBtnHover: 'rgba(255, 255, 255, 0.2)',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber (Warning / Attention)',
    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    textColor: '#ffffff',
    badgeBg: 'rgba(0, 0, 0, 0.2)',
    badgeText: '#ffffff',
    closeBtnHover: 'rgba(255, 255, 255, 0.2)',
  },
  rose: {
    id: 'rose',
    name: 'Rose Crimson (Urgent / Alert)',
    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
    textColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
    closeBtnHover: 'rgba(255, 255, 255, 0.2)',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest (Success / Promo)',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    textColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
    closeBtnHover: 'rgba(255, 255, 255, 0.2)',
  },
  violet: {
    id: 'violet',
    name: 'Electric Violet (Modern / Trendy)',
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    textColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
    closeBtnHover: 'rgba(255, 255, 255, 0.2)',
  },
  dark: {
    id: 'dark',
    name: 'Midnight Slate (Minimalist Dark)',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    textColor: '#f8fafc',
    badgeBg: 'rgba(255, 255, 255, 0.12)',
    badgeText: '#38bdf8',
    closeBtnHover: 'rgba(255, 255, 255, 0.15)',
  },
  'gradient-sunset': {
    id: 'gradient-sunset',
    name: 'Neon Sunset (Purple to Rose Gradient)',
    background: 'linear-gradient(135deg, #9333ea 0%, #f43f5e 100%)',
    textColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
    closeBtnHover: 'rgba(255, 255, 255, 0.2)',
  },
  'gradient-aurora': {
    id: 'gradient-aurora',
    name: 'Northern Lights (Blue to Teal Gradient)',
    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
    textColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
    closeBtnHover: 'rgba(255, 255, 255, 0.2)',
  },
  'gradient-cyber': {
    id: 'gradient-cyber',
    name: 'Cyber Violet (Indigo to Fuchsia Gradient)',
    background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)',
    textColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
    closeBtnHover: 'rgba(255, 255, 255, 0.2)',
  },
}

export function computeBannerStyles(banner: {
  backgroundType?: string | null
  presetTheme?: string | null
  customColor?: string | null
  customGradient?: string | null
  textColor?: string | null
  customTextColor?: string | null
}) {
  const bgType = banner.backgroundType || 'preset'
  const presetKey = banner.presetTheme || 'teal'
  const preset = BANNER_PRESETS[presetKey] || BANNER_PRESETS.teal

  let background = preset.background
  if (bgType === 'custom') {
    background = banner.customColor || '#0f766e'
  } else if (bgType === 'gradient') {
    background = banner.customGradient || preset.background
  }

  let textColor = preset.textColor
  if (banner.textColor === 'dark') {
    textColor = '#0f172a'
  } else if (banner.textColor === 'white') {
    textColor = '#ffffff'
  } else if (banner.textColor === 'custom' && banner.customTextColor) {
    textColor = banner.customTextColor
  }

  const isLightText = textColor.toLowerCase() === '#ffffff' || textColor.toLowerCase() === 'white'

  const badgeBg = isLightText ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
  const badgeText = textColor
  const closeBtnHover = isLightText ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'

  return {
    background,
    textColor,
    badgeBg,
    badgeText,
    closeBtnHover,
  }
}
