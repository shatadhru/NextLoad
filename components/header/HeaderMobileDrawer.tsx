'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/payload/auth/client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/ui/Logo'
import { CartIconTrigger } from '@/components/basic/cart'


import {
  Menu,
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  User,
  Database,
  LogOut,
  LogIn,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeaderConfig } from '@/config/header'
import { HeaderThemeToggle } from '../basic/header'

export interface HeaderMobileDrawerProps {
  config: HeaderConfig
  className?: string
  showCart?: boolean
  showThemeToggle?: boolean
}

export function HeaderMobileDrawer({
  config,
  className,
  showCart = true,
  showThemeToggle = true,
}: HeaderMobileDrawerProps) {
  const [open, setOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const pathname = usePathname()
  const router = useRouter()

  const { data: session } = authClient.useSession()
  const user = session?.user
  const isAdmin = (user as { role?: string } | undefined)?.role === 'admin'

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSignOut = async () => {
    setOpen(false)
    try {
      await authClient.signOut()
      router.push(config.auth.loginUrl)
      router.refresh()
    } catch (err) {
      console.error('Sign out error:', err)
      router.push(config.auth.loginUrl)
    }
  }

  const renderBadge = (badge?: string | number, variant: 'default' | 'secondary' | 'outline' | 'teal' = 'default') => {
    if (!badge) return null
    if (variant === 'teal') {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/25">
          {badge}
        </span>
      )
    }
    return (
      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-4">
        {badge}
      </Badge>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              'md:hidden rounded-lg text-muted-foreground hover:text-foreground cursor-pointer',
              className
            )}
            aria-label="Open mobile navigation menu"
          />
        }
      >
        <Menu className="size-4.5" />
      </SheetTrigger>

      <SheetContent
        side="left"
        showCloseButton={true}
        className="w-[86vw] max-w-xs sm:max-w-sm p-0 flex flex-col h-full bg-background/98 backdrop-blur-xl border-r border-border/60 overflow-hidden"
      >
        {/* Drawer Header: Logo and Site Info */}
        <SheetHeader className="p-4 border-b border-border/50 shrink-0">
          <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
          <div className="flex items-center gap-2.5">
            <Logo
              href="/"
              size="sm"
              className="cursor-pointer"
            />
            {config.brand.showBadge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                {config.brand.badgeText || 'v1.0'}
              </span>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 touch-pan-y">
          {/* Main Navigation Links */}
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {config.nav.map((item) => {
              const Icon = item.icon
              const hasChildren = Boolean(item.children && item.children.length > 0)
              const isExpanded = expandedGroups[item.id] ?? false
              const isActive = pathname === item.href

              if (hasChildren) {
                return (
                  <div key={item.id} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.id)}
                      className={cn(
                        'flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                        isExpanded
                          ? 'bg-muted/70 text-foreground'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
                        <span>{item.title}</span>
                        {renderBadge(item.badge, item.badgeVariant)}
                      </div>
                      <ChevronDown
                        className={cn(
                          'size-3.5 transition-transform duration-200 text-muted-foreground',
                          isExpanded && 'rotate-180 text-foreground'
                        )}
                      />
                    </button>

                    {/* Collapsible Submenu */}
                    {isExpanded && (
                      <div className="pl-6 pr-1 py-1 space-y-1 mt-0.5 border-l border-border/40 ml-4 animate-in slide-in-from-top-1 duration-150">
                        {item.children?.map((sub) => {
                          const SubIcon = sub.icon
                          const isSubActive = pathname === sub.href
                          return (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              target={sub.external ? '_blank' : undefined}
                              rel={sub.external ? 'noopener noreferrer' : undefined}
                              onClick={() => setOpen(false)}
                              className={cn(
                                'flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                                isSubActive
                                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                              )}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {SubIcon && (
                                  <SubIcon className="size-3.5 shrink-0 text-muted-foreground" />
                                )}
                                <span className="truncate">{sub.title}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {renderBadge(sub.badge, sub.badgeVariant)}
                                {sub.external && (
                                  <ExternalLink className="size-3 text-muted-foreground/70" />
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {renderBadge(item.badge, item.badgeVariant)}
                    {item.external && (
                      <ExternalLink className="size-3 text-muted-foreground/70" />
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          <Separator className="my-2" />

          {/* User Profile Card / Auth Section */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2.5">
            {user ? (
              <>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8.5 border border-border/70 shrink-0">
                    <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                    <AvatarFallback className="bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold">
                      {(user.name || 'U').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground truncate">
                        {user.name || 'User'}
                      </span>
                      {isAdmin && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400">
                          Admin
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <Link
                    href={config.auth.dashboardUrl}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'xs' }),
                      'h-7 text-[11px] font-medium justify-center'
                    )}
                  >
                    <LayoutDashboard className="size-3 mr-1" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href={config.auth.profileUrl}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'xs' }),
                      'h-7 text-[11px] font-medium justify-center'
                    )}
                  >
                    <User className="size-3 mr-1" />
                    <span>Settings</span>
                  </Link>
                </div>

                {isAdmin && (
                  <a
                    href={config.auth.adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: 'secondary', size: 'xs' }),
                      'w-full h-7 text-[11px] font-semibold text-teal-600 dark:text-teal-400 justify-center'
                    )}
                  >
                    <Database className="size-3 mr-1 text-teal-600" />
                    <span>Payload CMS Studio</span>
                  </a>
                )}

                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleSignOut}
                  className="w-full h-7 text-[11px] font-medium text-destructive hover:bg-destructive/10 hover:text-destructive justify-center cursor-pointer"
                >
                  <LogOut className="size-3 mr-1" />
                  <span>Log Out</span>
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  Sign in to access your dashboard, workspace, and resources.
                </p>
                <div className="flex flex-col gap-1.5">
                  <Link
                    href={config.auth.loginUrl}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: 'default', size: 'sm' }),
                      'w-full text-xs font-semibold justify-center'
                    )}
                  >
                    <LogIn className="size-3.5 mr-1" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href={config.auth.signupUrl}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ size: 'sm' }),
                      'w-full text-xs font-semibold justify-center bg-linear-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500'
                    )}
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer: Theme Toggle & Quick Controls */}
        <div className="p-3 border-t border-border/50 shrink-0 bg-muted/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showThemeToggle && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <HeaderThemeToggle size="icon-sm" />
                <span className="text-[11px]">Appearance</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showCart && <CartIconTrigger size="sm" />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default HeaderMobileDrawer
