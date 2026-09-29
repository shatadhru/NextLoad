import React from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteConfig, getPageTitle } from '@/config/site'
import {
  BlogHero,
  FeaturedPostCard,
  PostCard,
  BlogPagination,
  BlogPost,
  BlogCategory,
} from '@/components/blog'
import { BookOpen } from 'lucide-react'

export const revalidate = 60 // ISR revalidation

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    q?: string
  }>
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { category, q } = await searchParams
  let title = 'Blog & Articles'
  let description =
    'Read articles, technical guides, and architectural insights on modern full-stack development.'

  if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} Articles | Blog`
  }
  if (q) {
    title = `Search results for "${q}" | Blog`
  }

  const canonicalUrl = `${SiteConfig.site.url}/blog${
    category ? `?category=${category}` : ''
  }`

  return {
    title: getPageTitle(title),
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: getPageTitle(title),
      description,
      url: canonicalUrl,
      siteName: SiteConfig.site.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: getPageTitle(title),
      description,
    },
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, Number(params.page) || 1)
  const categorySlug = params.category || ''
  const searchQuery = params.q || ''

  const payload = await getPayload({ config })

  // 1. Fetch all blog categories for the filter bar
  const categoriesRes = await payload.find({
    collection: 'blog-categories',
    limit: 100,
    sort: 'title',
  })
  const categories = (categoriesRes.docs || []) as unknown as BlogCategory[]

  // 2. Build where filter: only published & public
  const where: any = {
    and: [
      { status: { equals: 'published' } },
      { visibility: { equals: 'public' } },
    ],
  }

  // Filter by category if specified
  if (categorySlug) {
    const matchedCategory = categories.find((c) => c.slug === categorySlug)
    if (matchedCategory) {
      where.and.push({ category: { equals: matchedCategory.id } })
    }
  }

  // Filter by search query if specified
  if (searchQuery.trim()) {
    where.and.push({
      or: [
        { title: { contains: searchQuery.trim() } },
        { excerpt: { contains: searchQuery.trim() } },
        { seoKeywords: { contains: searchQuery.trim() } },
      ],
    })
  }

  // 3. Fetch posts
  const postsRes = await payload.find({
    collection: 'posts',
    where,
    limit: 9,
    page: currentPage,
    sort: '-publishDate',
    depth: 2,
  })

  const posts = (postsRes.docs || []) as unknown as BlogPost[]
  const totalPages = postsRes.totalPages || 1
  const totalDocs = postsRes.totalDocs || 0

  // Featured post logic: on page 1 without search, the first post is featured
  const isDefaultView = currentPage === 1 && !searchQuery && !categorySlug
  const featuredPost = isDefaultView && posts.length > 0 ? posts[0] : null
  const gridPosts = isDefaultView && posts.length > 0 ? posts.slice(1) : posts

  return (
    <div className="space-y-12 pb-16">
      {/* Blog Hero Section with Search & Category Pills */}
      <BlogHero
        categories={categories}
        activeCategory={categorySlug}
        totalCount={totalDocs}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Results title if filtered */}
        {(searchQuery || categorySlug) && (
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {searchQuery ? (
                  <>
                    Search Results for &ldquo;
                    <span className="text-teal-600 dark:text-teal-400">{searchQuery}</span>
                    &rdquo;
                  </>
                ) : (
                  <>
                    Topic:{' '}
                    <span className="text-teal-600 dark:text-teal-400">
                      {categories.find((c) => c.slug === categorySlug)?.title || categorySlug}
                    </span>
                  </>
                )}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Showing {posts.length} of {totalDocs} {totalDocs === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
        )}

        {/* Featured Post (only on page 1 of default view) */}
        {featuredPost && (
          <section aria-label="Featured article">
            <FeaturedPostCard post={featuredPost} />
          </section>
        )}

        {/* Latest Posts Grid */}
        {gridPosts.length > 0 ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isDefaultView ? 'Latest Articles' : 'Articles'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <PostCard key={post.id || post.slug} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <BlogPagination currentPage={currentPage} totalPages={totalPages} />
          </section>
        ) : (
          <div className="text-center py-20 border rounded-2xl bg-card/40 space-y-4">
            <div className="size-12 rounded-full bg-teal-500/10 text-teal-600 mx-auto flex items-center justify-center border border-teal-500/20">
              <BookOpen className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">No articles found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? `We couldn't find any articles matching "${searchQuery}". Try different keywords.`
                  : 'Check back soon for new articles, guides, and tutorials.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
