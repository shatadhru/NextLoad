import type { Metadata } from 'next'
import { getPageTitle, SiteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: getPageTitle('files'),
  description: `Manage and optimize media assets on ${SiteConfig.site.name}.`,
}

export default function FilesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
