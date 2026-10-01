import React from 'react'
import '@/components/style/globals.css'
import Providor from '@/payload/providors'
import NoticeBannerSlot from '@/components/basic/banner/NoticeBannerSlot'
import CookieConsentSlot from '@/components/basic/cookies/CookieConsentSlot'

import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { SiteConfig } from '@/config/site'

const googleSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-google-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: SiteConfig.seo.title.default,
    template: SiteConfig.seo.title.template,
  },
  description: SiteConfig.seo.description,
  keywords: SiteConfig.seo.keywords,
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning className={googleSans.variable}>
      <body className={`${googleSans.className} min-h-screen overflow-x-hidden antialiased`}>
        <main className="min-h-screen overflow-x-hidden flex flex-col">
          <Providor>
            <NoticeBannerSlot />
            {children}
            <CookieConsentSlot />
          </Providor>
        </main>
      </body>
    </html>
  )
}
