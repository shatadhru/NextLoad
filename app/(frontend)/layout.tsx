import React from 'react'
import '@/app/globals.css'
import Providor from '@/payload/providors';

import type { Metadata } from 'next'
import { SiteConfig } from '@/config/site'

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
    <html lang="en">
      <body>
        <main>
          <Providor>{children}</Providor>
          </main>
      </body>
    </html>
  )
}
