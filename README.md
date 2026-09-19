




<img width="2752" height="1536" alt="Gemini_Generated_Image_2jc8oz2jc8oz2jc8" src="https://github.com/user-attachments/assets/04779f74-a1d6-4606-bc78-e6edd72c5d76" />

# Production-Ready Next.js Boilerplate

A production-ready Next.js boilerplate for building modern, scalable web applications faster.

<!-- Tech Stack Badges -->
<p align="left">
  <!-- Frameworks & Core -->
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />

  <!-- CMS & Backend -->
  <img src="https://img.shields.io/badge/Payload_CMS-111111?style=for-the-badge&logo=payloadcms&logoColor=white" alt="Payload CMS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />

  <!-- UI & Styling -->
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn UI" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix UI" />
  <img src="https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide" />

  <!-- Database & ORM -->
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />

  <!-- State & Forms -->
  <img src="https://img.shields.io/badge/Zanstand-443e38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />

  <!-- DevOps & Deployment -->
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier" />
</p>

---

## ✨ Features

- **Framework**: Next.js (App Router, Server Actions, SSR/SSG ready)
- **CMS Integration**: Headless Payload CMS for content management
- **UI & Components**: Shadcn UI components powered by Radix UI & Tailwind CSS
- **Type Safety**: End-to-end type safety using TypeScript and Zod schema validation
- **Authentication**: Pre-configured session/token based authentication
- **Database Support**: Ready setups for PostgreSQL / MongoDB via Prisma or Payload adapter
- **Form Handling**: React Hook Form with integrated Zod validation
- **Code Quality**: ESLint, Prettier, aur Husky pre-commit hooks configured

---

##  Getting Started

### 1. Clone repository

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name


# NextLoad

A production-ready web application template integrating **Next.js 16 (App Router)** with **Payload CMS 3.0**, **Better Auth**, **MongoDB**, and an **SMTP email delivery service** with responsive HTML templates.

---

## Overview

NextLoad unites headless content management and modern authentication into a unified Next.js codebase. The application leverages Payload CMS 3.0 running natively within the Next.js App Router, backed by MongoDB via Mongoose, with user identity and session management powered by Better Auth.

### Key Highlights

- **Next.js 16 & React 19:** Built with the latest Next.js App Router and React 19.
- **Payload CMS 3.0 Native Integration:** Fully embedded within Next.js via `@payloadcms/next`, featuring MongoDB via Mongoose, Lexical rich text editing, Sharp image processing, and a customized teal admin theme.
- **Better Auth Integration:** Better Auth backed by Payload CMS data adapters, supporting email/password authentication, Google OAuth 2.0 social sign-in, account linking, 30-day session persistence, and role-based access control.
- **Complete Auth Workflows:** Pre-built client flows for Login, Signup, Logout, and a 4-step Password Reset Wizard with visual step indicators.
- **Transactional Email System:** Built-in Nodemailer SMTP transport, responsive branded HTML email templates, development simulation fallback, and a custom Payload CMS email adapter.
- **Modern Design System:** Tailwind CSS v4 with OKLCH color palettes, dark mode support, and a Shadcn UI component suite built on Radix UI and Base UI primitives.

---

## Feature & Technology Inventory

The following table documents all technologies, packages, and features in the repository and their exact implementation status.

