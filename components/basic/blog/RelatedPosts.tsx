import React from 'react'
import { PostCard } from './PostCard'
import { BlogPost } from './types'

interface RelatedPostsProps {
  posts: BlogPost[]
  title?: string
}

export function RelatedPosts({
  posts = [],
  title = 'Recommended Reading',
}: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="space-y-6 pt-8 border-t">
      <div className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id || post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
