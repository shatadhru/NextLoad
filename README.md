<img width="2752" height="1536" alt="NextLoad Banner" src="https://github.com/user-attachments/assets/04779f74-a1d6-4606-bc78-e6edd72c5d76" />

<p align="left">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Payload_CMS_3-111111?style=for-the-badge&logo=payloadcms&logoColor=white" alt="Payload CMS" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Better_Auth-111111?style=for-the-badge&logoColor=white" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</p>

# NextLoad

NextLoad is a production-grade full-stack boilerplate built on Next.js 16, Payload CMS 3.0, and MongoDB. It provides authentication, an embedded headless content management system, dynamic runtime theming, hybrid caching, anti-tampering security controls, a full blog engine, e-commerce cart capabilities, and a responsive component library.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture and Project Structure](#architecture-and-project-structure)
4. [Core Features](#core-features)
   - [Authentication and User Management](#authentication-and-user-management)
   - [Payload CMS 3.0 Integration](#payload-cms-30-integration)
   - [Dynamic OKLCH Theming System](#dynamic-oklch-theming-system)
   - [Universal Hybrid Caching Engine](#universal-hybrid-caching-engine)
   - [Anti-Tampering and DevTools Security](#anti-tampering-and-devtools-security)
   - [Blog Engine and SEO](#blog-engine-and-seo)
   - [E-Commerce and Cart System](#e-commerce-and-cart-system)
   - [User Dashboard](#user-dashboard)
   - [Transactional Email Service](#transactional-email-service)
5. [API Reference](#api-reference)
6. [Environment Variables](#environment-variables)
7. [Getting Started](#getting-started)
8. [Available Scripts](#available-scripts)
9. [Deployment](#deployment)
10. [License](#license)

---

## Overview

NextLoad solves the initial setup overhead of starting a modern web application. Instead of spending weeks gluing together database drivers, authentication cookies, an admin dashboard, cache stores, and UI primitives, NextLoad delivers an integrated system where:

- Content editors manage pages, blog posts, site settings, themes, banners, and cookies from the embedded Payload CMS studio.
- Users authenticate via email/password or Google OAuth using Better Auth sessions.
- Developers build with React 19 Server Components and client hooks backed by TypeScript strict mode.
- Caching runs automatically on Redis when available, or seamlessly in-memory with automatic cleanup when Redis is omitted.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| Framework | Next.js | `16.3.3` | App Router, Server Actions, Route Handlers |
| UI Library | React / React DOM | `19.2.6` | Component rendering and concurrency |
| Language | TypeScript | `5.7.3` | Strict type checking and project aliases |
| CMS Platform | Payload CMS | `3.90.2` | Headless CMS directly embedded into Next.js |
| Database | MongoDB | `>=6.0` | Primary document database via Mongoose adapter |
| Cache Store | Redis / In-Memory | `ioredis 6.0` | Hybrid cache with automatic memory fallback |
| Authentication | Better Auth | `1.7.5` | Session management, OAuth 2.0, password flows |
| Auth UI | Better Auth UI | `1.7.26` | Pre-built authentication interface components |
| Auth Bridge | Payload Better Auth | `0.13.0` | Syncs Better Auth users with Payload collection |
| CSS Framework | Tailwind CSS | `4.3.3` | CSS-first architecture with OKLCH dynamic tokens |
| Component Primitives | Radix UI / Base UI | Latest | Accessible modal, drawer, dropdown, and toast primitives |
| Component Styling | shadcn/ui | `4.21.0` | Custom accessible React components |
| Icons | Lucide React | `1.47.0` | Application and interface icon system |
| Media Storage | Cloudinary / Local | `6.19.3` | Media uploads with automatic sharp image processing |
| Email Service | Nodemailer | `10.0.10` | SMTP transactional email transport |

---

## Architecture and Project Structure

NextLoad uses Next.js route groups to maintain strict separation between public frontend pages and administrative CMS routes.

```text
nextload/
├── app/
│   ├── (frontend)/                    # Public-facing application routes
│   │   ├── auth/                      # Authentication views (login, signup, reset)
│   │   ├── blog/                      # Blog engine (posts, categories, tags)
│   │   │   ├── [slug]/                # Single post reader
│   │   │   ├── category/[slug]/       # Category archive
│   │   │   └── tag/[slug]/            # Tag archive
│   │   ├── dashboard/                 # Protected user dashboard
│   │   ├── layout.tsx                 # Root frontend layout with providers
│   │   └── page.tsx                   # Landing page showcasing all platform features
│   ├── (payload)/                     # Embedded Payload CMS route group
│   │   ├── admin/                     # Payload CMS studio UI (/admin)
│   │   ├── api/                       # Payload native REST & GraphQL handlers
│   │   ├── custom.scss                # Admin studio theme overrides
│   │   └── layout.tsx                 # Payload admin layout wrapper
│   ├── api/                           # Application API route handlers
│   │   ├── banners/active/            # Active banner query with TTL cache
│   │   ├── checkout/                  # Cart checkout and order placement
│   │   ├── cookie-consent/            # Cookie policy settings
│   │   ├── newsletter/                # Newsletter subscription handler
│   │   ├── site-settings/             # Global site branding and security settings
│   │   └── upload/                    # File and avatar upload endpoint
│   ├── globals.css                    # Tailwind CSS v4 design tokens and theme rules
│   ├── robots.ts                      # Dynamic robots.txt generation
│   └── sitemap.ts                     # Dynamic XML sitemap generator
│
├── components/
│   ├── basic/                         # Production application feature components
│   │   ├── blog/                      # Blog post cards, hero, breadcrumbs, sidebar
│   │   ├── cart/                      # Cart drawer, items, state store, price utils
│   │   ├── context/                   # Global SiteSettingsContext and cache provider
│   │   ├── dashboard/                 # User dashboard shell, profile, order history
│   │   ├── footer/                    # Site footer, payment badges, newsletter box
│   │   ├── header/                    # Main navigation, mega-menu, mobile drawer
│   │   ├── security/                  # Zero-CPU DevTools and anti-tamper listener
│   │   └── theme/                     # OKLCH runtime CSS variable injector
│   └── ui/                            # shadcn/ui reusable design primitives
│
├── config/
│   ├── header.ts                      # Navigation links and header layout config
│   └── site.ts                        # Application meta information and fallback defaults
│
├── payload/
│   ├── access/                        # Role-based access control helpers
│   ├── auth/                          # Better Auth server configuration and client
│   ├── collections/                   # Payload content schema definitions
│   │   ├── blog/                      # Posts, Categories, Tags collections
│   │   ├── ecommerch/                 # Products, Categories, Coupons, Reviews
│   │   ├── Banners.ts                 # Notification and announcement banners
│   │   ├── Media.ts                   # Uploaded media with sharp optimization
│   │   ├── Newsletter.ts              # Email newsletter subscribers
│   │   └── Users.ts                   # Application users with role fields
│   ├── globals/                       # Payload global singleton schemas
│   │   ├── CookieConsent.ts           # Cookie banner texts and category toggles
│   │   └── SiteSettings.ts            # Global branding, OKLCH colors, security toggles
│   ├── lib/
│   │   └── cache/index.ts             # Universal hybrid Redis/Memory cache engine
│   └── payload.config.ts              # Payload CMS master configuration
│
├── .env.example                       # Documented environment variable template
├── components.json                    # shadcn/ui CLI configuration
├── next.config.ts                     # Next.js configuration and image domains
├── package.json                       # Dependencies, engines, and build scripts
└── tsconfig.json                      # Strict TypeScript compiler options
```

---

## Core Features

### Authentication and User Management

Authentication is powered by Better Auth and synchronized with the Payload Users collection:

- Email and Password registration, login, and session validation.
- Google OAuth 2.0 social login support.
- Secure HTTP-only cookies with configurable 30-day session expiry.
- Role-based authorization distinguishing between standard users and administrators.
- Password reset, forgot password, and email verification email workflows.
- User profile updates, avatar uploads via Cloudinary, and password change flows.
- Header user menu, slide-over mobile drawer, and dedicated `/auth` routing.

### Payload CMS 3.0 Integration

Payload CMS is embedded directly inside the Next.js runtime:

- Admin Studio accessible at `/admin` without running an independent backend process.
- Lexical rich-text editor with headings, lists, links, image embedding, and code formatting.
- Collections:
  - `Users`: Accounts, authentication links, and system roles.
  - `Posts`: Blog articles with slugs, excerpt, rich text, reading time, and author relationships.
  - `Categories` and `Tags`: Taxonomy for grouping blog and product content.
  - `Media`: Image management with sharp resizing and optional Cloudinary storage.
  - `Banners`: Scheduled announcement bars with top, bottom, or floating positioning.
  - `Newsletter`: Subscriber collection for marketing updates.
  - `Products`, `Coupons`, `Reviews`: E-commerce catalog schemas.
- Globals:
  - `SiteSettings`: Live brand names, descriptions, contact info, social links, theme colors, and security.
  - `CookieConsent`: Cookie banner text, privacy links, and category preferences.
- Built-in GraphQL API and interactive GraphQL Playground at `/api/graphql-playground`.

### Dynamic OKLCH Theming System

NextLoad provides an interactive runtime theming engine:

- Theme colors are defined in Payload Admin under **Site Settings > Theme Colors**.
- Administrators choose primary and secondary hex colors through an interactive color picker.
- The server generates matching 50 to 950 OKLCH color palettes in real time.
- The `ThemeInjector` component writes these tokens directly into CSS root variables.
- Works in tandem with `next-themes` for system, light, and dark mode toggling without flash of unstyled content (FOUC).

### Universal Hybrid Caching Engine

High-traffic endpoints utilize a hybrid caching layer (`payload/lib/cache/index.ts`):

- **Redis Mode**: If `REDIS_URL` is set in your `.env` file, the cache engine connects via `ioredis` with automatic retry strategies.
- **In-Memory Fallback**: If `REDIS_URL` is omitted or temporarily unreachable, the engine falls back to an in-memory `Map` with custom TTL expiration. Expired entries are cleaned up every 5 minutes.
- **Automatic Purging**: When administrators update or delete banners in Payload Admin, collection lifecycle hooks (`afterChange`, `afterDelete`) immediately purge the active cache key (`banners:active`).
- **Client Cache**: The `SiteSettingsContext` caches site settings in `localStorage` for 5 hours, deduplicates concurrent network requests, and updates in the background using `stale-while-revalidate`.

### Anti-Tampering and DevTools Security

Configurable security controls protect frontend assets and sensitive operations:

- Configured directly inside Payload Admin (**Site Settings > Security & DevTools Protection**).
- **Inspect Lock**: Blocks `F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C`, `Cmd+Option+I`, and `Cmd+Option+J`.
- **Source View Lock**: Intercepts `Ctrl+U` and `Cmd+Option+U`.
- **Save Lock**: Prevents saving page sources via `Ctrl+S` or `Cmd+S`.
- **Context Menu Protection**: Disables the right-click inspect menu while preserving native right-click inside editable form fields (`input`, `textarea`).
- **Text Selection Protection**: Optionally prevents text selection across marketing and protected pages.
- **Admin Exemption**: Logged-in administrators bypass all restrictions automatically.
- **Performance**: Zero-CPU implementation using passive browser event listeners.

### Blog Engine and SEO

A complete publishing system ready out of the box:

- Clean URLs: `/blog`, `/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`.
- Reading time estimation calculated from word count.
- Breadcrumb navigation with structured breadcrumb components.
- Social sharing triggers for Twitter, Facebook, LinkedIn, and clipboard copy.
- Automated `sitemap.xml` generated dynamically at `app/sitemap.ts` covering static routes and published posts.
- Automated `robots.txt` generated at `app/robots.ts`.

### E-Commerce and Cart System

A lightweight shopping cart built with client-side state:

- Slide-over Cart Drawer (`components/basic/cart/CartDrawer.tsx`).
- Reactive cart items, quantity adjustments, item removals, and real-time subtotal calculation.
- Free shipping progress bar indicating distance to shipping threshold.
- Formatted currency rendering using standard number formatters.
- Checkout route handler (`/api/checkout`) ready for payment gateway integration (Stripe, SSLCommerz, PayPal).

### User Dashboard

A dedicated workspace for authenticated users at `/dashboard`:

- Profile tab: Update personal information, email, and upload profile pictures.
- Orders tab: Review purchase history, transaction dates, item lists, and delivery statuses.
- Notifications tab: Manage email notification preferences and marketing alerts.
- Security tab: Password change form and active session details.

### Transactional Email Service

Email delivery handled by Nodemailer with HTML templates:

- Password reset email with secure verification link.
- Email verification message for new user signups.
- Password change confirmation alert.
- Development fallback: logs email content directly to the terminal when SMTP variables are not configured.

---

## API Reference

| Endpoint | Method | Cache Strategy | Description |
| :--- | :--- | :--- | :--- |
| `/api/site-settings` | `GET` | 5 hours browser/CDN + `localStorage` | Returns branding, navigation, theme colors, and security settings. |
| `/api/banners/active` | `GET` | 5 min hybrid cache (auto-purged on update) | Returns active announcement banners for display. |
| `/api/cookie-consent` | `GET` | 1 hour hybrid cache | Returns cookie consent modal text and privacy category configuration. |
| `/api/checkout` | `POST` | No cache | Processes cart checkout and generates order record. |
| `/api/newsletter` | `POST` | No cache | Subscribes an email address to the newsletter collection. |
| `/api/upload` | `POST` | No cache | Accepts multipart file uploads and pipes to Cloudinary or local storage. |
| `/api/auth/*` | `ALL` | No cache | Better Auth endpoints (sign-in, sign-up, sign-out, session, oauth). |
| `/api/graphql` | `POST` | Query-dependent | Payload CMS GraphQL API endpoint. |
| `/api/graphql-playground` | `GET` | Browser cache | Interactive browser interface for running GraphQL queries. |
| `/api/[collection]` | `ALL` | Payload default | Standard Payload REST API for collections (e.g. `/api/posts`, `/api/media`). |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values for your environment:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Yes | `mongodb://127.0.0.1:27017/nextload` | MongoDB connection URI. |
| `PAYLOAD_SECRET` | Yes | — | Secret string used to sign Payload tokens (minimum 32 characters). |
| `BETTER_AUTH_SECRET` | Yes | — | Secret string used for Better Auth session signing (minimum 32 characters). |
| `BETTER_AUTH_URL` | Yes | `http://localhost:3000` | Public base URL of your application. |
| `NEXT_PUBLIC_APP_URL` | Yes | `http://localhost:3000` | Application URL exposed to client-side components. |
| `REDIS_URL` | No | — | Redis connection URL (e.g. `redis://default:password@host:6379`). If omitted, in-memory cache is used. |
| `SMTP_HOST` | No | `smtp.hostinger.com` | SMTP outgoing mail server hostname. |
| `SMTP_PORT` | No | `465` | SMTP port (`465` for SSL, `587` for TLS). |
| `SMTP_SECURE` | No | `true` | Set to `true` for port 465, or `false` for port 587. |
| `SMTP_USER` | No | — | SMTP username or email address. |
| `SMTP_PASS` | No | — | SMTP account password or app password. |
| `SMTP_FROM` | No | `"NextLoad <support@yourdomain.com>"` | Default sender header for outgoing emails. |
| `GOOGLE_CLIENT_ID` | No | — | Google Cloud OAuth 2.0 client ID for social login. |
| `GOOGLE_CLIENT_SECRET` | No | — | Google Cloud OAuth 2.0 client secret. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | — | Cloudinary cloud name for media uploads. |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | No | — | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | No | — | Cloudinary API secret. |

---

## Getting Started

### 1. Prerequisites

- **Node.js**: Version `18.20.2` or `>=20.9.0`
- **Package Manager**: `pnpm` version `9`, `10`, or `11`
- **Database**: MongoDB instance running locally or via MongoDB Atlas
- **Cache (Optional)**: Redis instance (e.g. Upstash, Redis Cloud, or local Docker)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/shatadhru/NextLoad.git
cd nextload
pnpm install
```

### 3. Generate Payload Import Map and Types

Initialize Payload CMS dependencies:

```bash
npx payload generate:importmap
pnpm generate:types
```

### 4. Configure Environment

Copy `.env.example` to `.env` and set your secrets:

```bash
cp .env.example .env
```

To generate a secure 32-character secret on Windows (PowerShell) or Linux/macOS:

```bash
# Linux / macOS / Git Bash
openssl rand -base64 32

# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 5. Start Development Server

Run the development server:

```bash
pnpm dev
```

Open the following URLs in your browser:

- Frontend Application: [http://localhost:3000](http://localhost:3000)
- Payload CMS Studio: [http://localhost:3000/admin](http://localhost:3000/admin)
- GraphQL Playground: [http://localhost:3000/api/graphql-playground](http://localhost:3000/api/graphql-playground)

On your first visit to `/admin`, Payload will prompt you to create the initial administrative account.

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `pnpm dev` | `next dev` | Starts the Next.js development server with hot module reloading. |
| `pnpm devsafe` | Next cache clean + `next dev` | Deletes the local `.next` cache directory before starting development. |
| `pnpm build` | `next build` | Compiles and optimizes the full-stack application for production. |
| `pnpm start` | `next start` | Runs the compiled production server. |
| `pnpm lint` | `eslint .` | Runs ESLint across all TypeScript and React files. |
| `pnpm payload` | `payload` | Runs Payload CMS CLI commands. |
| `pnpm generate:types` | `payload generate:types` | Generates TypeScript interfaces from Payload collection schemas. |
| `pnpm generate:importmap` | `payload generate:importmap` | Rebuilds the Payload component import map for the admin panel. |
| `pnpm init:project` | `node payload/scripts/init.mjs` | Runs initial project setup helper scripts. |

---

## Deployment

### Node.js / Docker Server

NextLoad runs as a standard Node.js server:

1. Set all production environment variables in your hosting environment.
2. Build the production application:
   ```bash
   pnpm build
   ```
3. Start the server:
   ```bash
   pnpm start
   ```

### Vercel / Cloud Platforms

- Connect your GitHub repository to Vercel.
- Configure the root directory to `nextload` if deploying from a subfolder.
- Add all required environment variables (`DATABASE_URL`, `PAYLOAD_SECRET`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`).
- Use the standard build command: `pnpm build`.

---

## License

This project is open-source and licensed under the [MIT License](LICENSE).
