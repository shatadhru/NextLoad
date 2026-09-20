# Changelog

All notable changes to **NextLoad** are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [v1.1.0] – 2026-09-20

> **"Branding, Notifications & Developer Experience"**  
> This release transforms NextLoad from a raw boilerplate into a fully polished, production-ready system with a dynamic branding engine, a complete notification infrastructure, and a dramatically improved developer experience.

### 🆕 Added

#### Dynamic Logo & Branding System
- **`components/ui/Logo.tsx`** — New unified `<Logo />` component with:
  - Dark & Light mode support (auto/explicit `theme` prop)
  - Shimmer skeleton loader during settings fetch (zero layout shift)
  - Supports uploaded logo (Cloudinary-accelerated via `CldImage`) or gradient badge fallback (`NL`)
  - `variant="icon"` (badge only) and `variant="full"` (badge + accessible `aria-label`)
  - Sizes: `xs | sm | md | lg | xl`
  - Optional `href` prop wraps logo in an accessible Next.js `<Link>`
- **`components/ui/BrandLogo.tsx`** — Backward-compatible alias wrapping `<Logo />`
- **`components/ui/SafeCldImage.tsx`** — Safe `CldImage` wrapper:
  - Renders `<CldImage />` (next-cloudinary) for Cloudinary assets (AVIF/WebP auto-format, edge CDN)
  - Gracefully falls back to standard `<img>` for local/external images
  - Exported `isCloudinarySrc()` utility for detecting Cloudinary URLs
- **`payload/globals/SiteSettings.ts`** — Payload Global for uploading logos, dark logos, favicons, and site name directly from the Admin Panel
- **`app/api/site-settings/route.ts`** — Returns live branding JSON with media URLs
- **`app/api/site-settings/logo/route.ts`** — Dynamic SVG logo with `?theme=light|dark`; redirects to uploaded asset or renders NextLoad SVG fallback
- **`app/api/site-settings/icon/route.ts`** — Dynamic SVG favicon; redirects to uploaded favicon or NextLoad SVG icon fallback
- **`payload/admin/components/AdminLogo.tsx`** — Admin panel logo with dark/light mode switching
- **`payload/admin/components/AdminIcon.tsx`** — Admin panel collapsed sidebar icon

#### Notification System
- **`payload/admin/views/NotificationBroadcastView.tsx`** — Full broadcast UI:
  - Send to specific user, custom group, or everyone
  - Email + in-app notification delivery
  - Real-time preview
- **`app/api/admin/notifications/send/route.ts`** — Admin-only API endpoint for broadcast dispatch
- **`app/api/user/notifications/route.ts`** — User-scoped notification fetch API
- **`utils/notifications/storage.ts`** — JSON-based notification persistence layer
- **`data/notifications/broadcasts.json`** — Persisted broadcast records
- **`components/dashboard/DashboardShell.tsx`** — Bell icon with unread notification count badge; popover notification dropdown; mobile responsive

#### Activity System
- **`components/activity/ActivitySystemView.tsx`** — Full-page activity log view
- **`components/activity/ActivityTimeline.tsx`** — Chronological event timeline
- **`components/activity/ActivityItem.tsx`** — Individual activity item card
- **`components/activity/ActivityFilters.tsx`** — Filter by event type, date range, severity
- **`components/activity/ActivityStatsSummary.tsx`** — Stats summary (total events, by type)
- **`lib/activity/activity-service.ts`** — Activity logging service
- **`lib/activity/types.ts`** — Activity event type definitions

#### Payload Admin Custom Views
- **`config/adminCustomComponents.ts`** — Centralized config array for all custom admin panel pages:
  - Add any custom page by adding an entry (id, title, path, icon, componentPath)
  - Automatically registers route, navigation link, and sidebar icon
- **`payload/admin/components/CustomAdminNavLinks.tsx`** — Dynamic sidebar nav links with Lucide icons and badges
- **`payload/admin/components/CustomAdminViewWrapper.tsx`** — Generic wrapper for all custom admin views
- **`payload/admin/views/AnalyticsView.tsx`** — Platform analytics dashboard
- **`payload/admin/views/EmailLogsView.tsx`** — Outbound email audit trail
- **`payload/admin/views/StorageManagerView.tsx`** — Cloudinary media manager view
- **`payload/admin/views/ReadMeView.tsx`** — Embedded boilerplate documentation

