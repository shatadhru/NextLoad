'use client'

import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface BlogSearchProps {
  placeholder?: string
  className?: string
}

export function BlogSearch({
  placeholder = 'Search articles, topics, keywords...',
  className = '',
}: BlogSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(currentQuery)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (val: string) => {
    setQuery(val)
    const params = new URLSearchParams(searchParams.toString())
    if (val.trim()) {
      params.set('q', val.trim())
      params.set('page', '1')
    } else {
      params.delete('q')
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-10 h-10 w-full rounded-full bg-background/90 backdrop-blur-xs border-border/80 text-sm focus-visible:ring-2 focus-visible:ring-teal-500 shadow-xs"
        />
        {isPending ? (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-teal-600 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-6 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Clear search"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default BlogSearch
