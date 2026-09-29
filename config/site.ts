/**
 * Centralized Site & Branding Configuration
 *
 * Single source of truth for site name, titles, descriptions, and page titles.
 * Modify values here to safely update the entire application.
 * Visual branding (logo/favicon URLs) is managed by Cloudinary via config/brandTheme.ts.
 */

export const SiteConfig = {
  site: {
    name: "NEXT LOAD",
    title: "NEXT LOAD by Scalvio",
    company: "Scalvio",
    tagline: "by Scalvio",
    description: "Enterprise-grade full-stack boilerplate by Scalvio powered by Next.js 16, Payload CMS 3.0, and Better Auth.",
    url: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
    logoText: "NL",
  },

  pages: {
    dashboard: "Dashboard",
    profile: "Profile & Settings",
    settings: "Settings",
    activity: "Activity Log",
    notifications: "Notifications",
    files: "Files & Media",
    support: "Help & Support",
    login: "Sign In",
    signup: "Create Account",
    forget: "Reset Password",
  },

  seo: {
    title: {
      default: "NEXT LOAD by Scalvio",
      template: "%s | NEXT LOAD by Scalvio",
    },
    description: "A production-ready full-stack web application boilerplate by Scalvio integrating Next.js 16 with Payload CMS 3.0, Better Auth, and MongoDB.",
    keywords: ["Next.js", "Payload CMS", "Better Auth", "MongoDB", "Cloudinary", "Scalvio", "NextLoad"],
    image: "/og-image.png",
  },
}

/**
 * Type-safe helper to format a page title with the site name.
 * @param pageKey The key from SiteConfig.pages or a custom title string
 */
export function getPageTitle(pageKeyOrTitle: keyof typeof SiteConfig.pages | string): string {
  const pageTitle = (SiteConfig.pages as Record<string, string>)[pageKeyOrTitle] || pageKeyOrTitle
  return `${pageTitle} | ${SiteConfig.site.name}`
}

export default SiteConfig