| Category | Technology / Package | Version | Status | Implementation Details & Location |
| :--- | :--- | :--- | :--- | :--- |
| **Framework** | Next.js | `16.3.3` | **Fully Implemented** | App Router architecture, route groups `(frontend)` and `(payload)`. Configured in [`next.config.ts`](next.config.ts). |
| **UI Library** | React / React DOM | `19.2.6` | **Fully Implemented** | Core UI rendering engine. |
| **Language** | TypeScript | `5.7.3` | **Fully Implemented** | Strict mode enabled, path aliases (`@/*`, `@payload-config`). Configured in [`tsconfig.json`](tsconfig.json). |
| **CMS Platform** | Payload CMS | `3.90.1` | **Fully Implemented** | Initialized via `withPayload` in [`next.config.ts`](next.config.ts) and configured in [`payload/payload.config.ts`](payload/payload.config.ts). |
| **Database Adapter** | `@payloadcms/db-mongodb` | `3.90.1` | **Fully Implemented** | Mongoose adapter connecting to MongoDB via `DATABASE_URL`. |
| **Rich Text Editor** | `@payloadcms/richtext-lexical` | `3.90.1` | **Fully Implemented** | Lexical editor configured in [`payload/payload.config.ts`](payload/payload.config.ts). |
| **Image Processing** | `sharp` | `0.35.4` | **Fully Implemented** | Image resizing and optimization for media uploads in Payload CMS. |
| **CMS Theming** | `payload-theme` | `^0.9.4` | **Fully Implemented** | Configured with teal accent (`#0d9488`) in [`payload/plugins/index.ts`](payload/plugins/index.ts) and imported in [`app/(payload)/custom.scss`](app/(payload)/custom.scss). |
| **Authentication Engine** | `better-auth` | `^1.7.5` | **Fully Implemented** | Configured in [`payload/auth/config.ts`](payload/auth/config.ts) with email/password, Google OAuth, and account linking. |
| **Auth CMS Bridge** | `@delmaredigital/payload-better-auth` | `^0.13.0` | **Fully Implemented** | Connects Better Auth to Payload collections, admin login, and client SDK in [`payload/auth/client.ts`](payload/auth/client.ts). |
| **Email Service** | `nodemailer` | `^10.0.10` | **Fully Implemented** | SMTP transport with development console simulation in [`utils/sendEmail/index.ts`](utils/sendEmail/index.ts). |
| **Email Adapter** | Payload Email Adapter | Custom | **Fully Implemented** | Custom Nodemailer adapter bridging Payload CMS emails in [`utils/sendEmail/payloadAdapter.ts`](utils/sendEmail/payloadAdapter.ts). |
| **Email Templates** | Responsive HTML Templates | Custom | **Fully Implemented** | Branded HTML templates for password reset, email verification, and password changed notifications in [`utils/sendEmail/templates/`](utils/sendEmail/templates/). |
| **Styling** | Tailwind CSS | `^4.3.3` | **Fully Implemented** | Tailwind v4 via `@tailwindcss/postcss` with `@theme inline` and OKLCH color variables in [`app/globals.css`](app/globals.css). |
| **Animations** | `tw-animate-css` | `^1.4.0` | **Fully Implemented** | Keyframe animations imported in [`app/globals.css`](app/globals.css). |
| **UI Components** | Shadcn UI / Custom | Custom | **Fully Implemented** | 11 reusable components in [`components/ui/`](components/ui/) (`Alert`, `Button`, `Card`, `Field`, `Input`, `InputGroup`, `Label`, `Separator`, `Spinner`, `Textarea`, `Toast`). |
| **UI Primitives** | `radix-ui` | `^1.6.7` | **Fully Implemented** | Primitives used in `Button` (`Slot`), `Label`, and `Separator`. |
| **Toast Primitive** | `@base-ui/react` | `^1.8.0` | **Fully Implemented** | Toast manager and primitives used in [`components/ui/toast.tsx`](components/ui/toast.tsx). |
| **Icons** | `lucide-react` | `^1.47.0` | **Fully Implemented** | Icons across authentication forms, step indicators, and UI components. |
| **Variant Styling** | `class-variance-authority` | `^0.7.1` | **Fully Implemented** | Used for variant resolution in `Button`, `Alert`, `Field`, and `InputGroup`. |
| **Class Merging** | `cn` | `^0.3.0` | **Fully Implemented** | Re-exported from [`lib/utils.ts`](lib/utils.ts) for class combination. |
| **API & GraphQL** | `@payloadcms/next` / `graphql` | `3.90.1` / `^16.8.1` | **Fully Implemented** | REST API at `/api/[...slug]`, GraphQL at `/api/graphql`, and Playground at `/api/graphql-playground`. |
| **Collections: Users** | Payload Collection | Custom | **Fully Implemented** | Auth collection with Better Auth strategy, role field (`admin` / `user`), and access controls in [`payload/collections/Users.ts`](payload/collections/Users.ts). |
| **Collections: Media** | Payload Collection | Custom | **Fully Implemented** | Upload collection with public read access and alt text field in [`payload/collections/Media.ts`](payload/collections/Media.ts). |
| **Auth UI: Login** | Client Component | Custom | **Fully Implemented** | Email/password and Google OAuth sign-in with password toggle in [`app/(frontend)/auth/login/`](app/(frontend)/auth/login/). |
| **Auth UI: Sign Up** | Client Component | Custom | **Fully Implemented** | Registration form with name, email, password, and Google OAuth in [`app/(frontend)/auth/signup/`](app/(frontend)/auth/signup/). |
| **Auth UI: Logout** | Client Component | Custom | **Fully Implemented** | Automatic sign-out handler with loading spinner in [`app/(frontend)/auth/logout/`](app/(frontend)/auth/logout/). |
| **Auth UI: Reset Flow**| Multi-step Flow | Custom | **Fully Implemented** | 4-step password recovery flow (Request -> Verify -> Reset -> Success) in [`app/(frontend)/auth/forget/`](app/(frontend)/auth/forget/). |
| **Landing Page** | Server Component | Custom | *Minimal Placeholder* | Basic placeholder page rendering `"Hi"` in [`app/(frontend)/page.tsx`](app/(frontend)/page.tsx). |
| **Auth Profile** | React Component | Custom | *Empty Placeholder* | Empty stub component in [`components/auth/AuthProfile/index.tsx`](components/auth/AuthProfile/index.tsx). |
| **Access Helpers** | Access Control Stubs | Custom | *Incomplete Stubs* | [`payload/access/adminOnly.ts`](payload/access/adminOnly.ts) and [`payload/access/roleAccess.ts`](payload/access/roleAccess.ts) are empty functions. |
| **CMS Theme** | `payload-admin-theme` | `^1.2.0` | *Installed / Unused* | Imported in [`payload/payload.config.ts`](payload/payload.config.ts) but not used in plugins list. |
| **Env Loader** | `dotenv` | `16.4.7` | *Installed / Unused* | Next.js natively loads `.env` files; `dotenv` is not imported directly. |
| **CMS UI Core** | `@payloadcms/ui` | `3.90.1` | *Installed / Indirect*| Direct dependency in `package.json`, consumed internally by `@payloadcms/next`. |
| **Component CLI** | `shadcn` | `^4.21.0` | *Installed / CLI Only* | CLI package in `dependencies`; configured via [`components.json`](components.json). |
| **Testing** | `vitest`, `@testing-library/react`, `jsdom`, `@playwright/test` | Various | *Installed / Unconfigured* | Testing packages are present in `devDependencies`, but no test suites or config files exist. |
| **Git Hooks & Format**| `husky`, `prettier` | Various | *Installed / Unconfigured* | Present in `devDependencies`, but no `.husky/` directory or `.prettierrc` config exists. |

