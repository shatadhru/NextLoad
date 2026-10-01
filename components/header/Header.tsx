'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CartIconTrigger } from '@/components/basic/cart'
import { HeaderMobileDrawer } from './HeaderMobileDrawer'
import { headerConfig, type HeaderConfig, type HeaderNavItem } from '@/config/header'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HeaderThemeToggle, HeaderUserMenu } from '../basic/header'


export interface HeaderProps {
  /** Optional custom or extended header configuration */
  config?: HeaderConfig
  /** Optional override for nav items */
  navItems?: HeaderNavItem[]
  /** Header visual variant: default border, floating, ghost, or bordered */
  variant?: 'default' | 'floating' | 'ghost' | 'bordered'
  /** Maximum container width constraint */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  /** Sticky header position at top of page (default true) */
  sticky?: boolean
  /** Show or hide ecommerce shopping bag trigger */
  showCart?: boolean
  /** Show or hide theme switcher icon */
  showThemeToggle?: boolean
  /** Show or hide user authentication avatar or CTAs */
  showAuth?: boolean
  /** Show or hide brand version pill */
  showBrandBadge?: boolean
  /** Custom logo destination link */
  logoHref?: string
  /** Custom logo size preset */
  logoSize?: 'xs' | 'sm' | 'md'
  /** Additional custom actions to inject into the right action bar */
  customActions?: React.ReactNode
  /** Additional class names for the header container */
  className?: string
  /** Additional class names for the inner content container */
  containerClassName?: string
}

export function Header({
  config = headerConfig,
  navItems,
  variant = 'default',
  maxWidth = '7xl',
  sticky = true,
  showCart,
  showThemeToggle,
  showAuth,
  showBrandBadge,
  logoHref = '/',
  logoSize = 'sm',
  customActions,
  className,
  containerClassName,
}: HeaderProps) {
  const pathname = usePathname()

  const activeNav = navItems || config.nav
  const shouldShowCart = showCart ?? config.actions.showCart ?? true
  const shouldShowThemeToggle = showThemeToggle ?? config.actions.showThemeToggle ?? true
  const shouldShowAuth = showAuth ?? config.actions.showAuth ?? true
  const shouldShowBadge = showBrandBadge ?? config.brand.showBadge ?? true

  const maxWidthClass = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  }[maxWidth]

  const variantClass = {
    default: 'border-b border-border/50 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 shadow-xs',
    floating: 'top-3 mx-auto max-w-6xl rounded-2xl border border-border/60 bg-background/80 backdrop-blur-md shadow-md',
    bordered: 'border-b-2 border-border/80 bg-background',
    ghost: 'bg-transparent border-transparent',
  }[variant]

  const renderBadge = (badge?: string | number, variant: 'default' | 'secondary' | 'outline' | 'teal' = 'default') => {
    if (!badge) return null
    if (variant === 'teal') {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/25 leading-none">
          {badge}
        </span>
      )
    }
    return (
      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.2 h-4 leading-none">
        {badge}
      </Badge>
    )
  }

  return (
    <header
      className={cn(
        'w-full z-40 transition-colors overflow-x-clip select-none',
        sticky && 'sticky top-0',
        variantClass,
        className
      )}
    >
      <div
        className={cn(
          'mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-2 sm:gap-4',
          maxWidthClass,
          containerClassName
        )}
      >
        {/* Left Section: Mobile Drawer Trigger + Logo + Brand Pill */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          {/* Mobile Hamburger Drawer */}
          <HeaderMobileDrawer
            config={config}
            showCart={shouldShowCart}
            showThemeToggle={shouldShowThemeToggle}
          />

          {/* Logo Component */}
          <div className="flex items-center shrink-0">
            <Logo
              href={logoHref}
              size={logoSize}
              className="transition-transform hover:opacity-95"
            />
          </div>

          {/* Brand Tag / Version Badge */}
          {shouldShowBadge && config.brand.badgeText && (
            <Link
              href={config.brand.badgeHref || '/'}
              className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500/15 transition-colors"
            >
              {config.brand.badgeText}
            </Link>
          )}
        </div>

        {/* Center Section: Desktop Navigation Links (Controlled from Config) */}
        <nav
          className="hidden md:flex items-center gap-1 min-w-0"
          aria-label="Desktop Navigation"
        >
          {activeNav.map((item) => {
            const Icon = item.icon
            const hasChildren = Boolean(item.children && item.children.length > 0)
            const isActive = pathname === item.href

            if (hasChildren) {
              const isAnyChildActive = item.children?.some(
                (child) => pathname === child.href
              )

              return (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className={cn(
                          'group inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer outline-hidden',
                          isAnyChildActive
                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                        )}
                        aria-label={`${item.title} menu`}
                      />
                    }
                  >
                    {Icon && (
                      <Icon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                    )}
                    <span>{item.title}</span>
                    {renderBadge(item.badge, item.badgeVariant)}
                    <ChevronDown className="size-3 text-muted-foreground/70 transition-transform duration-200 group-data-popup-open:rotate-180 shrink-0" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="w-68 p-1.5 shadow-xl border border-border/60 bg-popover/95 backdrop-blur-md rounded-xl"
                  >
                    <DropdownMenuGroup>
                      {item.children?.map((sub) => {
                        const SubIcon = sub.icon
                        const isSubActive = pathname === sub.href

                        return (
                          <DropdownMenuItem
                            key={sub.id}
                            render={
                              <Link
                                href={sub.href}
                                target={sub.external ? '_blank' : undefined}
                                rel={sub.external ? 'noopener noreferrer' : undefined}
                              />
                            }
                            className={cn(
                              'flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors',
                              isSubActive
                                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                : 'hover:bg-muted/60'
                            )}
                          >
                            {SubIcon && (
                              <div className="p-1 rounded-md bg-muted/60 text-muted-foreground mt-0.5 shrink-0">
                                <SubIcon className="size-3.5" />
                              </div>
                            )}
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-foreground">
                                  {sub.title}
                                </span>
                                {renderBadge(sub.badge, sub.badgeVariant)}
                                {sub.external && (
                                  <ExternalLink className="size-3 text-muted-foreground/60 ml-auto" />
                                )}
                              </div>
                              {sub.description && (
                                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                  {sub.description}
                                </p>
                              )}
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                {Icon && (
                  <Icon className="size-3.5 text-muted-foreground shrink-0 transition-colors" />
                )}
                <span>{item.title}</span>
                {renderBadge(item.badge, item.badgeVariant)}
                {item.external && (
                  <ExternalLink className="size-3 text-muted-foreground/60 shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right Section: Actions (Theme Toggle, Cart, User Profile Avatar, CTAs) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Custom Injected Actions */}
          {customActions}

          {/* Shopping Cart Icon Trigger */}
          {shouldShowCart && (
            <div className="flex items-center">
              <CartIconTrigger size="sm" className="size-7.5 sm:size-8" />
            </div>
          )}

          {/* Theme Switcher Toggle */}
          {shouldShowThemeToggle && (
            <div className="hidden sm:flex items-center">
              <HeaderThemeToggle size="icon-sm" className="size-7.5 sm:size-8" />
            </div>
          )}

          {/* User Profile Avatar / Authentication Menu */}
          {shouldShowAuth && (
            <HeaderUserMenu authConfig={config.auth} />
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
