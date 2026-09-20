"use client"

import React from "react"
import Link from "next/link"
import {
  LifeBuoy,
  Mail,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Settings,
  Shield,
  Server,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SupportPage() {
  const faqs = [
    {
      q: "Where is the Payload CMS Admin Panel located?",
      a: "The Payload CMS Admin Panel is accessible at /admin. Users with the 'admin' role can log in using their credentials to manage collections, upload media, inspect email logs, and dispatch broadcasts.",
    },
    {
      q: "How does the authentication system work?",
      a: "NextLoad uses Better Auth backed by Payload CMS data adapters. It supports email & password credentials, Google OAuth 2.0, password reset wizards, and 30-day session persistence.",
    },
    {
      q: "How does Cloudinary media storage integrate with Payload?",
      a: "Media uploads are automatically processed via payload-cloudinary and sharp, delivering optimized assets through the Cloudinary CDN with automatic face cropping and format selection.",
    },
    {
      q: "How do in-app and email notifications work?",
      a: "Admins can send broadcasts via /admin/notifications. In-app notifications appear immediately in the header bell dropdown and notifications page, while email notifications are delivered via Hostinger SMTP.",
    },
    {
      q: "How do I change my password or profile information?",
      a: "Visit /dashboard/settings or /dashboard/profile. You can update your display name, upload a new avatar, or change your password under the Security section.",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="size-6 text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Documentation, platform FAQs, and direct developer support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/readme"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-1.5 text-xs")}
          >
            <BookOpen className="size-3.5" />
            <span>Architecture Docs</span>
          </Link>
          <a
            href="mailto:support@mrtripy.com"
            className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5 text-xs")}
          >
            <Mail className="size-3.5" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="rounded-xl border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Server className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">NextLoad Platform Status</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="size-3" />
                All Systems Operational
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              MongoDB, Better Auth Sessions, Hostinger SMTP Relay & Cloudinary CDN active.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/settings"
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>System Settings</span>
          <ExternalLink className="size-3" />
        </Link>
      </div>

      {/* Support Channels Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <div className="size-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Mail className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Email Support Desk</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Have technical questions or need assistance with your deployment? Reach out to our team directly.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="mailto:support@mrtripy.com"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>support@mrtripy.com</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-3">
          <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Developer Documentation</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Learn how Next.js 16, Payload CMS 3.0, and Better Auth work together in this unified boilerplate.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/readme"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View ReadMe & Guides</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border bg-card p-4 space-y-1.5 shadow-xs">
              <h3 className="font-semibold text-sm text-foreground">{faq.q}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
