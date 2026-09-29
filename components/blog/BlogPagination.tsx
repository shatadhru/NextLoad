'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
}

export function BlogPagination({
  currentPage,
  totalPages,
  baseUrl,
}: BlogPaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeBase = baseUrl || pathname

  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (pageNumber > 1) {
      params.set('page', pageNumber.toString())
    } else {
      params.delete('page')
    }
    const query = params.toString()
    return query ? `${routeBase}?${query}` : routeBase
  }

  // Generate array of page numbers to show
  const pages: (number | string)[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (
      (i === currentPage - 2 && i > 1) ||
      (i === currentPage + 2 && i < totalPages)
    ) {
      if (!pages.includes('...')) {
        pages.push('...')
      }
    }
  }

  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-center gap-1.5 py-8"
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'h-9 px-3 gap-1 rounded-lg text-xs font-medium'
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'h-9 px-3 gap-1 rounded-lg text-xs font-medium opacity-40 cursor-not-allowed'
          )}
          aria-disabled="true"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {/* Numbered Page Buttons */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="size-9 flex items-center justify-center text-xs text-muted-foreground"
              >
                …
              </span>
            )
          }

          const pageNum = Number(p)
          const isCurrent = pageNum === currentPage

          return (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'size-9 flex items-center justify-center rounded-lg text-xs font-medium transition-colors',
                isCurrent
                  ? 'bg-teal-600 text-white shadow-xs font-semibold'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {pageNum}
            </Link>
          )
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'h-9 px-3 gap-1 rounded-lg text-xs font-medium'
          )}
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'h-9 px-3 gap-1 rounded-lg text-xs font-medium opacity-40 cursor-not-allowed'
          )}
          aria-disabled="true"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  )
}

export default BlogPagination
