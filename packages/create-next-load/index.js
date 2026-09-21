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

// ANSI colors for clean, dependency-free terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  blue: '\x1b[34m',
}

function prompt(rl, question, defaultValue = '') {
  return new Promise((res) => {
    const defaultHint = defaultValue ? ` ${colors.gray}(${defaultValue})${colors.reset}` : ''
    rl.question(`${colors.cyan}?${colors.reset} ${colors.bold}${question}${colors.reset}${defaultHint}: `, (answer) => {
      res(answer.trim() || defaultValue)
    })
  })
}

async function main() {
  console.log(`\n${colors.cyan}${colors.bold}  ▲ NextLoad Starter CLI${colors.reset}\n`)

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    // 1. Project Directory / Name
    let projectName = process.argv[2]
    if (!projectName) {
      projectName = await prompt(rl, 'Project name', 'my-nextload-app')
    }

    const targetDir = resolve(process.cwd(), projectName)

    if (existsSync(targetDir)) {
      console.log(`\n${colors.red}✖ Directory "${projectName}" already exists. Please choose a different name or remove it.${colors.reset}\n`)
      process.exit(1)
    }

    // 2. Use MongoDB?
    const mongoAnswer = await prompt(rl, 'Use MongoDB? (Yes/No)', 'Yes')
    const useMongo = /^(y|yes|true|1)$/i.test(mongoAnswer)

    // 3. MongoDB URL (if Yes)
    let mongoUrl = ''
    if (useMongo) {
      mongoUrl = await prompt(rl, 'MongoDB URL', 'mongodb://localhost:27017/nextload')
    }

    // 4. Base URL
    const baseUrl = await prompt(rl, 'Base URL', 'http://localhost:3000')

    rl.close()

    console.log(`\n${colors.gray}Creating project in ${colors.bold}${targetDir}${colors.reset}...\n`)

    // 5. Clone repository
    console.log(`${colors.cyan}→ Cloning NextLoad repository...${colors.reset}`)
    const cloneResult = spawnSync('git', ['clone', '--depth=1', REPO_URL, targetDir], {
      stdio: 'inherit',
    })

    if (cloneResult.status !== 0) {
      console.error(`\n${colors.red}✖ Failed to clone repository from ${REPO_URL}.${colors.reset}`)
      console.error(`${colors.yellow}Please ensure git is installed and you have an active internet connection.${colors.reset}\n`)
      process.exit(1)
    }

    // 6. Clean up git history & nested CLI packages
    const gitDir = join(targetDir, '.git')
    if (existsSync(gitDir)) {
      rmSync(gitDir, { recursive: true, force: true })
    }

    const packagesDir = join(targetDir, 'packages')
    if (existsSync(packagesDir)) {
      rmSync(packagesDir, { recursive: true, force: true })
    }

    // 7. Apply Configuration to .env
    console.log(`${colors.cyan}→ Configuring environment variables (.env)...${colors.reset}`)
    const envExamplePath = join(targetDir, '.env.example')
    const envPath = join(targetDir, '.env')

    let envContent = existsSync(envExamplePath)
      ? readFileSync(envExamplePath, 'utf8')
      : ''

    // Generate random secure 32-character secrets
    const payloadSecret = randomBytes(32).toString('hex')
    const betterAuthSecret = randomBytes(32).toString('hex')

    // Apply MongoDB configuration
    if (useMongo && mongoUrl) {
      if (envContent.includes('DATABASE_URL=')) {
        envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL=${mongoUrl}`)
      } else {
        envContent += `\nDATABASE_URL=${mongoUrl}`
      }
    } else {
      if (envContent.includes('DATABASE_URL=')) {
        envContent = envContent.replace(/DATABASE_URL=.*/g, '# DATABASE_URL= (MongoDB disabled)')
      } else {
        envContent += '\n# DATABASE_URL= (MongoDB disabled)'
      }
    }

    // Apply Base URL
    if (envContent.includes('BETTER_AUTH_URL=')) {
      envContent = envContent.replace(/BETTER_AUTH_URL=.*/g, `BETTER_AUTH_URL=${baseUrl}`)
    } else {
      envContent += `\nBETTER_AUTH_URL=${baseUrl}`
    }

    if (envContent.includes('NEXT_PUBLIC_APP_URL=')) {
      envContent = envContent.replace(/NEXT_PUBLIC_APP_URL=.*/g, `NEXT_PUBLIC_APP_URL=${baseUrl}`)
    } else {
      envContent += `\nNEXT_PUBLIC_APP_URL=${baseUrl}`
    }

    // Apply Secrets
    if (envContent.includes('PAYLOAD_SECRET=')) {
      envContent = envContent.replace(/PAYLOAD_SECRET=.*/g, `PAYLOAD_SECRET=${payloadSecret}`)
    } else {
      envContent += `\nPAYLOAD_SECRET=${payloadSecret}`
    }

    if (envContent.includes('BETTER_AUTH_SECRET=')) {
      envContent = envContent.replace(/BETTER_AUTH_SECRET=.*/g, `BETTER_AUTH_SECRET=${betterAuthSecret}`)
    } else {
      envContent += `\nBETTER_AUTH_SECRET=${betterAuthSecret}`
    }

    writeFileSync(envPath, envContent, 'utf8')

    // 8. Update package.json name
    const pkgPath = join(targetDir, 'package.json')
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
        pkg.name = projectName.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
        pkg.version = '0.1.0'
        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')
      } catch {
        // Ignore package.json formatting issues if any
      }
    }

    // 9. Run npm install
    console.log(`\n${colors.cyan}→ Installing dependencies with npm install...${colors.reset}\n`)
    const installResult = spawnSync('npm', ['install'], {
      cwd: targetDir,
      stdio: 'inherit',
      shell: true,
    })

    if (installResult.status !== 0) {
      console.log(`\n${colors.yellow}⚠ npm install finished with warnings or issues. You can manually re-run npm install inside the project.${colors.reset}`)
    }

    // 10. Success Message
    console.log(`\n${colors.green}${colors.bold}✔ Success!${colors.reset} Created ${colors.bold}${projectName}${colors.reset} at ${colors.gray}${targetDir}${colors.reset}\n`)
    console.log(`Inside that directory, you can run:\n`)
    console.log(`  ${colors.cyan}cd${colors.reset} ${projectName}`)
    console.log(`  ${colors.cyan}npm run dev${colors.reset}\n`)
    console.log(`Your application will be running at ${colors.bold}${baseUrl}${colors.reset}`)
    console.log(`Payload Admin Panel: ${colors.bold}${baseUrl}/admin${colors.reset}\n`)
    console.log(`${colors.gray}Happy hacking with NextLoad! 🚀${colors.reset}\n`)
  } catch (err) {
    rl.close()
    console.error(`\n${colors.red}✖ An error occurred:${colors.reset}`, err.message)
    process.exit(1)
  }
}

main()
