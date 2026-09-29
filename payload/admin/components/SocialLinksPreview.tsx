'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import { SocialIcon } from 'react-social-icons'
import { Share2 } from 'lucide-react'

export function SocialLinksPreview() {
  const formState = useFormFields(([fields]) => {
    const rawCount = fields?.['socialLinks']?.value
    let links: Array<{ platform: string; url: string; enabled: boolean }> = []

    if (Array.isArray(rawCount)) {
      links = rawCount.map((item: any) => ({
        platform: item.platform || 'github',
        url: item.url || '',
        enabled: item.enabled !== false,
      }))
    } else if (typeof rawCount === 'number' && rawCount > 0) {
      for (let i = 0; i < rawCount; i++) {
        const platform = (fields?.[`socialLinks.${i}.platform`]?.value as string) || 'github'
        const url = (fields?.[`socialLinks.${i}.url`]?.value as string) || ''
        const enabled = fields?.[`socialLinks.${i}.enabled`]?.value !== false
        links.push({ platform, url, enabled })
      }
    }

    return { links }
  })

  const links = Array.isArray(formState?.links) ? formState.links : []
  const activeLinks = links.filter((l) => l.enabled !== false && l.url)

  return (
    <div className="my-4 rounded-xl border border-border/80 bg-background/80 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b pb-2">
        <div className="flex items-center gap-2">
          <Share2 className="size-4 text-teal-600" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Live Social Media Icons Preview
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {activeLinks.length} Active {activeLinks.length === 1 ? 'Profile' : 'Profiles'}
        </span>
      </div>

      {activeLinks.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {activeLinks.map((item, idx) => (
              <div
                key={idx}
                className="transition-transform hover:scale-110 shadow-2xs rounded-full"
                title={`${item.platform}: ${item.url}`}
              >
                <SocialIcon
                  network={item.platform}
                  url={item.url}
                  style={{ height: 32, width: 32 }}
                />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            SVG vector badges rendered using react-social-icons with official brand colors.
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic py-2">
          No social media profiles currently visible. Add and enable profiles above to display them in the footer.
        </p>
      )}
    </div>
  )
}

export default SocialLinksPreview
