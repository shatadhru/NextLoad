'use client'

import React, { useState } from 'react'
import { Link2, Check, Share2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ShareButtonsProps {
  title: string
  url: string
  className?: string
}

export function ShareButtons({ title, url, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch {
        // User cancelled
      }
    }
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="text-xs font-semibold text-muted-foreground mr-1 uppercase tracking-wider">
        Share:
      </span>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'h-8 px-2.5 rounded-full text-xs font-medium hover:bg-muted text-foreground transition-colors'
        )}
        title="Share on X"
      >
        <svg className="size-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>Post</span>
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'h-8 px-2.5 rounded-full text-xs font-medium hover:bg-muted text-foreground transition-colors'
        )}
        title="Share on LinkedIn"
      >
        <svg className="size-3.5 mr-1 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8V10.9M7.86 6.54a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
        </svg>
        <span>LinkedIn</span>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'h-8 px-2.5 rounded-full text-xs font-medium hover:bg-muted text-foreground transition-colors'
        )}
        title="Share on Facebook"
      >
        <svg className="size-3.5 mr-1 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
        <span>Share</span>
      </a>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={cn(
          buttonVariants({ variant: copied ? 'default' : 'outline', size: 'sm' }),
          'h-8 px-2.5 rounded-full text-xs font-medium transition-all',
          copied && 'bg-teal-600 hover:bg-teal-700 text-white'
        )}
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="size-3.5 mr-1" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="size-3.5 mr-1" />
            <span>Copy</span>
          </>
        )}
      </button>

      {/* Mobile Native Share */}
      <button
        type="button"
        onClick={handleNativeShare}
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'sm:hidden h-8 px-2.5 rounded-full text-xs font-medium'
        )}
        title="More share options"
      >
        <Share2 className="size-3.5" />
      </button>
    </div>
  )
}

export default ShareButtons
