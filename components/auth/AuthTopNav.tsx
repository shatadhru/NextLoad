"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthTopNavProps {
  /** Optional fallback URL if there is no browser history */
  backHref?: string
}

export function AuthTopNav({ backHref = "/" }: AuthTopNavProps) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push(backHref)
    }
  }

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between p-4 sm:p-6 pointer-events-none">
      {/* Small Back Button on the Left */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="pointer-events-auto h-8 px-2.5 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-background/80 hover:bg-background backdrop-blur-md border border-border/50 shadow-xs rounded-lg transition-all"
        aria-label="Go back"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back</span>
      </Button>

      {/* Theme Switch Icon on the Right */}
      <div className="pointer-events-auto">
        {mounted ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground bg-background/80 hover:bg-background backdrop-blur-md border border-border/50 shadow-xs transition-all"
            aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4 text-amber-500 transition-transform duration-200 hover:rotate-12" />
            ) : (
              <Moon className="size-4 text-slate-700 dark:text-slate-200 transition-transform duration-200 -rotate-12 hover:rotate-0" />
            )}
          </Button>
        ) : (
          <div className="size-8 rounded-lg bg-background/80 border border-border/50 backdrop-blur-md" />
        )}
      </div>
    </div>
  )
}

export default AuthTopNav
