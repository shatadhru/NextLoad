import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BlogBreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function BlogBreadcrumbs({ items, className = '' }: BlogBreadcrumbsProps) {
  // Breadcrumb schema
  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href
          ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'}${item.href}`
          : undefined,
      })),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs text-muted-foreground ${className}`}
      >
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="size-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={index} className="inline-flex items-center gap-1.5">
                <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-[200px]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-medium text-foreground truncate max-w-[200px] sm:max-w-[320px]"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

export default BlogBreadcrumbs
