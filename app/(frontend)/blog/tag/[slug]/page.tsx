import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteConfig, getPageTitle } from '@/config/site'
import {
  BlogBreadcrumbs,
  PostCard,
  BlogPagination,
  BlogPost,
  BlogTag,
} from '@/components/basic/blog'
import { Badge } from '@/components/ui/badge'
import { Hash, BookOpen, ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const revalidate = 60

interface TagPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const tagRes = await payload.find({
    collection: 'blog-tags',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const tag = tagRes.docs[0] as unknown as BlogTag | undefined
  if (!tag) {
    return {
      title: 'Tag Not Found',
    }
  }

  const title = `#${tag.title} Articles`
  const description = `Browse all articles, guides, and tutorials tagged with #${tag.title}.`
  const canonicalUrl = `${SiteConfig.site.url}/blog/tag/${tag.slug}`

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

export default async function BlogTagPage({
  params,
  searchParams,
}: TagPageProps) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = Math.max(1, Number(page) || 1)

  const payload = await getPayload({ config })

  // Find tag
  const tagRes = await payload.find({
    collection: 'blog-tags',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const tag = tagRes.docs[0] as unknown as BlogTag | undefined
  if (!tag) {
    notFound()
  }

  // Fetch posts matching this tag (published & public)
  const postsRes = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { visibility: { equals: 'public' } },
        { tags: { contains: tag.id } },
      ],
    },
    limit: 9,
    page: currentPage,
    sort: '-publishDate',
    depth: 2,
  })

  const posts = (postsRes.docs || []) as unknown as BlogPost[]
  const totalPages = postsRes.totalPages || 1
  const totalDocs = postsRes.totalDocs || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <BlogBreadcrumbs
        items={[
          { label: 'Blog', href: '/blog' },
          { label: 'Tags', href: '/blog' },
          { label: `#${tag.title}` },
        ]}
      />

      {/* Header Banner */}
      <header className="rounded-2xl border bg-gradient-to-br from-teal-500/10 via-background to-background p-8 sm:p-12 space-y-4 text-center sm:text-left">
        <Badge className="bg-teal-600 hover:bg-teal-700 text-white font-medium inline-flex items-center gap-1">
          <Hash className="size-3" />
          <span>Tag Archive</span>
        </Badge>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            #{tag.title}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
            All published articles and resources labeled with #{tag.title}.
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          {totalDocs} tagged {totalDocs === 1 ? 'article' : 'articles'}
        </p>
      </header>

      {/* Post Grid */}
      {posts.length > 0 ? (
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id || post.slug} post={post} />
            ))}
          </div>

          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/blog/tag/${tag.slug}`}
          />
        </section>
      ) : (
        <div className="text-center py-20 border rounded-2xl bg-card/40 space-y-4">
          <div className="size-12 rounded-full bg-teal-500/10 text-teal-600 mx-auto flex items-center justify-center border border-teal-500/20">
            <BookOpen className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              No articles tagged with #{tag.title} yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Check back soon for new articles in this topic.
            </p>
          </div>
          <Link
            href="/blog"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-2')}
          >
            <ArrowLeft className="size-3.5 mr-1" />
            <span>All Articles</span>
          </Link>
        </div>
      )}
    </div>
  )
}
