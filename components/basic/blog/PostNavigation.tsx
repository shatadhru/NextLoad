import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { BlogPost } from './types'

interface PostNavigationProps {
  prevPost?: BlogPost | null
  nextPost?: BlogPost | null
}

export function PostNavigation({ prevPost, nextPost }: PostNavigationProps) {
  if (!prevPost && !nextPost) return null

  return (
    <nav
      aria-label="Previous and Next post"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-y"
    >
      {/* Previous Post */}
      {prevPost ? (
        <Link
          href={`/blog/${prevPost.slug}`}
          className="group flex flex-col justify-center p-4 rounded-xl border bg-card/40 hover:bg-card hover:border-primary/40 transition-all text-left space-y-1"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Previous Article</span>
          </span>
          <span className="text-sm sm:text-base font-bold text-foreground line-clamp-2">
            {prevPost.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* Next Post */}
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group flex flex-col justify-center p-4 rounded-xl border bg-card/40 hover:bg-card hover:border-primary/40 transition-all text-right space-y-1 sm:items-end"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
            <span>Next Article</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="text-sm sm:text-base font-bold text-foreground line-clamp-2">
            {nextPost.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  )
}

export default PostNavigation
