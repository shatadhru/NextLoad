import React from 'react'
import { BookOpen } from 'lucide-react'
import { BlogSearch } from './BlogSearch'
import { CategoryFilter } from './CategoryFilter'
import { BlogCategory } from './types'

interface BlogHeroProps {
  categories?: BlogCategory[]
  activeCategory?: string
  totalCount?: number
}

export function BlogHero({
  categories = [],
  activeCategory,
  totalCount,
}: BlogHeroProps) {
  return (
    <section className="relative py-12 sm:py-16 overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,120,120,0.1),rgba(255,255,255,0))]" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-2xs">
          <BookOpen className="size-3.5" />
          <span>Articles, Tutorials & Architecture Guides</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Modern Web & Engineering
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
            Deep dives on Next.js, Payload CMS, scalable architectures, and modern cloud deployment strategies.
            {totalCount !== undefined && totalCount > 0 && (
              <span className="block mt-1 font-medium text-primary">
                Browse all {totalCount} published {totalCount === 1 ? 'article' : 'articles'}.
              </span>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center pt-2">
          <BlogSearch className="w-full max-w-lg" />
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="pt-2 flex justify-center">
            <CategoryFilter categories={categories} activeCategory={activeCategory} />
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogHero
