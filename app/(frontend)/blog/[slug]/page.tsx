import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerSession } from '@delmaredigital/payload-better-auth'
import { SiteConfig, getPageTitle } from '@/config/site'
import {
  BlogBreadcrumbs,
  PostAuthor,
  ShareButtons,
  RichTextRenderer,
  RelatedPosts,
  PostNavigation,
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogAuthor,
} from '@/components/blog'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Lock, LogIn, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export const revalidate = 60

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const postRes = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const post = postRes.docs[0] as unknown as BlogPost | undefined
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const metaTitle = post.seoTitle || post.title
  const metaDescription =
    post.seoDescription || post.excerpt || SiteConfig.seo.description

  const canonicalUrl =
    post.canonicalUrl || `${SiteConfig.site.url}/blog/${post.slug}`

  const ogImageMedia =
    post.ogImage && typeof post.ogImage === 'object'
      ? post.ogImage
      : post.featuredImage && typeof post.featuredImage === 'object'
      ? post.featuredImage
      : null

  const ogImageUrl =
    ogImageMedia?.cloudinary?.secure_url || ogImageMedia?.url || `${SiteConfig.site.url}/og-image.png`

  return {
    title: getPageTitle(metaTitle),
    description: metaDescription,
    keywords: post.seoKeywords ? post.seoKeywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: SiteConfig.site.name,
      type: 'article',
      publishedTime: post.publishDate || post.createdAt,
      modifiedTime: post.updatedAt,
      images: ogImageUrl ? [{ url: ogImageUrl, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    robots:
      post.status === 'draft' || post.visibility === 'private'
        ? { index: false, follow: false }
        : { index: true, follow: true },
  }
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const headersList = await headers()
  const session = await getServerSession(payload, headersList)
  const currentUser = session?.user
  const isAdmin = (currentUser as { role?: string } | undefined)?.role === 'admin'

  // Fetch the target post
  const postRes = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const post = postRes.docs[0] as unknown as BlogPost | undefined
  if (!post) {
    notFound()
  }

  // Draft check: only admin can view drafts
  if (post.status === 'draft' && !isAdmin) {
    notFound()
  }

  // Private visibility check: requires logged-in user
  if (post.visibility === 'private' && !currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center space-y-6">
        <div className="size-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20 shadow-xs">
          <Lock className="size-8" />
        </div>
        <div className="space-y-2">
          <Badge variant="outline" className="text-amber-600 border-amber-500/30">
            Members Only
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {post.title}
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            This article is exclusive to registered members. Please sign in or create a free account to continue reading.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Link
            href={`/auth/login?redirect=/blog/${post.slug}`}
            className={cn(buttonVariants({ size: 'default' }), 'bg-teal-600 hover:bg-teal-700 text-white')}
          >
            <LogIn className="size-4 mr-2" />
            <span>Sign In to Read</span>
          </Link>
          <Link
            href="/blog"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }))}
          >
            <ArrowLeft className="size-4 mr-2" />
            <span>Return to Blog</span>
          </Link>
        </div>
      </div>
    )
  }

  const category = (post.category && typeof post.category === 'object' ? post.category : null) as BlogCategory | null
  const author = (post.author && typeof post.author === 'object' ? post.author : null) as BlogAuthor | null
  const tags = (post.tags || []).filter((t): t is BlogTag => typeof t === 'object' && t !== null)

  const featuredImgUrl =
    typeof post.featuredImage === 'object' && post.featuredImage
      ? post.featuredImage.cloudinary?.secure_url || post.featuredImage.url
      : null

  const postUrl = `${SiteConfig.site.url}/blog/${post.slug}`

  // Fetch adjacent posts (Previous & Next)
  const prevRes = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { visibility: { equals: 'public' } },
        { publishDate: { less_than: post.publishDate || post.createdAt } },
      ],
    },
    sort: '-publishDate',
    limit: 1,
  })

  const nextRes = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { visibility: { equals: 'public' } },
        { publishDate: { greater_than: post.publishDate || post.createdAt } },
      ],
    },
    sort: 'publishDate',
    limit: 1,
  })

  const prevPost = (prevRes.docs[0] || null) as unknown as BlogPost | null
  const nextPost = (nextRes.docs[0] || null) as unknown as BlogPost | null

  // Fetch related posts (same category, excluding this post)
  let relatedPosts: BlogPost[] = []
  if (category) {
    const relatedRes = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          { visibility: { equals: 'public' } },
          { id: { not_equals: post.id } },
          { category: { equals: category.id } },
        ],
      },
      limit: 3,
      sort: '-publishDate',
      depth: 1,
    })
    relatedPosts = (relatedRes.docs || []) as unknown as BlogPost[]
  }

  // JSON-LD Article Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: featuredImgUrl ? [featuredImgUrl] : [],
    datePublished: post.publishDate || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: author?.name || 'Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: SiteConfig.site.name,
      url: SiteConfig.site.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SiteConfig.site.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  }

  return (
    <>
      {/* Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Breadcrumb */}
        <BlogBreadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            ...(category ? [{ label: category.title, href: `/blog/category/${category.slug}` }] : []),
            { label: post.title },
          ]}
        />

        {/* Header Block */}
        <header className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <Link href={`/blog/category/${category.slug}`}>
                <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border-teal-500/20 font-semibold">
                  {category.title}
                </Badge>
              </Link>
            )}
            {post.visibility === 'unlisted' && (
              <Badge variant="outline" className="text-muted-foreground border-dashed">
                Unlisted
              </Badge>
            )}
            {post.status === 'draft' && (
              <Badge variant="destructive">
                Draft Preview
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author, Date, Reading Time & Share Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-b py-4">
            <PostAuthor
              author={author}
              publishDate={post.publishDate || post.createdAt}
              readingTime={post.readingTime || 1}
            />
            <ShareButtons title={post.title} url={postUrl} />
          </div>
        </header>

        {/* Featured Image */}
        {featuredImgUrl && (
          <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden border bg-muted shadow-md">
            <Image
              src={featuredImgUrl}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>
        )}

        {/* Rich Text Body */}
        <div className="pt-2">
          <RichTextRenderer content={post.content} />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="pt-6 border-t flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground mr-1 uppercase tracking-wider">
              Tags:
            </span>
            {tags.map((tag) => (
              <Link key={tag.id || tag.slug} href={`/blog/tag/${tag.slug}`}>
                <Badge
                  variant="outline"
                  className="hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
                >
                  #{tag.title}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Share Buttons */}
        <div className="py-4 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Enjoyed this article? Share it with your peers:</span>
          <ShareButtons title={post.title} url={postUrl} />
        </div>

        {/* Prev / Next Navigation */}
        <PostNavigation prevPost={prevPost} nextPost={nextPost} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} title="Related Articles in this Topic" />
        )}
      </article>
    </>
  )
}
