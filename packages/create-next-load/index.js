#!/usr/bin/env node

/**
 * create-next-load
 * ──────────────────────────────────────────
 * CLI to scaffold a new NextLoad application.
 * Usage: npx create-next-load [project-name]
 */

import { existsSync, readFileSync, writeFileSync, rmSync } from 'fs'
import { resolve, join } from 'path'
import { createInterface } from 'readline'
import { spawnSync } from 'child_process'
import { randomBytes } from 'crypto'

const REPO_URL = 'https://github.com/shatadhru/NextLoad.git'

// ANSI রঙ — কোনো বাহ্যিক ডিপেন্ডেন্সি ছাড়াই
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  gray:   '\x1b[90m',
  blue:   '\x1b[34m',
  magenta:'\x1b[35m',
  white:  '\x1b[97m',
}

// ─────────────────────────────────────────────────────────
// টার্মিনাল ক্লিয়ার ও কার্সরের পজিশন ঠিক রাখার ANSI কোড
const CLEAR_SCREEN = '\x1Bc'

// নাচের বিভিন্ন ফ্রেম (ASCII আর্ট)
const danceFrames = [
  `
     (•_•)
    <)   )╯  ♪ Installing... ♪
     /   \\
  `,
  `
     ( •_•)
    \\(   (>  ♫ Installing... ♫
     /   \\
  `,
  `
     (•_•)
     ~(   )~  ♪ Almost there! ♪
      /   \\
  `,
  `
     (•_•)
     <)   )>  ♫ Loading deps! ♫
      \\   /
  `
]

function startDanceAnimation(label = 'Working') {
  let currentFrame = 0
  const interval = setInterval(() => {
    process.stdout.write(
      CLEAR_SCREEN +
      `\n${c.cyan}${c.bold}  ▲ NextLoad Starter CLI${c.reset}\n` +
      `\n${c.magenta}${danceFrames[currentFrame]}${c.reset}` +
      `\n  ${c.cyan}${label}...${c.reset}\n`
    )
    currentFrame = (currentFrame + 1) % danceFrames.length
  }, 250)
  return interval
}

function stopDanceAnimation(interval) {
  clearInterval(interval)
  process.stdout.write(CLEAR_SCREEN)
}

// ─────────────────────────────────────────────────────────

function prompt(rl, question, defaultValue = '') {
  return new Promise((res) => {
    const hint = defaultValue ? ` ${c.gray}(${defaultValue})${c.reset}` : ''
    rl.question(`${c.cyan}?${c.reset} ${c.bold}${question}${c.reset}${hint}: `, (answer) => {
      res(answer.trim() || defaultValue)
    })
  })
}

// কিউট এন্ডিং — "Thank you from NextLoad Team, Bangladesh"
function printCuteEnding(projectName, baseUrl) {
  const line  = `${c.cyan}${'─'.repeat(54)}${c.reset}`
  const heart = `${c.red}❤${c.reset}`
  const bd    = `${c.green}${c.bold}Bangladesh${c.reset}`

  console.log(`\n${line}`)
  console.log(`\n  ${c.green}${c.bold}✔  Project ready!${c.reset}  ${c.bold}${projectName}${c.reset} is all set.\n`)
  console.log(`  ${c.cyan}Next steps:${c.reset}`)
  console.log(`    ${c.cyan}cd${c.reset} ${projectName}`)
  console.log(`    ${c.cyan}npm run dev${c.reset}\n`)
  console.log(`  ${c.gray}App URL:${c.reset}     ${c.bold}${baseUrl}${c.reset}`)
  console.log(`  ${c.gray}Admin panel:${c.reset} ${c.bold}${baseUrl}/admin${c.reset}`)
  console.log(`\n${line}`)
  console.log(`
  ${c.magenta}${c.bold}(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧${c.reset}  ${c.white}Happy Hacking!${c.reset} ${c.yellow}🚀${c.reset}

  ${c.dim}Made with ${heart} by the${c.reset} ${c.cyan}${c.bold}NextLoad Team${c.reset}
  ${c.dim}from beautiful${c.reset} ${bd} ${c.yellow}🇧🇩${c.reset}

  ${c.gray}Star us ⭐  https://github.com/shatadhru/NextLoad${c.reset}
`)
  console.log(`${line}\n`)
}

