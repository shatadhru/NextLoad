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
import { generateThemeNavIcons } from '@/config/adminCustomComponents'
import { cloudinaryStorage } from 'payload-cloudinary';
import { brandThemeConfig } from '@/config/brandTheme';
import { ecommerceConnector } from '../ecommerch/Connector'
import { Plugin } from 'payload'




export const payloadPlugins:Plugin[] = [
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

  payloadTheme({
    accent: '#0d9488',
    logo: {
      light: brandThemeConfig.logo.light,
      dark: brandThemeConfig.logo.dark,
    },
    icon: {
      light: brandThemeConfig.icon.light,
      dark: brandThemeConfig.icon.dark,
    },
    logoHeight: 28,
    login: {
      heading: 'NextLoad',
      tagline: 'Sign in to manage your content and system settings.',
    },
    nav: {
      icons: generateThemeNavIcons(),
    },
  }),

   cloudinaryStorage({
      config: {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      },
      collections: {
        media: true,
      },
      folder: process.env.CLOUDINARY_FOLDER || 'nextload-media',
      disableLocalStorage: true,
    }),

  ecommerceConnector,
] as Plugin[]