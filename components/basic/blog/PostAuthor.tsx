import React from 'react'
import Image from 'next/image'
import { User, Calendar, Clock } from 'lucide-react'
import { BlogAuthor } from './types'

interface PostAuthorProps {
  author?: BlogAuthor | null
  publishDate?: string
  readingTime?: number
  className?: string
}

export function PostAuthor({
  author,
  publishDate,
  readingTime = 1,
  className = '',
}: PostAuthorProps) {
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {author?.image ? (
        <div className="relative size-11 rounded-full overflow-hidden border shadow-2xs">
          <Image
            src={author.image}
            alt={author.name || 'Author'}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 font-bold text-sm shadow-2xs">
          {author?.name ? author.name.charAt(0).toUpperCase() : <User className="size-5" />}
        </div>
      )}

      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-foreground">
          {author?.name || 'Editorial Team'}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {formattedDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3 text-primary" />
              {formattedDate}
            </span>
          )}
          {formattedDate && <span>•</span>}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3 text-primary" />
            {readingTime} min read
          </span>
        </div>
      </div>
    </div>
  )
}

export default PostAuthor