async function main() {
  // ─── হেডার ───────────────────────────────────────────
  console.log(`\n${c.cyan}${c.bold}  ▲ NextLoad Starter CLI${c.reset}`)
  console.log(`${c.gray}  Scaffold a production-ready Next.js + Payload app.${c.reset}\n`)

  const rl = createInterface({ input: process.stdin, output: process.stdout })

  try {
    // 1. প্রজেক্টের নাম
    let projectName = process.argv[2]
    if (!projectName) {
      projectName = await prompt(rl, 'Project name', 'my-nextload-app')
    }

    const targetDir = resolve(process.cwd(), projectName)

    if (existsSync(targetDir)) {
      console.log(`\n${c.red}✖ Directory "${projectName}" already exists. Choose a different name or remove it.${c.reset}\n`)
      rl.close()
      process.exit(1)
    }

    // 2. MongoDB ব্যবহার করবেন?
    const mongoAnswer = await prompt(rl, 'Use MongoDB? (Yes/No)', 'Yes')
    const useMongo = /^(y|yes|true|1)$/i.test(mongoAnswer)

    // 3. MongoDB URL
    let mongoUrl = ''
    if (useMongo) {
      mongoUrl = await prompt(rl, 'MongoDB URL', 'mongodb://localhost:27017/nextload')
    }

    // 4. বেস URL
    const baseUrl = await prompt(rl, 'Base URL', 'http://localhost:3000')

    rl.close()

    console.log(`\n${c.gray}  Creating project in ${c.bold}${targetDir}${c.reset}...\n`)

    // 5. রিপোজিটরি ক্লোন করা
    console.log(`${c.cyan}→ Cloning NextLoad repository...${c.reset}`)
    const cloneResult = spawnSync('git', ['clone', '--depth=1', REPO_URL, targetDir], {
      stdio: 'inherit',
    })

    if (cloneResult.status !== 0) {
      console.error(`\n${c.red}✖ Failed to clone repository from ${REPO_URL}.${c.reset}`)
      console.error(`${c.yellow}  Please ensure git is installed and you have an internet connection.${c.reset}\n`)
      process.exit(1)
    }

    // 6. .git ইতিহাস ও packages ফোল্ডার মুছে ফেলা
    const gitDir = join(targetDir, '.git')
    if (existsSync(gitDir)) rmSync(gitDir, { recursive: true, force: true })

    const packagesDir = join(targetDir, 'packages')
    if (existsSync(packagesDir)) rmSync(packagesDir, { recursive: true, force: true })

    // 7. .env কনফিগ করা
    console.log(`${c.cyan}→ Configuring environment variables (.env)...${c.reset}`)
    const envExamplePath = join(targetDir, '.env.example')
    const envPath        = join(targetDir, '.env')

    let envContent = existsSync(envExamplePath) ? readFileSync(envExamplePath, 'utf8') : ''

    const payloadSecret    = randomBytes(32).toString('hex')
    const betterAuthSecret = randomBytes(32).toString('hex')

    const replaceOrAppend = (content, key, value) => {
      const regex = new RegExp(`${key}=.*`, 'g')
      return content.includes(`${key}=`)
        ? content.replace(regex, `${key}=${value}`)
        : content + `\n${key}=${value}`
    }

    if (useMongo && mongoUrl) {
      envContent = replaceOrAppend(envContent, 'DATABASE_URL', mongoUrl)
    } else {
      envContent = envContent.includes('DATABASE_URL=')
        ? envContent.replace(/DATABASE_URL=.*/g, '# DATABASE_URL= (MongoDB disabled)')
        : envContent + '\n# DATABASE_URL= (MongoDB disabled)'
    }

    envContent = replaceOrAppend(envContent, 'BETTER_AUTH_URL',     baseUrl)
    envContent = replaceOrAppend(envContent, 'NEXT_PUBLIC_APP_URL', baseUrl)
    envContent = replaceOrAppend(envContent, 'PAYLOAD_SECRET',      payloadSecret)
    envContent = replaceOrAppend(envContent, 'BETTER_AUTH_SECRET',  betterAuthSecret)

    writeFileSync(envPath, envContent, 'utf8')

    // 8. package.json আপডেট করা — cross-env ঠিক করা ও husky prepare সরানো
    const pkgPath = join(targetDir, 'package.json')
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

        // প্রজেক্টের নাম ও ভার্সন সেট করা
        pkg.name    = projectName.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
        pkg.version = '0.1.0'

        // cross-env শুধু dependencies-এ রাখা (devDependencies থেকে সরানো)
        // এটাই "cross-env not found" এরর ঠিক করে
        if (!pkg.dependencies) pkg.dependencies = {}
        pkg.dependencies['cross-env'] = '^7.0.3'

        if (pkg.devDependencies) {
          delete pkg.devDependencies['cross-env']
        }

        // husky prepare স্ক্রিপ্ট সরানো — husky আউটপুট লুকানো
        if (pkg.scripts && pkg.scripts.prepare === 'husky') {
          delete pkg.scripts.prepare
        }

        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')
      } catch {
        // package.json ফরম্যাটিং সমস্যা থাকলে এড়িয়ে যাও
      }
    }

    // 9. npm install চালানো — ড্যান্স অ্যানিমেশন দেখানো (husky আউটপুট লুকানো)
    console.log(`\n${c.cyan}→ Installing dependencies...${c.reset}`)

    // ড্যান্স অ্যানিমেশন শুরু
    const danceInterval = startDanceAnimation('Installing packages')

    // npm install — stdio: 'pipe' দিয়ে হুস্কি ও অন্য নয়েজি আউটপুট লুকানো
    const installResult = spawnSync('npm', ['install', '--no-fund', '--no-audit'], {
      cwd:   targetDir,
      stdio: 'pipe',   // ← হুস্কি ও অন্য verbose আউটপুট লুকানো
      shell: true,
      env:   { ...process.env, HUSKY: '0' }, // ← husky সম্পূর্ণ বন্ধ করা
    })

    // ড্যান্স থামানো ও স্ক্রিন রিসেট
    stopDanceAnimation(danceInterval)

    // হেডার আবার দেখানো (ড্যান্স স্ক্রিন ক্লিয়ার করার পরে)
    console.log(`\n${c.cyan}${c.bold}  ▲ NextLoad Starter CLI${c.reset}\n`)

    if (installResult.status !== 0) {
      console.log(`${c.yellow}⚠ npm install finished with warnings. You can re-run npm install inside the project.${c.reset}`)
    } else {
      console.log(`${c.green}✔ Dependencies installed successfully!${c.reset}`)
    }

    // 10. কিউট এন্ডিং
    printCuteEnding(projectName, baseUrl)

  } catch (err) {
    rl.close()
    console.error(`\n${c.red}✖ An error occurred:${c.reset}`, err.message)
    process.exit(1)
  }
}

main()
