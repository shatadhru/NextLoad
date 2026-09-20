import React from 'react'
import '@/app/globals.css'
import Providor from '@/payload/providors'

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
      <body className={googleSans.className}>
        <main>
          <Providor>{children}</Providor>
        </main>
      </body>
    </html>
  )
}
