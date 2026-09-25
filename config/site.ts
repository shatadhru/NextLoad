/**
 * Centralized Site & Branding Configuration
 *
 * Single source of truth for site name, titles, descriptions, and page titles.
 * Modify values here to safely update the entire application.
 * Visual branding (logo/favicon URLs) is managed by Cloudinary via config/brandTheme.ts.
 */

export const SiteConfig = {
  site: {
    name: "Ismail Bhaiya",
    title: "Shatadhru Acharjee",
    description: "Enterprise-grade full-stack web application with Next.js 16, Payload CMS 3.0, and Better Auth.",
    url: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
    logoText: "SH",
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
      default: "Shatadhru",
      template: "%s | Shatadhru",
    },
    description: "A production-ready web application template integrating Next.js 16 with Payload CMS 3.0, Better Auth, and MongoDB.",
    keywords: ["Next.js", "Payload CMS", "Better Auth", "MongoDB", "Cloudinary", "SMTP"],
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