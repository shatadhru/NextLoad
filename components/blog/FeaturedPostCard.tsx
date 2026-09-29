import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BlogPost, BlogCategory, BlogAuthor } from './types'

interface FeaturedPostCardProps {
  post: BlogPost
}

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  const category = (post.category && typeof post.category === 'object' ? post.category : null) as BlogCategory | null
  const author = (post.author && typeof post.author === 'object' ? post.author : null) as BlogAuthor | null

  const imageUrl =
    typeof post.featuredImage === 'object' && post.featuredImage
      ? post.featuredImage.cloudinary?.secure_url || post.featuredImage.url || '/placeholder.svg'
      : '/placeholder.svg'

  const formattedDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-xs transition-all duration-300 hover:shadow-lg hover:border-teal-500/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Cover Image */}
        <div className="lg:col-span-7 relative aspect-16/10 w-full overflow-hidden sm:rounded-l-2xl bg-muted">
          <Link href={`/blog/${post.slug}`} className="block h-full w-full">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </Link>
          {category && (
            <div className="absolute top-4 left-4 z-10">
              <Link href={`/blog/category/${category.slug}`}>
                <Badge className="bg-background/90 backdrop-blur-md text-foreground hover:bg-teal-600 hover:text-white border shadow-xs transition-colors">
                  {category.title}
                </Badge>
              </Link>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5 text-teal-600 dark:text-teal-400" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5 text-teal-600 dark:text-teal-400" />
                {post.readingTime || 1} min read
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-3">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>

            {post.excerpt && (
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {author?.image ? (
                <div className="relative size-8 rounded-full overflow-hidden border">
                  <Image src={author.image} alt={author.name || 'Author'} fill className="object-cover" />
                </div>
              ) : (
                <div className="size-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center border border-teal-500/20 font-semibold text-xs">
                  {author?.name ? author.name.charAt(0).toUpperCase() : <User className="size-4" />}
                </div>
              )}
              <span className="text-xs font-medium text-foreground">
                {author?.name || 'Editorial Team'}
              </span>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors group/link"
            >
              <span>Read article</span>
              <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default FeaturedPostCard
