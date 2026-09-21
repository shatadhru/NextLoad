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
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          const fs = await import("fs")
          const path = await import("path")

          const extractSecureUrl = async (field: any): Promise<string | null> => {
            if (!field) return null
            if (typeof field === "object") {
              return (
                field.cloudinary?.secure_url ||
                (typeof field.thumbnailURL === "string" && field.thumbnailURL.includes("res.cloudinary.com") ? field.thumbnailURL : null) ||
                (typeof field.url === "string" && field.url.includes("res.cloudinary.com") ? field.url : null) ||
                null
              )
            }
            if (typeof field === "string") {
              if (field.includes("res.cloudinary.com")) return field
              try {
                const mediaDoc = await req.payload.findByID({ collection: "media", id: field })
                return (
                  mediaDoc?.cloudinary?.secure_url ||
                  (typeof mediaDoc?.thumbnailURL === "string" && mediaDoc.thumbnailURL.includes("res.cloudinary.com") ? mediaDoc.thumbnailURL : null) ||
                  (typeof mediaDoc?.url === "string" && mediaDoc.url.includes("res.cloudinary.com") ? mediaDoc.url : null) ||
                  null
                )
              } catch {
                return null
              }
            }
            return null
          }

          const lightUrl = await extractSecureUrl(doc.logo)
          const darkUrl = await extractSecureUrl(doc.logoDark)
          const favUrl = await extractSecureUrl(doc.favicon)

          const filePath = path.resolve(process.cwd(), "config", "brand-settings.json")
          let current: any = {}
          if (fs.existsSync(filePath)) {
            try {
              current = JSON.parse(fs.readFileSync(filePath, "utf-8"))
            } catch {}
          }

          const updated = {
            logo: {
              light: lightUrl || current.logo?.light || "",
              dark: darkUrl || lightUrl || current.logo?.dark || "",
            },
            icon: {
              light: favUrl || lightUrl || current.icon?.light || "",
              dark: favUrl || darkUrl || lightUrl || current.icon?.dark || "",
            },
          }

          fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8")
        } catch (err) {
          console.warn("Failed to sync brand settings in SiteSettings afterChange hook:", err)
        }
      },
    ],
  },
}

export default SiteSettings
