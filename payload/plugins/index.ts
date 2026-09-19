import { payloadTheme } from 'payload-theme'
import { betterAuth } from 'better-auth'
import {
  betterAuthCollections,
  createBetterAuthPlugin,
  payloadAdapter,
} from '@delmaredigital/payload-better-auth'

import { betterAuthOptions } from '@/payload/auth/config'
import { trustedOrigins } from '@/config/trustedOrigins'
import { roles } from '@/config/roles'



export const payloadPlugins = [
       betterAuthCollections({
    betterAuthOptions,
    firstUserAdmin: true,
    skipCollections: ['user'],
  }),

  createBetterAuthPlugin({
    admin: {
      login: {
        requiredRole: roles,
      },
    },

    createAuth: (payload) =>
      betterAuth({
        baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
        ...betterAuthOptions,

        database: payloadAdapter({
          payloadClient: payload,
        }),

        secret: process.env.BETTER_AUTH_SECRET,
        trustedOrigins,
      }),
  }),

  payloadTheme({ accent: '#0d9488' }),
      

    
]