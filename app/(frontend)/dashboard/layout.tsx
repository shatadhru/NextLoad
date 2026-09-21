import React from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerSession } from '@delmaredigital/payload-better-auth'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { getPageTitle, SiteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: getPageTitle('dashboard'),
  description: SiteConfig.site.description,
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const payload = await getPayload({ config })
  const session = await getServerSession(payload, headersList)

  if (!session?.user) {
    redirect('/auth/login')
  }

  return <DashboardShell>{children}</DashboardShell>
}
