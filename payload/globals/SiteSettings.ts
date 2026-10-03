import type { GlobalConfig } from "payload"

export const TOP_50_SOCIAL_PLATFORMS = [
  { label: "GitHub", value: "github" },
  { label: "X / Twitter", value: "x" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "YouTube", value: "youtube" },
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "Discord", value: "discord" },
  { label: "Telegram", value: "telegram" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Reddit", value: "reddit" },
  { label: "Threads", value: "threads" },
  { label: "Twitch", value: "twitch" },
  { label: "Pinterest", value: "pinterest" },
  { label: "Snapchat", value: "snapchat" },
  { label: "Medium", value: "medium" },
  { label: "Spotify", value: "spotify" },
  { label: "Dribbble", value: "dribbble" },
  { label: "Behance", value: "behance" },
  { label: "Slack", value: "slack" },
  { label: "GitLab", value: "gitlab" },
  { label: "Stack Overflow", value: "stackoverflow" },
  { label: "Substack", value: "substack" },
  { label: "Mastodon", value: "mastodon" },
  { label: "Bluesky", value: "bsky.app" },
  { label: "Patreon", value: "patreon" },
  { label: "SoundCloud", value: "soundcloud" },
  { label: "Vimeo", value: "vimeo" },
  { label: "CodePen", value: "codepen" },
  { label: "Dev.to", value: "dev.to" },
  { label: "Hashnode", value: "hashnode" },
  { label: "LeetCode", value: "leetcode" },
  { label: "Linktree", value: "linktree" },
  { label: "Tumblr", value: "tumblr" },
  { label: "WeChat", value: "wechat" },
  { label: "Line", value: "line.me" },
  { label: "Upwork", value: "upwork" },
  { label: "Goodreads", value: "goodreads" },
  { label: "Letterboxd", value: "letterboxd" },
  { label: "Meetup", value: "meetup" },
  { label: "Flickr", value: "flickr" },
  { label: "Dropbox", value: "dropbox" },
  { label: "Google Play", value: "google_play" },
  { label: "Apple Podcasts / Music", value: "itunes" },
  { label: "VK", value: "vk" },
  { label: "RSS Feed", value: "rss" },
  { label: "Email / Newsletter", value: "mailto" },
  { label: "Itch.io", value: "itch.io" },
  { label: "Xing", value: "xing" },
  { label: "Yelp", value: "yelp" },
]

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
      defaultValue: "NEXT LOAD",
      required: true,
      admin: {
        description: "The primary brand name displayed across header, sidebar, and emails.",
      },
    },
    {
      name: "siteTitle",
      type: "text",
      label: "Site Title / Tagline",
      defaultValue: "NEXT LOAD by Scalvio",
      admin: {
        description: "Displayed on the home page and in browser title tabs.",
      },
    },
    {
      name: "siteDescription",
      type: "textarea",
      label: "Site Description",
      defaultValue: "Enterprise-grade full-stack web application boilerplate by Scalvio with Next.js 16, Payload CMS 3.0, and Better Auth.",
      admin: {
        description: "Primary metadata description for SEO and social sharing.",
      },
    },
    {
      name: "logoText",
      type: "text",
      label: "Logo Badge Initials",
      defaultValue: "NL",
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
    {
      name: "socialPreview",
      type: "ui",
      admin: {
        components: {
          Field: "./admin/components/SocialLinksPreview#SocialLinksPreview",
        },
      },
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Brand Social Media Profiles (Top 50 Selection)",
      labels: {
        singular: "Social Profile",
        plural: "Social Profiles",
      },
      admin: {
        description: "Select from top 50 networks powered by react-social-icons.",
        initCollapsed: false,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "platform",
              type: "select",
              label: "Social Platform",
              required: true,
              defaultValue: "github",
              options: TOP_50_SOCIAL_PLATFORMS,
              admin: {
                width: "40%",
              },
            },
            {
              name: "url",
              type: "text",
              label: "Profile / Channel URL",
              required: true,
              defaultValue: "https://github.com",
              admin: {
                placeholder: "https://...",
                width: "45%",
              },
            },
            {
              name: "enabled",
              type: "checkbox",
              label: "Visible",
              defaultValue: true,
              admin: {
                width: "15%",
              },
            },
          ],
        },
      ],
      defaultValue: [
        { platform: "github", url: "https://github.com", enabled: true },
        { platform: "x", url: "https://x.com", enabled: true },
        { platform: "linkedin", url: "https://linkedin.com", enabled: true },
        { platform: "youtube", url: "https://youtube.com", enabled: true },
        { platform: "discord", url: "https://discord.com", enabled: true },
      ],
    },
    {
      name: "copyright",
      type: "text",
      label: "Footer Copyright Text",
      defaultValue: "© {year} Scalvio. All rights reserved.",
      admin: {
        description: "Text shown at the bottom of the footer. Use {year} for dynamic current year.",
      },
    },
    {
      name: "footerTagline",
      type: "textarea",
      label: "Footer Tagline / Bio",
      defaultValue: "Enterprise-grade full-stack web application platform by Scalvio, built with Next.js 16 and Payload CMS.",
      admin: {
        description: "Short brand description displayed under the logo in the footer.",
      },
    },
    {
      name: "paymentMethods",
      type: "group",
      label: "Footer Payment Methods",
      admin: {
        description: "Configure accepted payment badges shown in the footer.",
      },
      fields: [
        {
          name: "showPaymentMethods",
          type: "checkbox",
          label: "Display Payment Badges in Footer",
          defaultValue: true,
        },
        {
          name: "preview",
          type: "ui",
          admin: {
            components: {
              Field: "./admin/components/PaymentMethodsPreview#PaymentMethodsPreview",
            },
          },
        },
        {
          name: "enabledMethods",
          type: "select",
          label: "Accepted Standard Payment Methods",
          hasMany: true,
          defaultValue: ["visa", "mastercard", "amex", "paypal"],
          options: [
            { label: "Visa", value: "visa" },
            { label: "Mastercard", value: "mastercard" },
            { label: "American Express", value: "amex" },
            { label: "PayPal", value: "paypal" },
            { label: "Discover", value: "discover" },
            { label: "JCB", value: "jcb" },
            { label: "UnionPay", value: "unionpay" },
            { label: "Maestro", value: "maestro" },
            { label: "Diners Club", value: "diners" },
            { label: "Alipay", value: "alipay" },
          ],
          admin: {
            description: "Select which standard payment icons to display.",
          },
        },
        {
          name: "customMethods",
          type: "array",
          label: "Custom Payment Methods",
          labels: {
            singular: "Custom Payment Method",
            plural: "Custom Payment Methods",
          },
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              label: "Payment Name (e.g. bKash, Nagad, Crypto)",
            },
            {
              name: "icon",
              type: "upload",
              relationTo: "media",
              required: true,
              label: "Badge Icon",
            },
          ],
          admin: {
            description: "Upload additional custom payment badges or local gateways.",
          },
        },
      ],
    },
    {
      name: "legal",
      type: "group",
      label: "Legal Pages (Privacy & Terms)",
      admin: {
        description: "Configure content for Privacy Policy and Terms of Service pages.",
      },
      fields: [
        {
          name: "privacyTitle",
          type: "text",
          label: "Privacy Policy Title",
          defaultValue: "Privacy Policy",
        },
        {
          name: "privacyLastUpdated",
          type: "text",
          label: "Privacy Policy - Last Updated",
          defaultValue: "September 2026",
        },
        {
          name: "privacyContent",
          type: "textarea",
          label: "Privacy Policy Content",
          defaultValue: `## 1. Information We Collect\nWe collect personal information that you provide when registering an account, subscribing to newsletters, or making purchases. This may include your name, email address, payment details, and device identifiers.\n\n## 2. How We Use Information\nWe use your information to operate and maintain your account, process transactions, deliver customer support, send transactional communications, and ensure application security.\n\n## 3. Data Protection & Security\nWe implement robust encryption, secure session tokens, and strict access controls to safeguard your data. We never sell your personal information to third parties.\n\n## 4. Cookies & Tracking\nWe utilize essential and functional cookies to remember your preferences and ensure security. You can manage or disable optional cookies via our Cookie Preferences modal at any time.\n\n## 5. Contact Us\nIf you have any questions or data deletion requests regarding this Privacy Policy, please contact our privacy compliance team via our support channels.`,
          admin: {
            rows: 12,
            description: "Supports markdown headings (##) and paragraphs.",
          },
        },
        {
          name: "termsTitle",
          type: "text",
          label: "Terms of Service Title",
          defaultValue: "Terms of Service",
        },
        {
          name: "termsLastUpdated",
          type: "text",
          label: "Terms of Service - Last Updated",
          defaultValue: "September 2026",
        },
        {
          name: "termsContent",
          type: "textarea",
          label: "Terms of Service Content",
          defaultValue: `## 1. Acceptance of Terms\nBy accessing or using this platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you may not use our services.\n\n## 2. User Accounts & Responsibilities\nYou are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.\n\n## 3. Acceptable Use Policy\nYou agree not to engage in any activity that interferes with, disrupts, or compromises the security or integrity of our application, servers, or connected networks.\n\n## 4. Intellectual Property\nAll content, features, trademarks, and code on this platform are the exclusive property of the company and protected by intellectual property laws.\n\n## 5. Limitation of Liability\nTo the maximum extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the service.`,
          admin: {
            rows: 12,
            description: "Supports markdown headings (##) and paragraphs.",
          },
        },
      ],
    },
    {
      name: "themeConfig",
      type: "group",
      label: "Theme & Appearance (shadcn)",
      admin: {
        description:
          "Control your site's visual theme. Pick a predefined palette, adjust border radius, and optionally override individual colors with the color picker.",
      },
      fields: [
        {
          name: "themeEnabled",
          type: "checkbox",
          label: "Enable Admin Theme Overrides",
          defaultValue: false,
          admin: {
            description:
              "When enabled, the preset and/or custom colors below will override the default CSS theme. When disabled, the built-in globals.css theme is used.",
          },
        },
        {
          name: "themeLivePreview",
          type: "ui",
          admin: {
            components: {
              Field: "./admin/components/ThemeLivePreview#ThemeLivePreview",
            },
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "preset",
              type: "select",
              label: "Color Palette Preset",
              defaultValue: "zinc",
              options: [
                { label: "Zinc (Default)", value: "zinc" },
                { label: "Slate", value: "slate" },
                { label: "Stone", value: "stone" },
                { label: "Rose", value: "rose" },
                { label: "Blue", value: "blue" },
                { label: "Green", value: "green" },
                { label: "Orange", value: "orange" },
                { label: "Violet", value: "violet" },
                { label: "Red", value: "red" },
                { label: "Yellow", value: "yellow" },
              ],
              admin: {
                width: "50%",
                description: "Quickly apply a complete shadcn color theme.",
              },
            },
            {
              name: "radius",
              type: "select",
              label: "Border Radius",
              defaultValue: "default",
              options: [
                { label: "None (0)", value: "none" },
                { label: "XS (0.25rem)", value: "xs" },
                { label: "SM (0.375rem)", value: "sm" },
                { label: "MD (0.5rem)", value: "md" },
                { label: "Default (0.625rem)", value: "default" },
                { label: "LG (0.75rem)", value: "lg" },
                { label: "XL (1rem)", value: "xl" },
                { label: "2XL (1.5rem)", value: "2xl" },
              ],
              admin: {
                width: "50%",
                description: "Controls roundness of all UI components.",
              },
            },
          ],
        },
        {
          name: "lightMode",
          type: "group",
          label: "Light Mode Overrides (Optional)",
          admin: {
            description: "Override individual light mode colors. Leave empty to use the selected preset values.",
            condition: (_data: any, siblingData: any) => siblingData?.themeEnabled === true,
          },
          fields: [
            { type: "row", fields: [
              { name: "background", type: "text", label: "Background", defaultValue: "", admin: { placeholder: "#ffffff", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "foreground", type: "text", label: "Foreground", defaultValue: "", admin: { placeholder: "#09090b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "primary", type: "text", label: "Primary", defaultValue: "", admin: { placeholder: "#18181b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "primaryForeground", type: "text", label: "Primary Foreground", defaultValue: "", admin: { placeholder: "#fafafa", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "secondary", type: "text", label: "Secondary", defaultValue: "", admin: { placeholder: "#f4f4f5", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "secondaryForeground", type: "text", label: "Secondary Foreground", defaultValue: "", admin: { placeholder: "#18181b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "muted", type: "text", label: "Muted", defaultValue: "", admin: { placeholder: "#f4f4f5", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "mutedForeground", type: "text", label: "Muted Foreground", defaultValue: "", admin: { placeholder: "#71717a", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "accent", type: "text", label: "Accent", defaultValue: "", admin: { placeholder: "#f4f4f5", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "accentForeground", type: "text", label: "Accent Foreground", defaultValue: "", admin: { placeholder: "#18181b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "card", type: "text", label: "Card", defaultValue: "", admin: { placeholder: "#ffffff", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "cardForeground", type: "text", label: "Card Foreground", defaultValue: "", admin: { placeholder: "#09090b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "popover", type: "text", label: "Popover", defaultValue: "", admin: { placeholder: "#ffffff", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "popoverForeground", type: "text", label: "Popover Foreground", defaultValue: "", admin: { placeholder: "#09090b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "destructive", type: "text", label: "Destructive", defaultValue: "", admin: { placeholder: "#ef4444", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "border", type: "text", label: "Border", defaultValue: "", admin: { placeholder: "#e4e4e7", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "input", type: "text", label: "Input", defaultValue: "", admin: { placeholder: "#e4e4e7", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "ring", type: "text", label: "Ring", defaultValue: "", admin: { placeholder: "#18181b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
          ],
        },
        {
          name: "darkMode",
          type: "group",
          label: "Dark Mode Overrides (Optional)",
          admin: {
            description: "Override individual dark mode colors. Leave empty to use the selected preset values.",
            condition: (_data: any, siblingData: any) => siblingData?.themeEnabled === true,
          },
          fields: [
            { type: "row", fields: [
              { name: "background", type: "text", label: "Background", defaultValue: "", admin: { placeholder: "#09090b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "foreground", type: "text", label: "Foreground", defaultValue: "", admin: { placeholder: "#fafafa", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "primary", type: "text", label: "Primary", defaultValue: "", admin: { placeholder: "#fafafa", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "primaryForeground", type: "text", label: "Primary Foreground", defaultValue: "", admin: { placeholder: "#18181b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "secondary", type: "text", label: "Secondary", defaultValue: "", admin: { placeholder: "#27272a", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "secondaryForeground", type: "text", label: "Secondary Foreground", defaultValue: "", admin: { placeholder: "#fafafa", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "muted", type: "text", label: "Muted", defaultValue: "", admin: { placeholder: "#27272a", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "mutedForeground", type: "text", label: "Muted Foreground", defaultValue: "", admin: { placeholder: "#a1a1aa", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "accent", type: "text", label: "Accent", defaultValue: "", admin: { placeholder: "#27272a", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "accentForeground", type: "text", label: "Accent Foreground", defaultValue: "", admin: { placeholder: "#fafafa", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "card", type: "text", label: "Card", defaultValue: "", admin: { placeholder: "#09090b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "cardForeground", type: "text", label: "Card Foreground", defaultValue: "", admin: { placeholder: "#fafafa", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "popover", type: "text", label: "Popover", defaultValue: "", admin: { placeholder: "#09090b", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "popoverForeground", type: "text", label: "Popover Foreground", defaultValue: "", admin: { placeholder: "#fafafa", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "destructive", type: "text", label: "Destructive", defaultValue: "", admin: { placeholder: "#7f1d1d", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "border", type: "text", label: "Border", defaultValue: "", admin: { placeholder: "#27272a", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
            { type: "row", fields: [
              { name: "input", type: "text", label: "Input", defaultValue: "", admin: { placeholder: "#27272a", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
              { name: "ring", type: "text", label: "Ring", defaultValue: "", admin: { placeholder: "#d4d4d8", width: "50%", components: { Field: "./admin/components/ColorPickerField#ColorPickerField" } } },
            ] },
          ],
        },
      ],
    },
    {
      name: "security",
      type: "group",
      label: "Content & DevTools Protection",
      admin: {
        description: "Control developer tools inspection, right-click, and content protection safely.",
      },
      fields: [
        {
          name: "disableDevTools",
          type: "checkbox",
          label: "Disable DevTools Shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U)",
          defaultValue: false,
          admin: {
            description: "Blocks keyboard shortcuts that open developer tools or view source.",
          },
        },
        {
          name: "disableRightClick",
          type: "checkbox",
          label: "Disable Right-Click Context Menu",
          defaultValue: false,
          admin: {
            description: "Prevents right-click 'Inspect Element' on the public site (preserves normal input copy/paste).",
          },
        },
        {
          name: "disableTextSelection",
          type: "checkbox",
          label: "Disable Text Selection & Copy",
          defaultValue: false,
          admin: {
            description: "Prevents visitors from selecting or highlighting text to copy content.",
          },
        },
        {
          name: "exemptAdmins",
          type: "checkbox",
          label: "Exempt Logged-In Administrators",
          defaultValue: true,
          admin: {
            description: "When enabled, logged-in admins can still use DevTools and right-click freely without restrictions.",
          },
        },
        {
          name: "showProtectionNotice",
          type: "checkbox",
          label: "Show Subtle Toast Notice on Blocked Actions",
          defaultValue: false,
          admin: {
            description: "Displays a polite notification when a blocked shortcut or right-click is intercepted.",
          },
        },
      ],
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
                (typeof field.cloudinaryUrl === "string" && field.cloudinaryUrl.includes("res.cloudinary.com") ? field.cloudinaryUrl : null) ||
                (typeof field.url === "string" && field.url.includes("res.cloudinary.com") ? field.url : null) ||
                null
              )
            }
            if (typeof field === "string") {
              if (field.includes("res.cloudinary.com")) return field
              try {
                const mediaDoc = await req.payload.findByID({ collection: "media", id: field })
                return (
                  mediaDoc?.cloudinaryUrl ||
                  (typeof mediaDoc?.cloudinaryUrl === "string" && mediaDoc.cloudinaryUrl.includes("res.cloudinary.com") ? mediaDoc.cloudinaryUrl : null) ||
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
