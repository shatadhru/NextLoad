import type { GlobalConfig } from "payload"

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings & Branding",
  admin: {
    group: "Settings",
    description: "Manage brand identity, upload custom logo, and update site titles.",
  },
  access: {
    read: () => true,
    update: ({ req }) => {
      if (!req.user) return false
      return (req.user as { role?: string })?.role === "admin"
    },
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      label: "Brand / Site Name",
      defaultValue: "Shatadhru",
      required: true,
      admin: {
        description: "The primary brand name displayed across header, sidebar, and emails.",
      },
    },
    {
      name: "siteTitle",
      type: "text",
      label: "Site Title / Tagline",
      defaultValue: "Shatadhru Acharjee",
      admin: {
        description: "Displayed on the home page and in browser title tabs.",
      },
    },
    {
      name: "siteDescription",
      type: "textarea",
      label: "Site Description",
      defaultValue: "Enterprise-grade full-stack web application with Next.js 16, Payload CMS 3.0, and Better Auth.",
      admin: {
        description: "Primary metadata description for SEO and social sharing.",
      },
    },
    {
      name: "logoText",
      type: "text",
      label: "Logo Badge Initials",
      defaultValue: "SH",
      admin: {
        description: "Initials displayed in the brand badge when no image logo is uploaded (e.g. NL).",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Brand Logo Image",
      admin: {
        description: "Upload your custom brand logo. When empty, defaults to normal NextLoad badge.",
      },
    },
    {
      name: "logoDark",
      type: "upload",
      relationTo: "media",
      label: "Dark Mode Logo (Optional)",
      admin: {
        description: "Optional logo version specifically tailored for dark mode.",
      },
    },
    {
      name: "favicon",
      type: "upload",
      relationTo: "media",
      label: "Custom Favicon (Optional)",
      admin: {
        description: "Upload a square icon for the browser tab favicon.",
      },
    },
  ],
}

export default SiteSettings
