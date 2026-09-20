import {
  LayoutDashboard,
  Files,
  Clock,
  Bell,
  Settings,
  User,
  LifeBuoy,
  Database,
  Users,
  Mail,
  BarChart3,
  Code2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import { SiteConfig } from "./site"

export interface Workspace {
  id: string
  name: string
  plan: string
  initials: string
  avatar: string
}

export interface SidebarNavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
  isActive?: boolean
  adminOnly?: boolean
}

export interface SidebarProject {
  id: string
  name: string
  href: string
  icon?: LucideIcon
  description?: string
  adminOnly?: boolean
}

export interface DashboardStat {
  id: string
  label: string
  value: string
  change?: string
  trend?: "up" | "down" | "neutral"
  adminOnly?: boolean
}

export interface DashboardActivity {
  id: string
  title: string
  category: string
  time: string
  status: "success" | "warning" | "error" | "info"
  adminOnly?: boolean
}

export interface SidebarConfig {
  brand: {
    name: string
    subtext: string
    logoText: string
  }
  workspaces: Workspace[]
  userNavItems: SidebarNavItem[]
  adminNavItems: SidebarNavItem[]
  quickLinks: SidebarProject[]
  userStats: DashboardStat[]
  adminStats: DashboardStat[]
  recentActivities: DashboardActivity[]
}

export const sidebarConfig: SidebarConfig = {
  brand: {
    name: SiteConfig.site.name,
    subtext: "User Portal",
    logoText: SiteConfig.site.logoText,
  },
  workspaces: [
    {
      id: "personal",
      name: "Personal Workspace",
      plan: "Free",
      initials: "PW",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    },
   
  ],
  // Navigation for all normal users
  userNavItems: [
    {
      id: "overview",
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      id: "activity",
      label: "Activity",
      href: "/dashboard/activity",
      icon: Clock,
    },
    {
      id: "notifications",
      label: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      badge: 2,
    },
    {
      id: "profile",
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      id: "settings",
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  
  ],
  // Extra options for ADMIN users ONLY
  adminNavItems: [
    {
      id: "cms-admin",
      label: "Payload CMS",
      href: "/admin",
      icon: Database,
      badge: "Admin",
      adminOnly: true,
    },
    {
      id: "admin-users",
      label: "User Management",
      href: "/dashboard/users",
      icon: Users,
      adminOnly: true,
    },
    {
      id: "admin-emails",
      label: "Email Delivery",
      href: "/dashboard/emails",
      icon: Mail,
      badge: 3,
      adminOnly: true,
    },
    {
      id: "admin-analytics",
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      adminOnly: true,
    },
    {
      id: "admin-graphql",
      label: "API & GraphQL",
      href: "/api/graphql-playground",
      icon: Code2,
      adminOnly: true,
    },
  ],
  quickLinks: [
    {
      id: "settings-link",
      name: "Account Settings",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Manage profile and password",
    },
    {
      id: "support-link",
      name: "Help Center",
      href: "/dashboard/support",
      icon: LifeBuoy,
      description: "Guides and FAQs",
    },
    {
      id: "cms-link",
      name: "Payload CMS Admin",
      href: "/admin",
      icon: Database,
      description: "Manage CMS content and collections",
      adminOnly: true,
    },
    {
      id: "graphql-link",
      name: "GraphQL Playground",
      href: "/api/graphql-playground",
      icon: Code2,
      description: "Interactive API explorer",
      adminOnly: true,
    },
  ],
  userStats: [
    {
      id: "files",
      label: "Stored Files",
      value: "28",
      change: "+4 uploaded this week",
      trend: "up",
    },
    {
      id: "storage",
      label: "Storage Used",
      value: "1.2 GB / 5 GB",
      change: "24% capacity",
      trend: "neutral",
    },
    {
      id: "plan",
      label: "Plan Status",
      value: "Standard",
      change: "Active membership",
      trend: "up",
    },
  ],
  adminStats: [
    {
      id: "sessions",
      label: "Total Platform Users",
      value: "1,284",
      change: "+12% this week",
      trend: "up",
      adminOnly: true,
    },
    {
      id: "database",
      label: "MongoDB Cluster",
      value: "Healthy",
      change: "18ms latency",
      trend: "up",
      adminOnly: true,
    },
    {
      id: "emails",
      label: "Emails Sent",
      value: "99.8%",
      change: "248 sent today",
      trend: "up",
      adminOnly: true,
    },
  ],
  recentActivities: [],
}
