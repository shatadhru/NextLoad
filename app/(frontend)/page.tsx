"use client"

import React from "react"
import Link from "next/link"
import { authClient } from "@/payload/auth/client"
import {
  Sparkles,
  ArrowRight,
  Database,
  ShieldCheck,
  HardDrive,
  Mail,
  Layers,
  Code2,
  ExternalLink,
  CheckCircle2,
  Terminal,
  BookOpen,
  LayoutDashboard,
  User,
  LogIn,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/Logo"
import { SiteConfig } from "@/config/site"

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const isAdmin = (user as { role?: string } | undefined)?.role === "admin"

  const features = [
    {
      icon: Database,
      color: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
      title: "Payload CMS 3.0 Native",
      description:
        "Embedded directly within the Next.js 16 App Router, backed by MongoDB via Mongoose, Lexical rich text, and Sharp image processing.",
    },
    {
      icon: ShieldCheck,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
      title: "Better Auth Identity",
      description:
        "Email/password authentication, Google OAuth 2.0, account linking, 4-step password recovery wizard, and 30-day session security.",
    },
    {
      icon: HardDrive,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
      title: "Cloudinary CDN Storage",
      description:
        "Automated media optimization, face-centered avatar cropping, responsive format selection, and fast global CDN asset delivery.",
    },
    {
      icon: Mail,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: "Hostinger SMTP Relay",
      description:
        "Transactional email engine with responsive branded HTML templates, development console simulation, and Payload CMS adapter.",
    },
    {
      icon: Layers,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: "Custom Admin Tools",
      description:
        "Dynamic admin views including Notification Broadcast Center, Platform Analytics, Cloudinary Manager, and Email Delivery Logs.",
    },
    {
      icon: Code2,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
      title: "Tailwind v4 & Shadcn UI",
      description:
        "Modern styling with Tailwind CSS v4, OKLCH color palettes, dark mode support, and Radix UI + Base UI component primitives.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo href="/" size="md" />
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              v1.0 Production
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5 text-xs font-semibold")}
                >
                  <LayoutDashboard className="size-3.5" />
                  <span>Dashboard</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    target="_blank"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:flex items-center gap-1.5 text-xs")}
                  >
                    <Database className="size-3.5 text-teal-600" />
                    <span>Payload CMS</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs font-semibold")}
                >
                  <LogIn className="size-3.5 mr-1" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth/signup"
                  className={cn(buttonVariants({ size: "sm" }), "text-xs font-semibold")}
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-muted border border-border shadow-xs">
            <Sparkles className="size-3.5 text-teal-600 dark:text-teal-400" />
            <span>Next.js 16 + Payload CMS 3.0 + Better Auth</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            The Production-Ready{" "}
            <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Full-Stack
            </span>{" "}
            Boilerplate
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Engineered for developers who value performance and clean architecture. Complete with embedded Payload CMS, Better Auth multi-provider sessions, Cloudinary media CDN, and Hostinger SMTP delivery.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "flex items-center gap-2 font-semibold shadow-md shadow-primary/20 text-sm"
              )}
            >
              <LayoutDashboard className="size-4" />
              <span>Explore Dashboard</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "flex items-center gap-2 font-semibold text-sm"
              )}
            >
              <Database className="size-4 text-teal-600 dark:text-teal-400" />
              <span>Payload CMS Admin</span>
              <ExternalLink className="size-3.5 opacity-60" />
            </Link>

            <Link
              href="/admin/readme"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "flex items-center gap-2 font-semibold text-sm text-muted-foreground"
              )}
            >
              <BookOpen className="size-4" />
              <span>Read Documentation</span>
            </Link>
          </div>

          {/* Quick Telemetry Pills */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>MongoDB Connected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Better Auth 30-Day Sessions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Cloudinary CDN Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Hostinger SMTP Relay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Everything Built-in. Zero Guesswork.</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Every layer of this application is pre-configured with industry best practices and type-safe interfaces.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className="rounded-2xl border bg-card p-6 space-y-3 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div className={cn("size-10 rounded-xl flex items-center justify-center border", feat.color)}>
                  <Icon className="size-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick Start Terminal Box */}
      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-sm">Quick Start in 3 Commands</h3>
            </div>
            <span className="text-[11px] text-muted-foreground">Node.js 18+ & pnpm</span>
          </div>

          <div className="p-4 rounded-xl bg-muted/60 font-mono text-xs text-foreground/90 space-y-1.5 overflow-x-auto border">
            <div><span className="text-teal-600 dark:text-teal-400 font-bold">$</span> cp .env.example .env</div>
            <div><span className="text-teal-600 dark:text-teal-400 font-bold">$</span> pnpm install</div>
            <div><span className="text-teal-600 dark:text-teal-400 font-bold">$</span> pnpm dev</div>
          </div>

          <p className="text-xs text-muted-foreground">
            Configure your <code className="px-1 py-0.5 rounded bg-muted font-mono">DATABASE_URL</code> and <code className="px-1 py-0.5 rounded bg-muted font-mono">PAYLOAD_SECRET</code> in <code className="px-1 py-0.5 rounded bg-muted font-mono">.env</code> to start developing immediately.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8 px-4 sm:px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{SiteConfig.site.name}</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">
              Payload CMS
            </Link>
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard/support" className="hover:text-foreground transition-colors">
              Support
            </Link>
            <Link href="/admin/readme" className="hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
