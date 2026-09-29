'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { AuthTopNav } from '@/components/auth/AuthTopNav'
import { ShieldCheck, FileText, ArrowRight } from 'lucide-react'

interface LegalPageContentProps {
  type: 'privacy' | 'terms'
  defaultTitle: string
  defaultLastUpdated: string
  defaultContent: string
}

export function LegalPageContent({
  type,
  defaultTitle,
  defaultLastUpdated,
  defaultContent,
}: LegalPageContentProps) {
  const [title, setTitle] = useState(defaultTitle)
  const [lastUpdated, setLastUpdated] = useState(defaultLastUpdated)
  const [content, setContent] = useState(defaultContent)

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (!data?.legal) return
        if (type === 'privacy') {
          if (data.legal.privacyTitle) setTitle(data.legal.privacyTitle)
          if (data.legal.privacyLastUpdated) setLastUpdated(data.legal.privacyLastUpdated)
          if (data.legal.privacyContent) setContent(data.legal.privacyContent)
        } else {
          if (data.legal.termsTitle) setTitle(data.legal.termsTitle)
          if (data.legal.termsLastUpdated) setLastUpdated(data.legal.termsLastUpdated)
          if (data.legal.termsContent) setContent(data.legal.termsContent)
        }
      })
      .catch(() => {})
  }, [type])

  // Parse markdown-style sections (## Heading, paragraphs)
  const renderFormattedContent = (rawText: string) => {
    const blocks = rawText.split('\n\n').filter(Boolean)

    return blocks.map((block, idx) => {
      const trimmed = block.trim()
      if (trimmed.startsWith('## ')) {
        const headingText = trimmed.replace(/^##\s+/, '')
        return (
          <h2
            key={idx}
            className="text-lg sm:text-xl font-bold text-foreground mt-8 mb-3 pt-4 border-t border-border/50 first:mt-0 first:pt-0 first:border-0"
          >
            {headingText}
          </h2>
        )
      }

      if (trimmed.startsWith('# ')) {
        const headingText = trimmed.replace(/^#\s+/, '')
        return (
          <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-foreground mt-6 mb-4">
            {headingText}
          </h1>
        )
      }

      return (
        <p key={idx} className="text-sm sm:text-base leading-relaxed text-muted-foreground my-3">
          {trimmed}
        </p>
      )
    })
  }

  const isPrivacy = type === 'privacy'

  return (
    <div className="min-h-svh flex flex-col bg-muted p-4 sm:p-6 md:p-10 relative">
      <AuthTopNav backHref="/auth/login" />

      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto py-12">
        {/* Top Header Card */}
        <div className="w-full flex flex-col items-center text-center space-y-4 mb-8">
          <Logo href="/" size="lg" align="center" />

          {/* Quick tab switcher between Privacy and Terms */}
          <div className="inline-flex items-center rounded-lg bg-background/80 p-1 border border-border shadow-2xs text-xs">
            <Link
              href="/auth/privacy"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                isPrivacy
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShieldCheck className="size-3.5" />
              <span>Privacy Policy</span>
            </Link>
            <Link
              href="/auth/terms"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                !isPrivacy
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="size-3.5" />
              <span>Terms of Service</span>
            </Link>
          </div>
        </div>

        {/* Legal Document Card */}
        <div className="w-full rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b pb-4 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground">
              Last updated: <span className="font-semibold text-foreground/80">{lastUpdated}</span>
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {renderFormattedContent(content)}
          </div>

      
        </div>
      </main>
    </div>
  )
}

export default LegalPageContent
