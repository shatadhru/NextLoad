"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
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
  Zap,
  Palette,
  Server,
  Lock,
  ShoppingBag,
  Sparkles,
  Cpu,
  Globe,
  Bell,
  Sliders,
  Check,
  Copy,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Header } from "@/components/basic/header"
import { Footer } from "@/components/basic/footer"
import { NewsletterForm } from "@/components/basic/footer/NewsletterForm"

export default function HomePage() {
  const [copiedCmd, setCopiedCmd] = useState(false)

  const copyCommand = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText("pnpm install && pnpm dev")
      setCopiedCmd(true)
      setTimeout(() => setCopiedCmd(false), 2000)
    }
  }

  const stackPills = [
    { label: "Next.js 16.3 (Turbopack)", icon: Zap, color: "text-amber-500" },
    { label: "Payload CMS 3.90 Native", icon: Database, color: "text-primary" },
    { label: "Better Auth + RBAC", icon: ShieldCheck, color: "text-blue-500" },
    { label: "Tailwind CSS v4", icon: Code2, color: "text-sky-500" },
    { label: "shadcn/ui Primitives", icon: Layers, color: "text-purple-500" },
    { label: "Redis / In-Memory Cache", icon: Cpu, color: "text-rose-500" },
    { label: "Cloudinary Global CDN", icon: HardDrive, color: "text-emerald-500" },
    { label: "Hostinger SMTP Relay", icon: Mail, color: "text-teal-500" },
  ]

  const featureTabs = [
    {
      id: "auth",
      label: "Auth & Identity",
      icon: ShieldCheck,
      title: "Enterprise Better-Auth & Session Engine",
      badge: "Production Ready",
      description:
        "Bulletproof identity infrastructure with HTTP-only cookies, salted password hashing, Google OAuth 2.0, multi-tenant RBAC (admin vs user), and automated 4-step password recovery.",
      highlights: [
        "Encrypted HTTP-only 30-day session cookies",
        "Role-based privilege escalation protection in MongoDB",
        "4-step secure password recovery wizard (/auth/forget)",
        "Google OAuth & Email/Password unified accounts",
        "Avatar uploads with 5MB cap, mime whitelist, and signed Cloudinary transforms",
      ],
      linkText: "View Auth Login",
      linkHref: "/auth/login",
    },
    {
      id: "cms",
      label: "Payload 3 CMS",
      icon: Database,
      title: "Embedded Headless CMS directly in Next.js",
      badge: "Zero-Latency",
      description:
        "No separate backend server. Payload CMS 3.0 runs directly inside Next.js App Router, sharing MongoDB connection pools and delivering native typed interfaces via Mongoose.",
      highlights: [
        "Embedded at /admin with responsive, mobile-first control views",
        "Automated Lexical rich text editor with markdown import/export",
        "Dynamic collections: Users, Banners, Blog, Orders, Newsletter, Media",
        "Global SiteSettings with live preview sandboxes",
        "Automated TypeScript definition generation (pnpm generate:types)",
      ],
      linkText: "Open Admin Panel",
      linkHref: "/admin",
    },
    {
      id: "theme",
      label: "shadcn Theming",
      icon: Palette,
      title: "Dynamic 10-Preset Color & Radius System",
      badge: "Real-Time Control",
      description:
        "Full control over visual branding directly from the Admin Panel. Choose from 10 shadcn presets (Zinc, Blue, Slate, Rose, Green, etc.) or set custom hex overrides for both Light and Dark modes.",
      highlights: [
        "10 Predefined shadcn palettes + custom HEX overrides",
        "Independent Light Mode and Dark Mode color customization",
        "Dynamic Border Radius controls (None, XS, SM, MD, Default, LG, XL, 2XL)",
        "Scoped stylesheet injection avoiding specificity bugs with .dark",
        "Live interactive sandbox right inside Payload Admin (/admin)",
      ],
      linkText: "Explore Dashboard Theme",
      linkHref: "/dashboard",
    },
    {
      id: "cache",
      label: "Hybrid Caching",
      icon: Cpu,
      title: "5-Hour Client Deduplication & Auto Redis Engine",
      badge: "100K Concurrent Safe",
      description:
        "Engineered to effortlessly sustain 100K+ visitors without MongoDB connection pool exhaustion. Combines 5-hour client-side deduplication, HTTP Cache-Control headers, and auto-detect Redis.",
      highlights: [
        "Automatic Redis fallback to in-memory cache if REDIS_URL is absent",
        "5-Hour localStorage & in-memory client deduplication (0ms repeat visits)",
        "HTTP Cache-Control: max-age=18000, stale-while-revalidate=36000",
        "Active banner & cookie consent cached with automatic purge hooks",
        "0% CPU overhead, 0 server crashes, 100% database protection",
      ],
      linkText: "Inspect Architecture",
      linkHref: "/admin/readme",
    },
    {
      id: "security",
      label: "Content Security",
      icon: Lock,
      title: "Admin-Controlled DevTools & Anti-Scraping Guards",
      badge: "Configurable",
      description:
        "Protect intellectual property, styling, and assets from casual ripping. Fully toggled from Site Settings in the Admin Panel with intelligent bypass for authenticated administrators.",
      highlights: [
        "Blocks F12, Ctrl+Shift+I/J/C, Cmd+Option+I, and Ctrl+U (View Source)",
        "Disables Right-Click inspection on public pages",
        "Intelligently preserves native right-click inside form inputs & textareas",
        "Logged-in administrators are exempt (zero debugging friction)",
        "0% CPU overhead with pure passive browser event listeners",
      ],
      linkText: "Configure in Admin",
      linkHref: "/admin/globals/site-settings",
    },
    {
      id: "ecommerce",
      label: "Store & Cart",
      icon: ShoppingBag,
      title: "Native E-Commerce Plugin with Slide-Over Cart",
      badge: "High Conversion",
      description:
        "Seamless shopping flow powered by @payloadcms/plugin-ecommerce. Features slide-over drawer cart, multi-currency support (BDT, USD), and verified payment gateway badges.",
      highlights: [
        "Slide-over Cart Drawer accessible from header & mobile drawer",
        "Multi-currency support with real-time formatters (৳ BDT, $ USD)",
        "Supported payment badges (Visa, Mastercard, Amex, PayPal, bKash, Nagad)",
        "Server-side checkout session creation and order management",
        "Cart synchronization across tabs using local storage",
      ],
      linkText: "Browse Articles & Store",
      linkHref: "/blog",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Main Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-muted/80 border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
            <Sparkles className="size-3.5 text-primary animate-pulse" />
            <span>Next.js 16 + Payload 3.0 + Better Auth + Pure shadcn/ui</span>
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">v1.1</Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            The Enterprise{" "}
            <span className="text-primary bg-clip-text">
              Full-Stack
            </span>{" "}
            Platform
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Engineered for developers who demand clean architecture, bulletproof security, and blazing performance. Featuring embedded Payload CMS, Better-Auth identity, Cloudinary CDN, and high-concurrency hybrid caching.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "flex items-center gap-2 font-semibold shadow-md shadow-primary/25 text-sm rounded-xl h-11 px-5"
              )}
            >
              <LayoutDashboard className="size-4" />
              <span>User Dashboard</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "flex items-center gap-2 font-semibold text-sm rounded-xl h-11 px-5 border-border/80 bg-background/80 hover:bg-muted/80"
              )}
            >
              <Database className="size-4 text-primary" />
              <span>Payload CMS Admin</span>
              <ExternalLink className="size-3.5 opacity-60" />
            </Link>

            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "flex items-center gap-2 font-semibold text-sm text-muted-foreground hover:text-foreground rounded-xl h-11 px-4"
              )}
            >
              <BookOpen className="size-4" />
              <span>Blog & Articles</span>
            </Link>
          </div>

          {/* Tech Stack Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {stackPills.map((pill, idx) => {
              const Icon = pill.icon
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-muted/50 border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shadow-2xs"
                >
                  <Icon className={cn("size-3.5", pill.color)} />
                  <span>{pill.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Feature Deep Dive (shadcn Tabs) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 mb-10">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold border-primary/30 text-primary">
            Architecture Blueprint
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Every Feature Included. Zero Compromises.
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Switch tabs below to inspect how each core layer is structured with type-safety and enterprise robustness.
          </p>
        </div>

        <Tabs defaultValue="auth" className="w-full space-y-6">
          {/* Scrollable Tabs Header */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="h-11 p-1 bg-muted/80 border border-border/80 rounded-xl inline-flex w-max sm:w-full sm:grid sm:grid-cols-6 gap-1">
              {featureTabs.map((tab) => {
                const TabIcon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
                  >
                    <TabIcon className="size-3.5 text-primary" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* Tab Contents */}
          {featureTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="focus-visible:outline-none">
              <Card className="border border-border/80 bg-card shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="p-6 sm:p-8 border-b bg-muted/20">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {tab.badge}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      Module: @/components/basic/{tab.id}
                    </span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                    {tab.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
                    {tab.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 sm:p-8 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Engineered Capabilities:
                  </h4>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {tab.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90 leading-relaxed">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-4 sm:p-6 bg-muted/10 border-t flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Native integration with Next.js 16 App Router & MongoDB
                  </span>
                  <Link
                    href={tab.linkHref}
                    className={cn(buttonVariants({ variant: "default", size: "sm" }), "text-xs font-semibold rounded-lg")}
                  >
                    <span>{tab.linkText}</span>
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Live Pure shadcn UI Showcase Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 mb-10">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold border-primary/30 text-primary">
            Design System
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Built with 100% Pure shadcn/ui Components
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Zero third-party bloated CSS. Styled with tailored tokens, Radix UI accessibility primitives, and sleek micro-animations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Buttons & States */}
          <Card className="border border-border/80 rounded-2xl shadow-xs">
            <CardHeader className="p-5 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sliders className="size-4 text-primary" />
                <span>Button Variants</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Theme-aware buttons with active hover states
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">Secondary</Button>
                <Button size="sm" variant="outline">Outline</Button>
                <Button size="sm" variant="ghost">Ghost</Button>
                <Button size="sm" variant="destructive">Destructive</Button>
              </div>
              <Separator />
              <p className="text-[11px] text-muted-foreground">
                Follows active theme preset colors and custom radius tokens automatically.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Badges & Indicators */}
          <Card className="border border-border/80 rounded-2xl shadow-xs">
            <CardHeader className="p-5 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bell className="size-4 text-primary" />
                <span>Badges & Telemetry</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Status indicators and pill metadata tags
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-medium text-foreground">Status: Operational (100% Uptime)</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Live Theme Sandbox */}
          <Card className="border border-border/80 rounded-2xl shadow-xs">
            <CardHeader className="p-5 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Palette className="size-4 text-primary" />
                <span>Live Theme Engine</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Controlled directly from Payload Admin
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {["#18181b", "#2563eb", "#16a34a", "#e11d48", "#ea580c", "#7c3aed"].map((color) => (
                  <div
                    key={color}
                    style={{ backgroundColor: color }}
                    className="size-5 rounded-md border border-black/10 shadow-2xs"
                    title={color}
                  />
                ))}
              </div>
              <Separator />
              <p className="text-[11px] text-muted-foreground">
                Injected via scoped &lt;style id=&quot;admin-theme-styles&quot;&gt; tags for native CSS specificity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Start Terminal Box */}
      <section className="py-10 px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <Card className="border border-border/80 bg-card rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="p-5 sm:p-6 border-b bg-muted/30 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-primary" />
              <CardTitle className="text-sm font-bold">Quick Start Developer Setup</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCommand}
              className="h-7 text-xs font-mono gap-1.5 rounded-lg"
            >
              {copiedCmd ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              <span>{copiedCmd ? "Copied!" : "Copy"}</span>
            </Button>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-muted/60 border border-border/60 space-y-2 text-foreground/90 overflow-x-auto">
              <div><span className="text-primary font-bold"># 1. Clone & install dependencies</span></div>
              <div>pnpm install</div>
              <div className="pt-1"><span className="text-primary font-bold"># 2. Configure environment</span></div>
              <div>cp .env.example .env</div>
              <div className="pt-1"><span className="text-primary font-bold"># 3. Start high-performance dev server</span></div>
              <div>pnpm dev</div>
            </div>
            <p className="text-xs text-muted-foreground font-sans">
              Payload CMS Admin runs seamlessly at <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px]">/admin</code> alongside your Next.js application.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto w-full text-center">
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs space-y-4">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <Mail className="size-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Stay Updated on NextLoad Releases</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Subscribe to receive architectural updates, performance benchmarks, and newly released enterprise features.
          </p>
          <div className="max-w-md mx-auto pt-2">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer className="mt-auto" />
    </div>
  )
}
