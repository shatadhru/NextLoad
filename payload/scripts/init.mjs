#!/usr/bin/env node
/**
 * NextLoad Project Initializer
 * ─────────────────────────────
 * Run with: pnpm init:project
 *
 * What this does:
 *   1. Asks for your project name, tagline, logo initials, and URL
 *   2. Updates config/site.ts with your branding
 *   3. Updates payload/globals/SiteSettings.ts defaultValues
 *   4. Copies .env.example → .env if .env doesn't exist, patches DB name
 *   5. Resets data/notifications/broadcasts.json to []
 *   6. Updates package.json name and description
 *   7. Prints a clean summary and next steps
 *
 * Safe to re-run (idempotent). Never touches your custom components or architecture.
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from 'fs'
import { createInterface } from 'readline'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

// ─── Helpers ───────────────────────────────────────────────────────────────

const read = (p) => readFileSync(resolve(ROOT, p), 'utf8')
const write = (p, content) => writeFileSync(resolve(ROOT, p), content, 'utf8')
const exists = (p) => existsSync(resolve(ROOT, p))

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function prompt(rl, question, defaultValue) {
  return new Promise((resolve) => {
    const hint = defaultValue ? ` (${defaultValue})` : ''
    rl.question(`\x1b[36m${question}${hint}:\x1b[0m `, (answer) => {
      resolve(answer.trim() || defaultValue || '')
    })
  })
}

function log(msg) { process.stdout.write(msg + '\n') }
function success(msg) { log(`\x1b[32m  ✔  ${msg}\x1b[0m`) }
function info(msg) { log(`\x1b[90m  →  ${msg}\x1b[0m`) }
function warn(msg) { log(`\x1b[33m  ⚠  ${msg}\x1b[0m`) }
function header(msg) { log(`\n\x1b[1m\x1b[34m${msg}\x1b[0m`) }
function divider() { log('\x1b[90m' + '─'.repeat(60) + '\x1b[0m') }

// ─── Updaters ──────────────────────────────────────────────────────────────

/**
 * Update config/site.ts by performing safe string replacements
 * on well-known string values. Never rewrites the file structure.
 */
function updateSiteConfig(name, title, logoText, url) {
  const p = 'config/site.ts'
  let src = read(p)

  // name: "NextLoad" → "MySaaS"
  src = src.replace(
    /name:\s*["'][^"']*["']/,
    `name: "${name}"`
  )
  // title: "NextLoad - ..." → new title
  src = src.replace(
    /title:\s*["'][^"']*["'],/,
    `title: "${title}",`
  )
  // logoText: "NL" → "MS"
  src = src.replace(
    /logoText:\s*["'][^"']*["']/,
    `logoText: "${logoText}"`
  )
  // seo.title.default: "NextLoad" → "MySaaS"
  src = src.replace(
    /default:\s*["'][^"']*["'],/,
    `default: "${name}",`
  )
  // seo.title.template: "%s | NextLoad" → "%s | MySaaS"
  src = src.replace(
    /template:\s*["'][^"']*["'],/,
    `template: "%s | ${name}",`
  )

  write(p, src)
}

/**
 * Update payload/globals/SiteSettings.ts defaultValues so the
 * Payload Admin panel also shows the correct brand by default.
 */
