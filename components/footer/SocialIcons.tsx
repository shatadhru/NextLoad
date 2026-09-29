'use client'

import React from 'react'
import { SocialIcon } from 'react-social-icons'

export interface SocialLinkItem {
  platform: string
  url: string
  name?: string
  enabled?: boolean
}

export interface SocialIconsProps {
  socialLinks?: SocialLinkItem[]
  isLoading?: boolean
  className?: string
  iconSize?: number
}

const defaultSocials: SocialLinkItem[] = [
  { platform: 'github', url: 'https://github.com', name: 'GitHub', enabled: true },
  { platform: 'x', url: 'https://x.com', name: 'X / Twitter', enabled: true },
  { platform: 'linkedin', url: 'https://linkedin.com', name: 'LinkedIn', enabled: true },
  { platform: 'youtube', url: 'https://youtube.com', name: 'YouTube', enabled: true },
  { platform: 'discord', url: 'https://discord.com', name: 'Discord', enabled: true },
]

export function SocialIcons({
  socialLinks = defaultSocials,
  isLoading = false,
  className = '',
  iconSize = 32,
}: SocialIconsProps) {
  // Shimmer effect while loading
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`} aria-label="Loading social links">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{ width: iconSize, height: iconSize }}
            className="rounded-full bg-muted/80 relative overflow-hidden shrink-0 animate-pulse border border-border/40"
          >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
          </div>
        ))}
      </div>
    )
  }

  const rawList = Array.isArray(socialLinks) ? socialLinks : defaultSocials
  const activeLinks = rawList.filter((item) => item.enabled !== false && item.url)

  if (activeLinks.length === 0) return null

  return (
    <div className={`flex items-center gap-2.5 flex-wrap ${className}`} aria-label="Social media profiles">
      {activeLinks.map((item, idx) => {
        const platform = item.platform || 'github'
        return (
          <SocialIcon
            key={idx}
            network={platform}
            url={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ height: iconSize, width: iconSize }}
            className="hover:scale-110 active:scale-95 transition-transform duration-200 shadow-2xs rounded-full shrink-0 cursor-pointer"
            title={item.name || platform}
            aria-label={item.name || platform}
          />
        )
      })}
    </div>
  )
}

export default SocialIcons