#### Dashboard & UI
- **`components/dashboard/AppSidebar.tsx`** — Full sidebar rewrite:
  - Collapsible (icon-only) and expanded mode
  - `<Logo isCollapsed />` in header — shows full logo when expanded, icon-only when collapsed
  - User navigation, admin navigation, quick links groups
- **`config/sidebar.ts`** — Centralized sidebar navigation configuration
- **`components/dashboard/profile/ProfileSettingsView.tsx`** — Complete profile settings UI
- **`components/dashboard/settings/SettingsView.tsx`** — Complete settings UI (theme, credentials, notifications, storage)
- **`components/auth/UserProfile.tsx`** — Auth user profile display
- **`components/auth/user/user-avatar.tsx`** — Reusable user avatar component
- **`components/auth/settings/account/change-avatar.tsx`** — Avatar upload UI
- **`components/loading/Loading.tsx`** — Global loading state component

#### Dashboard Pages
- `app/(frontend)/dashboard/page.tsx`
- `app/(frontend)/dashboard/activity/page.tsx`
- `app/(frontend)/dashboard/notifications/page.tsx`
- `app/(frontend)/dashboard/files/page.tsx`
- `app/(frontend)/dashboard/profile/page.tsx`
- `app/(frontend)/dashboard/settings/page.tsx`
- `app/(frontend)/dashboard/support/page.tsx`

#### Configuration
- **`config/site.ts`** — Centralized site/SEO configuration:
  - `SiteConfig.site.*`, `SiteConfig.pages.*`, `SiteConfig.seo.*`, `SiteConfig.appearance.*`
  - `getPageTitle(key)` helper for safe Next.js `<Metadata>` generation
- **`.env.example`** — Annotated environment variable template covering all required secrets

#### Infrastructure
- Added `next-cloudinary` (`CldImage`) for ultra-fast Cloudinary image delivery
- Updated `next.config.ts` to allow `res.cloudinary.com` remote patterns
- Updated `payload-theme` plugin config with dynamic `logo`, `icon`, `logoHeight`, and `login` branding options pointing to live API endpoints

### ♻️ Changed

- **Auth pages** (login, signup, forgot password) — replaced temporary `GalleryVerticalEndIcon` placeholder with `<Logo href="/" size="lg" />`, matching the actual site branding
- **Landing page** (`app/(frontend)/page.tsx`) — header and footer now use `<Logo />` instead of hardcoded markup
- **Mobile dashboard header** — uses `<Logo href="/dashboard" size="sm" />` instead of hardcoded badge
- **`payload/plugins/index.ts`** — `payloadTheme()` now configured with:
  - `logo.light` / `logo.dark` pointing to `/api/site-settings/logo?theme=*`
  - `icon.light` / `icon.dark` pointing to `/api/site-settings/icon?theme=*`
  - `login.heading` and `login.tagline` from centralized config
- **Dashboard layouts** — all layouts now export proper Next.js `Metadata` via `getPageTitle()` for accurate browser tab titles
- All Payload Admin navigation icons now correctly resolved (Bell, BarChart3, Mail, HardDrive, Settings)

### 🐛 Fixed

- Broken/generic Lucide icons in Payload Admin sidebar for custom views — explicitly mapped via `generateThemeNavIcons()` and `ICON_MAP`
- Logo shimmer prevents layout shift during async settings fetch
- Cloudinary images outside `remotePatterns` were blocked by Next.js image optimization — resolved by adding `res.cloudinary.com`

### 📦 Dependencies Added

| Package | Purpose |
|---|---|
| `next-cloudinary` | Optimized Cloudinary image delivery via `CldImage` |

---

## [v1.0.0] – 2026-09-01

Initial release of the NextLoad production-ready boilerplate.

### 🆕 Added
- Next.js 16 App Router setup
- Payload CMS 3.0 integration with MongoDB adapter
- Better Auth with Google OAuth, session management, and role-based access
- SMTP email delivery via Nodemailer/Hostinger
- Cloudinary media storage via `payload-cloudinary`
- `payload-theme` plugin with teal accent
- Basic Auth pages (login, signup, forgot/reset password)
- Payload Admin panel with custom `payload-theme` styling

---

> **NextLoad** is maintained by [@shatadhru](https://github.com/shatadhru).  
> Contributions, issues, and PRs are welcome.
