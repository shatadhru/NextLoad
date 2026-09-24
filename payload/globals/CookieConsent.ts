import type { GlobalConfig } from "payload"
import adminOnly from "@/payload/access/adminOnly"

export const CookieConsent: GlobalConfig = {
  slug: "cookie-consent",
  label: "Cookie Consent & Privacy",
  admin: {
    group: "Settings",
    description: "Manage the mobile-friendly cookie consent popover, compliance categories, text, and layout.",
  },
  access: {
    read: () => true, // Publicly readable for visitors & frontend banner
    update: adminOnly, // Only admins can update cookie settings
  },
  fields: [
    {
      name: "preview",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "./admin/components/CookieLivePreview#CookieLivePreview",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "isEnabled",
          type: "checkbox",
          label: "Enable Cookie Popover Banner",
          defaultValue: true,
          admin: {
            width: "50%",
            description: "Toggle whether the cookie consent popover is actively displayed to site visitors.",
          },
        },
        {
          name: "showFloatingBadge",
          type: "checkbox",
          label: "Show Small Floating Cookie Icon on Client Side",
          defaultValue: true,
          admin: {
            width: "50%",
            description: "Controls whether the small persistent floating cookie button appears on the client-side screen when the popup is closed.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Popover Title",
          defaultValue: "We value your privacy",
          required: true,
          admin: {
            width: "60%",
            description: "Header title displayed at the top of the popover.",
          },
        },
        {
          name: "badge",
          type: "text",
          label: "Badge Pill (Optional)",
          defaultValue: "Cookie Policy",
          admin: {
            width: "40%",
            description: "Small tag pill shown above or beside the title.",
          },
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      label: "Consent Description Message",
      required: true,
      defaultValue:
        "We use cookies to improve your experience, personalize content, and analyze our traffic. You can choose which categories you agree to or accept all cookies.",
      admin: {
        description: "Clear, transparent explanation of cookie usage and privacy practices.",
      },
    },
    {
      type: "collapsible",
      label: "Layout, Position & Timing",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "position",
              type: "select",
              label: "Popover Position",
              defaultValue: "bottom-right",
              admin: {
                width: "50%",
                description: "On mobile screens, it automatically docks responsively to the bottom.",
              },
              options: [
                { label: "Floating Card — Bottom Right", value: "bottom-right" },
                { label: "Floating Card — Bottom Left", value: "bottom-left" },
                { label: "Floating Card — Bottom Center", value: "bottom-center" },
                { label: "Full Width Banner — Bottom Bar", value: "bottom-bar" },
              ],
            },
            {
              name: "themeStyle",
              type: "select",
              label: "Visual Theme Style",
              defaultValue: "default",
              admin: {
                width: "50%",
              },
              options: [
                { label: "Modern Card (Blur backdrop & subtle border)", value: "default" },
                { label: "Subtle (Minimal clean slate)", value: "subtle" },
                { label: "Accent (Branded border highlight)", value: "accent" },
              ],
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "delaySeconds",
              type: "number",
              label: "Auto Popup Delay (Seconds)",
              defaultValue: 1,
              min: 0,
              max: 30,
              admin: {
                width: "50%",
                description: "Seconds to wait before automatically popping up after page load (0 for immediate).",
              },
            },
            {
              name: "accentColor",
              type: "text",
              label: "Custom Accent / Button Color (Optional)",
              defaultValue: "",
              admin: {
                width: "50%",
                description: "Optional hex/color override (e.g. #0d9488). Leave blank to use site theme.",
              },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Buttons & Action Controls",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "acceptAllText",
              type: "text",
              label: "Accept All Button Text",
              defaultValue: "Accept All",
              required: true,
              admin: {
                width: "33.33%",
              },
            },
            {
              name: "declineText",
              type: "text",
              label: "Reject Button Text",
              defaultValue: "Reject Non-Essential",
              required: true,
              admin: {
                width: "33.33%",
              },
            },
            {
              name: "preferencesText",
              type: "text",
              label: "Preferences Button Text",
              defaultValue: "Preferences",
              required: true,
              admin: {
                width: "33.33%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "showDeclineButton",
              type: "checkbox",
              label: "Show Reject Non-Essential Button",
              defaultValue: true,
              admin: {
                width: "33.33%",
                description: "Recommended for GDPR & CCPA compliance.",
              },
            },
            {
              name: "showPreferencesButton",
              type: "checkbox",
              label: "Show Preferences / Customize Button",
              defaultValue: true,
              admin: {
                width: "33.33%",
                description: "Allows visitors to granularly toggle cookie categories.",
              },
            },
            {
              name: "showCloseIcon",
              type: "checkbox",
              label: "Show Small Dismiss (X) Icon",
              defaultValue: true,
              admin: {
                width: "33.33%",
                description: "Allows dismiss without selecting.",
              },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Privacy Policy & Legal Links",
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "privacyPolicyUrl",
              type: "text",
              label: "Privacy Policy URL",
              defaultValue: "/privacy",
              admin: {
                width: "50%",
                description: "Link to your privacy policy page.",
              },
            },
            {
              name: "privacyPolicyLabel",
              type: "text",
              label: "Privacy Policy Label",
              defaultValue: "Privacy Policy",
              admin: {
                width: "50%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "cookiePolicyUrl",
              type: "text",
              label: "Cookie Policy URL (Optional)",
              defaultValue: "/cookies",
              admin: {
                width: "50%",
                description: "Link to dedicated cookie details page (leave empty to hide).",
              },
            },
            {
              name: "cookiePolicyLabel",
              type: "text",
              label: "Cookie Policy Label",
              defaultValue: "Cookie Policy",
              admin: {
                width: "50%",
              },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Granular Cookie Categories (Preferences Drawer)",
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "necessaryTitle",
              type: "text",
              label: "Strictly Necessary Category Title",
              defaultValue: "Strictly Necessary",
              admin: {
                width: "40%",
              },
            },
            {
              name: "necessaryDescription",
              type: "text",
              label: "Strictly Necessary Description",
              defaultValue: "Essential for site navigation, core functionality, security, and authentication. Always active.",
              admin: {
                width: "60%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "analyticsEnabled",
              type: "checkbox",
              label: "Include Analytics Category",
              defaultValue: true,
              admin: {
                width: "20%",
              },
            },
            {
              name: "analyticsTitle",
              type: "text",
              label: "Analytics Category Title",
              defaultValue: "Analytics & Performance",
              admin: {
                width: "30%",
                condition: (data) => Boolean(data?.analyticsEnabled),
              },
            },
            {
              name: "analyticsDescription",
              type: "text",
              label: "Analytics Description",
              defaultValue: "Helps us measure site traffic, identify popular content, and improve site performance.",
              admin: {
                width: "50%",
                condition: (data) => Boolean(data?.analyticsEnabled),
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "marketingEnabled",
              type: "checkbox",
              label: "Include Marketing Category",
              defaultValue: true,
              admin: {
                width: "20%",
              },
            },
            {
              name: "marketingTitle",
              type: "text",
              label: "Marketing Category Title",
              defaultValue: "Marketing & Targeting",
              admin: {
                width: "30%",
                condition: (data) => Boolean(data?.marketingEnabled),
              },
            },
            {
              name: "marketingDescription",
              type: "text",
              label: "Marketing Description",
              defaultValue: "Used by advertising partners to deliver personalized ads and measure promotional campaigns.",
              admin: {
                width: "50%",
                condition: (data) => Boolean(data?.marketingEnabled),
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "functionalEnabled",
              type: "checkbox",
              label: "Include Functional Category",
              defaultValue: true,
              admin: {
                width: "20%",
              },
            },
            {
              name: "functionalTitle",
              type: "text",
              label: "Functional Category Title",
              defaultValue: "Functional & Preferences",
              admin: {
                width: "30%",
                condition: (data) => Boolean(data?.functionalEnabled),
              },
            },
            {
              name: "functionalDescription",
              type: "text",
              label: "Functional Description",
              defaultValue: "Enables enhanced personalization, remembering your preferred language, theme, and saved settings.",
              admin: {
                width: "50%",
                condition: (data) => Boolean(data?.functionalEnabled),
              },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Expiration & Versioning",
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "consentExpiryDays",
              type: "number",
              label: "Consent Expiration Duration (Days)",
              defaultValue: 180,
              min: 1,
              max: 730,
              admin: {
                width: "50%",
                description: "Number of days until visitors are prompted to confirm consent again (standard: 180 days).",
              },
            },
            {
              name: "policyVersion",
              type: "number",
              label: "Policy Revision Version",
              defaultValue: 1,
              min: 1,
              admin: {
                width: "50%",
                description: "Incrementing this number forces all visitors to re-consent on their next visit.",
              },
            },
          ],
        },
      ],
    },
  ],
}

export default CookieConsent
