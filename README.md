




<img width="2752" height="1536" alt="Gemini_Generated_Image_2jc8oz2jc8oz2jc8" src="https://github.com/user-attachments/assets/04779f74-a1d6-4606-bc78-e6edd72c5d76" />
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



# NextLoad

A production-ready Next.js boilerplate for building modern, scalable web applications faster.

NextLoad combines Next.js 16, Payload CMS, Better Auth, MongoDB, and a production-focused authentication and email infrastructure into a single, maintainable codebase.

---

## Overview

NextLoad provides a structured foundation for building full-stack web applications with Next.js.

It integrates content management, authentication, database connectivity, transactional email, and a reusable UI system while keeping the project architecture clean and easy to extend.


## Getting Started

### Prerequisites

- Node.js `^18.20.2 || >=20.9.0`
- pnpm `^9 || ^10 || ^11`
- MongoDB

### Installation

```bash
git clone <repository-url>
cd nextload
pnpm install
```

Create your environment file:

```bash
cp .env.example .env
```

Configure the required environment variables, then start the development server:

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

Payload Admin:

```text
http://localhost:3000/admin
```

GraphQL Playground:

```text
http://localhost:3000/api/graphql-playground
```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start the development server |
| `pnpm devsafe` | Clear the Next.js cache and start development |
| `pnpm build` | Build the production application |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm payload` | Run Payload CLI commands |
| `pnpm generate:types` | Generate Payload TypeScript types |
| `pnpm generate:importmap` | Generate the Payload import map |

---

### Key Highlights

- Next.js 16 with the App Router
- Payload CMS 3.90.1 with MongoDB
- Better Auth with email/password and Google OAuth
- Role-based user management
- Complete authentication flows
- Transactional email with SMTP and Nodemailer
- Responsive HTML email templates
- Tailwind CSS v4 with OKLCH color tokens
- Shadcn UI with Radix UI and Base UI primitives
- TypeScript with strict type checking
- Payload REST and GraphQL APIs

---

## Feature & Technology Inventory

The following table documents the technologies, packages, and major features currently implemented in the repository.

| Category | Technology | Version | Status | Implementation |
| :--- | :--- | :--- | :--- | :--- |
| Framework | Next.js | `16.3.3` | Implemented | App Router with frontend and Payload route groups |
| UI | React | `19.2.6` | Implemented | Core UI rendering |
| Language | TypeScript | `5.7.3` | Implemented | Strict mode with project path aliases |
| CMS | Payload CMS | `3.90.1` | Implemented | Native Next.js integration |
| Database | MongoDB | — | Implemented | Payload MongoDB adapter |
| Authentication | Better Auth | `1.7.5` | Implemented | Email/password, Google OAuth and account linking |
| Auth Integration | Payload Better Auth | `0.13.0` | Implemented | Connects Better Auth with Payload |
| Email | Nodemailer | `10.0.10` | Implemented | SMTP transport with development fallback |
| Rich Text | Lexical | `3.90.1` | Implemented | Payload rich text editor |
| Styling | Tailwind CSS | `4.3.3` | Implemented | CSS-first configuration with OKLCH tokens |
| Components | Shadcn UI | Custom | Implemented | Reusable UI component system |
| UI Primitives | Radix UI | `1.6.7` | Implemented | Accessible component primitives |
| UI Primitives | Base UI | `1.8.0` | Implemented | Toast primitives |
| Validation | Zod | — | Implemented | Schema validation |
| Forms | React Hook Form | — | Implemented | Form state and submission handling |
| API | Payload REST API | `3.90.1` | Implemented | REST API endpoints |
| API | GraphQL | `16.8.1` | Implemented | GraphQL API and Playground |
| Image Processing | Sharp | `0.35.4` | Implemented | Image resizing and optimization |
| Icons | Lucide React | `1.47.0` | Implemented | Application and UI icons |

---

## Features

### Authentication

Better Auth is integrated directly with Payload CMS and provides:

- Email and password authentication
- Google OAuth 2.0
- Account linking
- 30-day sessions
- Role-based access
- Login and registration flows
- Logout handling
- Password recovery workflow
- Email verification

### Email System

NextLoad includes a reusable transactional email system built with Nodemailer.

Supported email templates include:

- Password reset
- Email verification
- Password changed notification

When SMTP credentials are not configured, email delivery falls back to development-time console output.

### Payload CMS

Payload CMS is embedded directly into the Next.js application.

The current configuration includes:

- Users collection
- Media collection
- MongoDB integration
- Lexical rich text editor
- Sharp image processing
- REST API
- GraphQL API
- GraphQL Playground
- Customized admin theme

### UI System

The UI layer is built with Tailwind CSS, Shadcn UI, Radix UI, and Base UI.

The project includes reusable components for:

- Buttons
- Inputs
- Textareas
- Labels
- Cards
- Alerts
- Fields
- Separators
- Spinners
- Toast notifications

---

## Architecture

NextLoad uses Next.js Route Groups to separate the frontend application from the Payload CMS administration and API layer.

```text
nextload/
├── app/
│   ├── (frontend)/
│   │   ├── auth/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── (payload)/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── custom.scss
│   │   └── layout.tsx
│   │
│   └── globals.css
│
├── components/
│   ├── auth/
│   └── ui/
│
├── config/
│
├── lib/
│
├── payload/
│   ├── access/
│   ├── auth/
│   ├── collections/
│   ├── plugins/
│   ├── providers/
│   └── payload.config.ts
│
├── utils/
│   └── sendEmail/
│       └── templates/
│
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Environment Variables

Create a `.env` file in the project root.

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | MongoDB connection string |
| `PAYLOAD_SECRET` | Yes | Payload CMS secret |
| `BETTER_AUTH_SECRET` | Yes | Better Auth secret |
| `BETTER_AUTH_URL` | Yes | Application base URL |
| `SMTP_HOST` | No | SMTP server hostname |
| `SMTP_PORT` | No | SMTP server port |
| `SMTP_SECURE` | No | Enable SMTP TLS |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password or API key |
| `SMTP_FROM` | No | Default sender address |
| `SMTP_DOMAIN` | No | Payload email fallback domain |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |

---


## Current Implementation

NextLoad currently includes the core application infrastructure, authentication system, Payload CMS integration, database layer, email system, UI components, and API layer.

The following areas are intentionally incomplete:

- The root landing page is currently a minimal placeholder.
- The `AuthProfile` component is currently a placeholder.
- Some access-control helper files are currently stubs.
- Testing packages are installed, but test suites and configuration are not yet present.
- Prettier and Husky are installed, but their project configuration has not yet been initialized.

---

## License

This project is licensed under the terms specified in the repository.
