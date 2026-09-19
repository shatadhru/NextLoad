// src/lib/auth/client.ts
'use client'

import { createAuthClient, twoFactorClient } from '@delmaredigital/payload-better-auth/client'

export const authClient = createAuthClient({
  plugins: [twoFactorClient()],
})

export const { useSession, signIn, signUp, signOut, twoFactor } = authClient