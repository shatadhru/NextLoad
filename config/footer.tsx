import React from 'react'
import {
  BookOpen,
  Code2,
  Database,
  FileText,
  Globe,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Lock,
  Mail,
  Newspaper,
  Shield,
  Zap,
} from 'lucide-react'

export interface FooterMenuItem {
  title: string
  href: string
  icon?: any
  badge?: string
  external?: boolean
}

export interface FooterMenuColumn {
  title: string
  items: FooterMenuItem[]
}

export interface SocialLinkConfig {
  platform: string
  url: string
  name: string
  enabled?: boolean
}

export interface FooterConfig {
  columns: FooterMenuColumn[]
  socials: SocialLinkConfig[]
}

export const footerConfig: FooterConfig = {
  columns: [
    {
      title: 'Platform',
      items: [
        { title: 'Home', href: '/', icon: Globe },
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Payload CMS', href: '/admin', icon: Database, badge: 'v3.0', external: true },
        { title: 'API Documentation', href: '/admin/views/api-reference', icon: Code2, external: true },
      ],
    },
    {
      title: 'Resources',
      items: [
        { title: 'Blog & Articles', href: '/blog', icon: Newspaper, badge: 'New' },
        { title: 'Engineering Guides', href: '/blog/category/engineering', icon: Layers },
        { title: 'Cloud & DevOps', href: '/blog/category/cloud-devops', icon: Zap },
        { title: 'System Architecture', href: '/blog', icon: BookOpen },
      ],
    },
    {
      title: 'Security & Legal',
      items: [
        { title: 'Privacy Policy', href: '/auth/privacy', icon: Shield },
        { title: 'Terms of Service', href: '/auth/terms', icon: FileText },
        { title: 'Cookie Policy', href: '/cookies', icon: Lock },
        { title: 'Security Center', href: '/security', icon: HelpCircle },
      ],
    },
  ],
  socials: [
    { platform: 'github', url: 'https://github.com', name: 'GitHub', enabled: true },
    { platform: 'x', url: 'https://x.com', name: 'X / Twitter', enabled: true },
    { platform: 'linkedin', url: 'https://linkedin.com', name: 'LinkedIn', enabled: true },
    { platform: 'youtube', url: 'https://youtube.com', name: 'YouTube', enabled: true },
    { platform: 'discord', url: 'https://discord.com', name: 'Discord', enabled: true },
  ],
}

export default footerConfig