---

[![Top Langs](https://github-stats-extended.vercel.app/api/top-langs/?username=anuraghazra)](https://github.com/stats-organization/github-stats-extended)


## Architecture & Directory Structure

NextLoad uses Next.js Route Groups to isolate the frontend application from the Payload CMS administration panel and API handlers:

```text
nextload/
├── app/
│   ├── (frontend)/                    # Public-facing web application
│   │   ├── auth/                      # Authentication routes
│   │   │   ├── forget/                # 4-step password recovery wizard
│   │   │   │   ├── components/        # StepIndicator component
│   │   │   │   ├── reset/             # Step 3: Set new password
│   │   │   │   ├── success/           # Step 4: Success confirmation
│   │   │   │   ├── verify/            # Step 2: Verify reset token/code
│   │   │   │   ├── layout.tsx         # Auth guard & centered container
│   │   │   │   └── page.tsx           # Step 1: Request reset code
│   │   │   ├── login/                 # Login page & LoginForm
│   │   │   ├── logout/                # Sign-out handler page
│   │   │   └── signup/                # Registration page & SignUpForm
│   │   ├── layout.tsx                 # Root frontend layout (Metadata, Providor)
│   │   └── page.tsx                   # Landing page (placeholder)
│   ├── (payload)/                     # Payload CMS route group
│   │   ├── admin/                     # Payload CMS Admin Panel
│   │   │   ├── [[...segments]]/       # Catch-all admin routes & 404 handler
│   │   │   └── importMap.js           # Auto-generated Payload component map
│   │   ├── api/                       # CMS backend endpoints
│   │   │   ├── [...slug]/             # Payload REST API endpoints
│   │   │   ├── graphql/               # GraphQL API endpoint
│   │   │   └── graphql-playground/    # GraphQL Playground explorer
│   │   ├── custom.scss                # Admin styling & theme imports
│   │   └── layout.tsx                 # Payload server function layout
│   └── globals.css                    # Tailwind CSS v4 tokens & OKLCH color scheme
├── components/
│   ├── auth/
│   │   └── AuthProfile/               # Profile widget (placeholder stub)
│   └── ui/                            # Shadcn UI component suite
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── field.tsx
│       ├── input.tsx
│       ├── input-group.tsx
│       ├── label.tsx
│       ├── separator.tsx
│       ├── spinner.tsx
│       ├── textarea.tsx
│       └── toast.tsx                  # Toast system backed by @base-ui/react
├── config/
│   ├── roles.ts                       # Role definitions: ['admin', 'user']
│   ├── site.ts                        # SiteConfig: metadata, SEO, and appearance
│   └── trustedOrigins.ts              # Trusted origins for Better Auth
├── lib/
│   └── utils.ts                       # Class name utility (re-exports `cn`)
├── payload/
│   ├── access/                        # Access control rules (adminOnly, roleAccess, publicAccess)
│   ├── auth/                          # Better Auth configuration
│   │   ├── client.ts                  # Better Auth React client SDK
│   │   └── config.ts                  # Better Auth server options & email hooks
│   ├── collections/                   # Payload Collections
│   │   ├── Media.ts                   # Media upload collection
│   │   └── Users.ts                   # User collection with Better Auth strategy
│   ├── plugins/                       # Payload plugin array
│   │   └── index.ts                   # Better Auth collections, plugin, and theme
│   ├── providors/                     # Global providers
│   │   └── index.tsx                  # Providers wrapper (renders Toaster)
│   ├── payload-types.ts               # Auto-generated TypeScript types
│   └── payload.config.ts              # Main Payload CMS configuration
├── utils/
│   ├── index.ts                       # Re-exports email utilities
│   └── sendEmail/                     # Transactional email service
│       ├── templates/                 # Responsive HTML templates
│       │   ├── base.ts                # Base responsive email wrapper
│       │   ├── password-changed.ts    # Password changed alert template
│       │   ├── reset-password.ts      # Reset password email template
│       │   └── verify-email.ts        # Email verification template
│       ├── index.ts                   # Nodemailer transporter & sending helpers
│       └── payloadAdapter.ts          # Custom email adapter for Payload CMS
├── components.json                    # Shadcn configuration (base-nova, lucide)
├── eslint.config.mjs                  # ESLint flat configuration
├── next.config.ts                     # Next.js config wrapped with `withPayload`
├── package.json                       # Dependencies and project scripts
├── postcss.config.mjs                 # PostCSS configuration for Tailwind v4
└── tsconfig.json                      # TypeScript configuration
```

---

## Authentication & User Management

Authentication is powered by **Better Auth** and bridged to Payload CMS via `@delmaredigital/payload-better-auth`.

### How It Works

1. **Database Delegation:** Better Auth does not maintain a separate database connection; it uses `payloadAdapter({ payloadClient: payload })` to persist sessions, accounts, and verifications directly through Payload CMS.
2. **Custom Users Collection:** Configured in [`payload/collections/Users.ts`](payload/collections/Users.ts) with `disableLocalStrategy: true` and `betterAuthStrategy()`.
3. **Roles & Permissions:**
   - Two roles are defined in [`config/roles.ts`](config/roles.ts): `'admin'` and `'user'`.
   - The `role` field on the user model defaults to `'user'` and has `input: false` on the client to prevent privilege escalation during registration.
   - Admin panel access requires the `'admin'` role or explicit roles configured in [`payload/plugins/index.ts`](payload/plugins/index.ts).
4. **Session Lifetime:** Sessions are configured with an expiration of 30 days (`60 * 60 * 24 * 30` seconds).
5. **Account Linking:** Configured to allow linking social providers (Google) to existing email accounts with implicit linking disabled.

### Client-Side Authentication Flows

- **Login (`/auth/login`):**
  - Sign in via Email and Password (`authClient.signIn.email`) with `rememberMe: true`.
  - Sign in via Google OAuth (`authClient.signIn.social({ provider: 'google' })`).
  - Password visibility toggle and inline error notifications via toasts.
  - Redirects to `/dashboard` upon success.
- **Sign Up (`/auth/signup`):**
  - Register with Full Name, Email, and Password (`authClient.signUp.email`).
  - Google OAuth sign-up support.
  - Redirects to `/dashboard` upon success.
- **Logout (`/auth/logout`):**
  - Calls `authClient.signOut()`, displays a loading spinner, and redirects to `/auth/login`.
- **Password Reset Wizard (`/auth/forget`):**
  - **Step 1: Request Code (`/auth/forget`):** Enters email address to receive a reset token/code.
  - **Step 2: Verify Code (`/auth/forget/verify`):** Enters token received via email, with option to resend.
  - **Step 3: Set Password (`/auth/forget/reset`):** Validates password length (minimum 8 characters) and confirmation match, then calls `authClient.resetPassword`.
  - **Step 4: Success (`/auth/forget/success`):** Displays confirmation and directs the user to sign in.

---

## Email System & Templates

NextLoad includes a transactional email subsystem located in [`utils/sendEmail/`](utils/sendEmail/).

### SMTP Transport & Fallback Simulation

Configured using Nodemailer in [`utils/sendEmail/index.ts`](utils/sendEmail/index.ts):
- Connects to an external SMTP server defined by `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS`.
- **Development Simulation:** If `SMTP_USER` or `SMTP_PASS` are not set in the environment, email attempts are safely intercepted and logged directly to the console instead of throwing errors.

### Responsive HTML Email Templates

All templates inherit from a responsive base layout ([`utils/sendEmail/templates/base.ts`](utils/sendEmail/templates/base.ts)) featuring a branded header, styled CTA buttons, code boxes, alert banners, and a footer:
1. **Password Reset (`getResetPasswordEmailTemplate`):** Includes a direct reset action button, verification code display, and 1-hour expiration notice.
2. **Email Verification (`getVerifyEmailTemplate`):** Includes a verification button, verification code, and 24-hour expiration notice.
3. **Password Changed Alert (`getPasswordChangedEmailTemplate`):** Security notification informing the user that their password was updated, with security advice.

### Payload CMS Email Adapter

[`utils/sendEmail/payloadAdapter.ts`](utils/sendEmail/payloadAdapter.ts) provides a custom `payloadEmailAdapter()` that routes all internal Payload CMS emails (such as system notifications) through the shared Nodemailer SMTP transporter.

---

## Payload CMS Collections & Administration

The Payload CMS configuration is located in [`payload/payload.config.ts`](payload/payload.config.ts).

### Collections

1. **`Users` (`payload/collections/Users.ts`):**
   - **Slug:** `users`
   - **Authentication:** Local strategy disabled; Better Auth strategy attached.
   - **Fields:**
     - `email`: Required, unique email string.
     - `emailVerified`: Boolean checkbox (default: `false`).
     - `name`: Text string.
     - `image`: Text string (URL to avatar).
     - `role`: Select field with options `user` and `admin` (default: `user`).
   - **Access Control:**
     - `read`: Admins can read all users; non-admins can only read their own record (`id == req.user.id`).
     - `admin`: Restricted to users where `req.user.role === 'admin'`.
2. **`Media` (`payload/collections/Media.ts`):**
   - **Slug:** `media`
   - **Uploads:** Enabled (`upload: true`), with image resizing powered by `sharp`.
   - **Fields:** `alt` (required text).
   - **Access Control:** Public read access (`read: () => true`).
   - **Image Optimization:** Allowed in Next.js via `localPatterns` in `next.config.ts` under `/api/media/file/**`.

### Admin Customization

- **Path:** `/admin`
- **Theme:** Configured via `payload-theme` with a teal primary accent color (`#0d9488`).
- **Styles:** Loaded through [`app/(payload)/custom.scss`](app/(payload)/custom.scss).

---

## UI & Design System

- **Tailwind CSS v4:** Modern CSS-first configuration via `@import "tailwindcss";` in [`app/globals.css`](app/globals.css).
- **OKLCH Color Variables:** Full light and dark mode color definitions using OKLCH color space for perceptually uniform gradients and contrast.
- **Component Primitives:**
  - **Radix UI:** Headless primitives for accessible buttons, labels, and separators.
  - **Base UI:** `@base-ui/react/toast` powering a physics-based, swipeable toast notification system.
  - **Class Variance Authority:** Type-safe styling variants for `Button`, `Alert`, `Field`, and `InputGroup`.

---

## Environment Variables

Create a `.env` file in the root directory. The following table details every variable used by the application:

| Variable | Required | Description | Example / Default |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | MongoDB connection string for Payload CMS and Mongoose. | `mongodb://127.0.0.1:27017/nextload` |
| `PAYLOAD_SECRET` | **Yes** | Secret encryption key used by Payload CMS for signing cookies and tokens. | `your-secure-payload-secret` |
| `BETTER_AUTH_SECRET` | **Yes** | Secret encryption key used by Better Auth to sign tokens and sessions. | `your-secure-better-auth-secret` |
| `BETTER_AUTH_URL` | **Yes** | Base URL of the application for Better Auth callbacks and redirects. | `http://localhost:3000` |
| `SMTP_HOST` | No | SMTP server hostname. Defaults to `smtp.example.com` if unset. | `smtp.resend.com` or `smtp.gmail.com` |
| `SMTP_PORT` | No | SMTP server port. Defaults to `587` (or `465` for SSL). | `587` |
| `SMTP_SECURE` | No | Set to `"true"` to enforce SSL/TLS (automatically true if port is 465). | `false` |
| `SMTP_USER` | No | SMTP authentication username. If empty, emails log to console. | `apikey` or `user@example.com` |
| `SMTP_PASS` | No | SMTP authentication password or API key. | `your-smtp-password` |
| `SMTP_FROM` | No | Default "From" email address for outbound messages. | `"NextLoad" <noreply@example.com>` |
| `SMTP_DOMAIN` | No | Fallback domain used by Payload email adapter if `SMTP_FROM` is unset. | `example.com` |
| `GOOGLE_CLIENT_ID` | No | Google OAuth 2.0 Client ID for social authentication. | `xxxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET`| No | Google OAuth 2.0 Client Secret for social authentication. | `your-google-client-secret` |

---

## Getting Started

### Prerequisites

- **Node.js:** `^18.20.2 || >=20.9.0`
- **pnpm:** `^9 || ^10 || ^11`
- **MongoDB:** A running MongoDB database instance (local or hosted like MongoDB Atlas).

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nextload
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL=mongodb://127.0.0.1:27017/nextload
   PAYLOAD_SECRET=replace-with-a-random-secret-key-min-32-chars
   BETTER_AUTH_SECRET=replace-with-a-random-secret-key-min-32-chars
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Access the application:**
   - **Frontend Application:** [http://localhost:3000](http://localhost:3000)
   - **Payload Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)
   - **GraphQL Playground:** [http://localhost:3000/api/graphql-playground](http://localhost:3000/api/graphql-playground)

---

## Available Scripts

All scripts are configured in [`package.json`](package.json) and utilize `cross-env`:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `pnpm dev` | `cross-env NODE_OPTIONS=--no-deprecation next dev` | Starts the Next.js development server. |
| `pnpm devsafe` | `rm -rf .next && cross-env NODE_OPTIONS=--no-deprecation next dev` | Clears `.next` build cache and starts development server. |
| `pnpm build` | `cross-env NODE_OPTIONS="--no-deprecation --max-old-space-size=8000" next build` | Compiles the production Next.js and Payload CMS build. |
| `pnpm start` | `cross-env NODE_OPTIONS=--no-deprecation next start` | Starts the production server after building. |
| `pnpm lint` | `cross-env NODE_OPTIONS=--no-deprecation eslint .` | Runs ESLint across the project. |
| `pnpm payload` | `cross-env NODE_OPTIONS=--no-deprecation payload` | Executes Payload CMS CLI commands. |
| `pnpm generate:types` | `cross-env NODE_OPTIONS=--no-deprecation payload generate:types` | Regenerates `payload-types.ts` from collection schemas. |
| `pnpm generate:importmap` | `cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap` | Regenerates the Payload admin component import map. |

---

## Implementation Notes & Current State

To maintain complete transparency regarding what is and is not yet implemented:

- **Root Landing Page:** [`app/(frontend)/page.tsx`](app/(frontend)/page.tsx) is currently a minimal `"Hi"` placeholder; your custom landing page or marketing layout should be implemented here.
- **User Profile Component:** [`components/auth/AuthProfile/index.tsx`](components/auth/AuthProfile/index.tsx) is currently an empty placeholder.
- **Access Control Helpers:** [`payload/access/adminOnly.ts`](payload/access/adminOnly.ts) and [`payload/access/roleAccess.ts`](payload/access/roleAccess.ts) are stub functions. Actual collection access control is currently implemented directly inside [`payload/collections/Users.ts`](payload/collections/Users.ts).
- **Testing Frameworks:** Packages for Vitest, Testing Library, and Playwright are installed in `devDependencies`, but no configuration files or test suites exist in the repository yet.
- **Git Hooks & Prettier:** Husky and Prettier are installed in `devDependencies`, but git hooks and formatting configurations have not yet been initialized.
