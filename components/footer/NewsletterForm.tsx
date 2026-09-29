'use client'

import React, { useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.success) {
        setIsSubscribed(true)
        toast.success(data.message || 'Subscribed successfully!')
      } else {
        toast.error(data.error || 'Failed to subscribe.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-teal-500/10 border border-teal-500/20 px-3.5 py-2.5 text-xs font-medium text-teal-600 dark:text-teal-400">
        <CheckCircle2 className="size-4 shrink-0" />
        <span>You are subscribed! Thank you.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative flex items-center">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          required
          disabled={isLoading}
          className="h-10 pr-24 rounded-full bg-background/90 border-border/80 text-xs focus-visible:ring-2 focus-visible:ring-teal-500"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading}
          className="absolute right-1 h-8 px-3 rounded-full text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-all cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <span>Join</span>
              <Send className="size-3 ml-1" />
            </>
          )}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground/80 leading-normal pl-2">
        Zero spam. Receive engineering insights & product updates.
      </p>
    </form>
  )
}

export default NewsletterForm
