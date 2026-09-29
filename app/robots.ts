import type { MetadataRoute } from 'next'
import { SiteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SiteConfig.site.url || 'https://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/reset-password'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
