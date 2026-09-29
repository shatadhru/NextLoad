import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { SiteConfig } from '@/config/site'

export function BlogFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/20 text-muted-foreground text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo href="/blog" size="sm" />
          <span className="text-muted-foreground">
            © {currentYear} {SiteConfig.site.name}. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog Home
          </Link>
          <Link href="/" className="hover:text-foreground transition-colors">
            Main Platform
          </Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/admin" target="_blank" className="hover:text-foreground transition-colors">
            Payload CMS
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default BlogFooter
