import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { BlogPost, BlogCategory, BlogAuthor } from './types'

interface PostCardProps {
  post: BlogPost
}

export function PostCard({ post }: PostCardProps) {
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
    <Card className="group flex flex-col overflow-hidden rounded-xl border bg-card/60 backdrop-blur-xs transition-all duration-300 hover:shadow-md hover:border-teal-500/30">
      {/* Thumbnail */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        <Link href={`/blog/${post.slug}`} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {category && (
          <div className="absolute top-3 left-3 z-10">
            <Link href={`/blog/category/${category.slug}`}>
              <Badge className="bg-background/90 backdrop-blur-md text-foreground hover:bg-teal-600 hover:text-white border shadow-2xs text-[11px] font-medium transition-colors">
                {category.title}
              </Badge>
            </Link>
          </div>
        )}
      </div>

      {/* Body */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3 text-teal-600 dark:text-teal-400" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3 text-teal-600 dark:text-teal-400" />
              {post.readingTime || 1} min
            </span>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {post.excerpt && (
            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {author?.image ? (
              <div className="relative size-6 rounded-full overflow-hidden border">
                <Image src={author.image} alt={author.name || 'Author'} fill className="object-cover" />
              </div>
            ) : (
              <div className="size-6 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center border border-teal-500/20 font-semibold text-[10px]">
                {author?.name ? author.name.charAt(0).toUpperCase() : <User className="size-3" />}
              </div>
            )}
            <span className="text-muted-foreground font-medium truncate max-w-[120px]">
              {author?.name || 'Editorial Team'}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors group/link"
          >
            <span>Read</span>
            <ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard
