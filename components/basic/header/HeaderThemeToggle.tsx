'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface HeaderThemeToggleProps {
  className?: string
  size?: 'icon-xs' | 'icon-sm' | 'icon'
}

export function HeaderThemeToggle({
  className,
  size = 'icon-sm',
}: HeaderThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          'size-7 rounded-lg bg-muted/40 border border-border/40 animate-pulse',
          size === 'icon-xs' && 'size-6',
          size === 'icon' && 'size-8',
          className
        )}
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer',
        className
      )}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <Sun className="size-3.5 text-amber-500 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="size-3.5 text-slate-700 dark:text-slate-200 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </Button>
  )
}

export default HeaderThemeToggle
