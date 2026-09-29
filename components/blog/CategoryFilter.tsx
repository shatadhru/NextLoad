'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { BlogCategory } from './types'

interface CategoryFilterProps {
  categories: BlogCategory[]
  activeCategory?: string
  baseUrl?: string
}

export function CategoryFilter({
  categories = [],
  activeCategory,
  baseUrl = '/blog',
}: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const currentCategory = activeCategory || searchParams.get('category') || ''

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none no-scrollbar">
      <Link href={baseUrl}>
        <Badge
          variant={!currentCategory ? 'default' : 'outline'}
          className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            !currentCategory
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          All Topics
        </Badge>
      </Link>
      {categories.map((cat) => {
        const isActive = currentCategory === cat.slug
        return (
          <Link key={cat.id || cat.slug} href={`${baseUrl}?category=${cat.slug}`}>
            <Badge
              variant={isActive ? 'default' : 'outline'}
              className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.title}
            </Badge>
          </Link>
        )
      })}
    </div>
  )
}

export default CategoryFilter
