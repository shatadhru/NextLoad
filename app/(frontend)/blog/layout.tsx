import React from 'react'
import { BlogHeader } from '@/components/blog/BlogHeader'
import { BlogFooter } from '@/components/blog/BlogFooter'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300">
      <BlogHeader />
      <div className="flex-1">{children}</div>
      <BlogFooter />
    </div>
  )
}
