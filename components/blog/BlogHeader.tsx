'use client'

import React from 'react'
import Link from 'next/link'
import { authClient } from '@/payload/auth/client'
import { Logo } from '@/components/ui/Logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LayoutDashboard, LogIn, ArrowLeft } from 'lucide-react'

import { CartIconTrigger } from '@/components/cart'

export function BlogHeader() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo href="/" size="md" />
          <div className="h-4 w-px bg-border" />
          <Link
            href="/blog"
            className="text-sm font-bold text-foreground hover:text-teal-600 transition-colors"
          >
            Blog
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          <CartIconTrigger size="sm" />

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3" />
            <span>Main Site</span>
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'flex items-center gap-1.5 text-xs font-semibold'
              )}
            >
              <LayoutDashboard className="size-3.5" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'ghost' }),
                  'text-xs font-medium'
                )}
              >
                <LogIn className="size-3.5 mr-1" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth/signup"
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white'
                )}
              >
                <span>Join</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default BlogHeader
