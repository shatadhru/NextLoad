import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteConfig } from '@/config/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SiteConfig.site.url || 'https://localhost:3000'
  const payload = await getPayload({ config })

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    // 1. Published & Public Blog Posts
    const postsRes = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { visibility: { equals: 'public' } },
        ],
      },
      limit: 1000,
      sort: '-publishDate',
    })

    const postRoutes: MetadataRoute.Sitemap = postsRes.docs.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // 2. Categories
    const categoriesRes = await payload.find({
      collection: 'blog-categories',
      limit: 100,
    })

    const categoryRoutes: MetadataRoute.Sitemap = categoriesRes.docs.map((cat: any) => ({
      url: `${baseUrl}/blog/category/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    // 3. Tags
    const tagsRes = await payload.find({
      collection: 'blog-tags',
      limit: 100,
    })

    const tagRoutes: MetadataRoute.Sitemap = tagsRes.docs.map((tag: any) => ({
      url: `${baseUrl}/blog/tag/${tag.slug}`,
      lastModified: tag.updatedAt ? new Date(tag.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))

    return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes]
  } catch (err) {
    console.error('Error generating sitemap:', err)
    return staticRoutes
  }
}
