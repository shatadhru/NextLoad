import React from 'react'
import type { Metadata } from 'next'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { getPageTitle, SiteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: getPageTitle('dashboard'),
  description: SiteConfig.site.description,
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}
