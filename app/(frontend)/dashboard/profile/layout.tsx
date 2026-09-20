import React from 'react'
import type { Metadata } from 'next'
import { getPageTitle } from '@/config/site'

export const metadata: Metadata = {
  title: getPageTitle('profile'),
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
