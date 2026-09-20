# Scripts

This directory contains developer tooling scripts for NextLoad.

---

## `init.mjs` — Project Initializer

The single-command setup for anyone who clones the NextLoad boilerplate.

### Usage

```bash
pnpm init:project
# or directly
node scripts/init.mjs
```

### What it does

1. **Prompts** for your project name, tagline, logo initials, and app URL
2. **Updates `config/site.ts`** — site name, title, logoText, SEO template
3. **Updates `payload/globals/SiteSettings.ts`** — Admin panel default brand values
4. **Sets up `.env`** — copies `.env.example` if `.env` doesn't exist, patches DB name
5. **Resets `data/notifications/broadcasts.json`** — clears demo notification data
6. **Updates `package.json`** — project name and description

### What it does NOT touch

- Your custom components, pages, or layouts
- Payload collections, globals schema, or config
- Authentication configuration
- Dashboard, sidebar, activity, notification system logic
- Any TypeScript source beyond the two config files listed above

### Safety

- **Idempotent** — safe to run multiple times
- **No external dependencies** — uses only Node.js built-ins (`fs`, `readline`, `path`)
- **Non-destructive** — uses targeted string replacement, not full file rewrites
