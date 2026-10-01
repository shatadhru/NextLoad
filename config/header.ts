import {
  Home,
  Newspaper,
  LayoutDashboard,
  Database,
  Code2,
  BookOpen,
  Layers,
  Zap,
  ShieldCheck,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'

export interface HeaderNavItem {
  id: string
  title: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'teal'
  description?: string
  external?: boolean
  children?: HeaderNavItem[]
  requiresAuth?: boolean
  adminOnly?: boolean
}

export interface HeaderActionConfig {
  showCart?: boolean
  showThemeToggle?: boolean
  showAuth?: boolean
}

export interface HeaderAuthConfig {
  loginUrl: string
  signupUrl: string
  dashboardUrl: string
  profileUrl: string
  notificationsUrl: string
  adminUrl: string
}

export interface HeaderBrandConfig {
  showBadge?: boolean
  badgeText?: string
  badgeHref?: string
}

export interface HeaderConfig {
  brand: HeaderBrandConfig
  nav: HeaderNavItem[]
  actions: HeaderActionConfig
  auth: HeaderAuthConfig
}

export const headerConfig: HeaderConfig = {
  brand: {
    showBadge: false,
    badgeText: '',
    badgeHref: '/blog',
  },
  nav: [
    {
      id: 'home',
      title: 'Home',
      href: '/',
      icon: Home,
    },
    {
      id: 'blog',
      title: 'Blog',
      href: '/blog',
      icon: Newspaper,
      badge: 'New',
      badgeVariant: 'teal',
    },
    {
      id: 'platform',
      title: 'Platform',
      href: '/dashboard',
      icon: Layers,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          description: 'Access analytics, files, team, and activity logs.',
        },
        {
          id: 'cms',
          title: 'Payload CMS',
          href: '/admin',
          icon: Database,
          badge: 'v3.0',
          badgeVariant: 'teal',
          external: true,
          description: 'Production-ready headless CMS & content engine.',
        },
        {
          id: 'api-docs',
          title: 'API Reference',
          href: '/admin/views/api-reference',
          icon: Code2,
          external: true,
          description: 'REST and GraphQL endpoint documentation.',
        },
        {
          id: 'system',
          title: 'Architecture',
          href: '/blog',
          icon: Zap,
          description: 'Deep dive into stack design and performance tuning.',
        },
      ],
    },
    {
      id: 'resources',
      title: 'Resources',
      href: '/blog',
      icon: BookOpen,
      children: [
        {
          id: 'guides',
          title: 'Engineering Guides',
          href: '/blog/category/engineering',
          icon: BookOpen,
          description: 'Tutorials on Next.js 16, Payload, and Better Auth.',
        },
        {
          id: 'cloud',
          title: 'Cloud & CDN',
          href: '/blog/category/cloud-devops',
          icon: Zap,
          description: 'Cloudinary CDN and MongoDB connection setup.',
        },
        {
          id: 'legal',
          title: 'Security & Terms',
          href: '/auth/terms',
          icon: ShieldCheck,
          description: 'Privacy policy, cookies, and platform governance.',
        },
        {
          id: 'support',
          title: 'Help & FAQ',
          href: '/security',
          icon: HelpCircle,
          description: 'Frequently asked questions and support links.',
        },
      ],
    },
  ],
  actions: {
    showCart: true,
    showThemeToggle: true,
    showAuth: true,
  },
  auth: {
    loginUrl: '/auth/login',
    signupUrl: '/auth/signup',
    dashboardUrl: '/dashboard',
    profileUrl: '/dashboard/settings',
    notificationsUrl: '/dashboard/notifications',
    adminUrl: '/admin',
  },
}

export default headerConfig