function updateSiteSettingsGlobal(name, title, logoText) {
  const p = 'payload/globals/SiteSettings.ts'
  if (!exists(p)) return false
  let src = read(p)

  // defaultValue: "NextLoad" (siteName field)
  src = src.replace(
    /(name:\s*["']siteName["'][^}]*?defaultValue:\s*["'])[^"']*["']/s,
    `$1${name}"`
  )
  // defaultValue: "NextLoad - ..." (siteTitle field)
  src = src.replace(
    /(name:\s*["']siteTitle["'][^}]*?defaultValue:\s*["'])[^"']*["']/s,
    `$1${title}"`
  )
  // defaultValue: "NL" (logoText field)
  src = src.replace(
    /(name:\s*["']logoText["'][^}]*?defaultValue:\s*["'])[^"']*["']/s,
    `$1${logoText}"`
  )

  write(p, src)
  return true
}

/**
 * Copy .env.example → .env (if .env doesn't exist) and patch DB name.
 */
function setupEnv(projectSlug) {
  const envPath = resolve(ROOT, '.env')
  const examplePath = resolve(ROOT, '.env.example')

  if (exists('.env')) {
    // .env already exists — only patch DATABASE_URL if it still has the example DB name
    let env = read('.env')
    if (env.includes('mongodb://127.0.0.1:27017/nextload') || env.includes('mongodb://127.0.0.1/nextload')) {
      env = env.replace(
        /DATABASE_URL=mongodb:\/\/127\.0\.0\.1(?::27017)?\/[^\s\r\n]*/,
        `DATABASE_URL=mongodb://127.0.0.1:27017/${projectSlug}`
      )
      write('.env', env)
      return 'patched'
    }
    return 'exists'
  }

  if (!exists('.env.example')) {
    warn('.env.example not found — skipping .env setup')
    return 'skipped'
  }

  let env = read('.env.example')
  // Patch database URL
  env = env.replace(
    /DATABASE_URL=mongodb:\/\/127\.0\.0\.1(?::27017)?\/[^\s\r\n]*/,
    `DATABASE_URL=mongodb://127.0.0.1:27017/${projectSlug}`
  )
  write('.env', env)
  return 'created'
}

/**
 * Reset data/notifications/broadcasts.json to an empty array.
 */
function resetBroadcasts() {
  const p = 'data/notifications/broadcasts.json'
  if (!exists(p)) {
    // ensure directory exists
    const dir = resolve(ROOT, 'data/notifications')
    mkdirSync(dir, { recursive: true })
  }
  write(p, '[]\n')
}

/**
 * Update package.json name and description.
 */
function updatePackageJson(slug, name) {
  const p = 'package.json'
  const pkg = JSON.parse(read(p))
  pkg.name = slug
  pkg.description = `${name} — built with NextLoad boilerplate`
  write(p, JSON.stringify(pkg, null, 2) + '\n')
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  divider()
  log(`\x1b[1m\x1b[34m  NextLoad — Project Initializer\x1b[0m`)
  log(`\x1b[90m  Customize your boilerplate for your project.\x1b[0m`)
  divider()

  const rl = createInterface({ input: process.stdin, output: process.stdout })

  header('Project Details')

  const name = await prompt(rl, 'Project / Brand Name', 'MyApp')
  const title = await prompt(rl, 'Site Tagline', `${name} — Your tagline here`)
  const logoText = await prompt(rl, 'Logo Initials (2–3 chars)', name.slice(0, 2).toUpperCase())
  const appUrl = await prompt(rl, 'App URL', 'http://localhost:3000')

  rl.close()

  const slug = slugify(name)

  header('Initializing...')

  // 1. config/site.ts
  try {
    updateSiteConfig(name, title, logoText, appUrl)
    success(`config/site.ts updated — brand: "${name}", initials: "${logoText}"`)
  } catch (e) {
    warn(`config/site.ts — could not update: ${e.message}`)
  }

  // 2. payload/globals/SiteSettings.ts
  try {
    const updated = updateSiteSettingsGlobal(name, title, logoText)
    if (updated) {
      success(`payload/globals/SiteSettings.ts defaultValues updated`)
    } else {
      info(`payload/globals/SiteSettings.ts — not found, skipped`)
    }
  } catch (e) {
    warn(`payload/globals/SiteSettings.ts — could not update: ${e.message}`)
  }

  // 3. .env setup
  try {
    const result = setupEnv(slug)
    if (result === 'created') success(`.env created from .env.example — DB: "${slug}"`)
    else if (result === 'patched') success(`.env DATABASE_URL patched — DB: "${slug}"`)
    else if (result === 'exists') info(`.env already configured — skipped (remove to regenerate)`)
    else info(`.env setup skipped`)
  } catch (e) {
    warn(`.env setup failed: ${e.message}`)
  }

  // 4. Reset demo notification data
  try {
    resetBroadcasts()
    success(`data/notifications/broadcasts.json reset to []`)
  } catch (e) {
    warn(`broadcasts.json reset failed: ${e.message}`)
  }

  // 5. package.json
  try {
    updatePackageJson(slug, name)
    success(`package.json updated — name: "${slug}"`)
  } catch (e) {
    warn(`package.json — could not update: ${e.message}`)
  }

  divider()
  header('🎉  Done! Next steps:')
  log('')
  log(`  1. Edit \x1b[36m.env\x1b[0m and fill in your secrets:`)
  log(`       PAYLOAD_SECRET, BETTER_AUTH_SECRET,`)
  log(`       SMTP_*, GOOGLE_*, CLOUDINARY_*`)
  log('')
  log(`  2. Start the dev server:`)
  log(`       \x1b[36mpnpm dev\x1b[0m`)
  log('')
  log(`  3. Open the Payload Admin panel at:`)
  log(`       \x1b[36mhttp://localhost:3000/admin\x1b[0m`)
  log(`       → Site Settings → upload your logo`)
  log('')
  divider()
}

main().catch((e) => {
  log(`\n\x1b[31m  Error: ${e.message}\x1b[0m`)
  process.exit(1)
})
