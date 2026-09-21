import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { SiteSettings } from './globals/SiteSettings'
import { payloadPlugins } from './plugins';
import { payloadEmailAdapter } from '@/utils/sendEmail/payloadAdapter'
import { customAdminViews, generateAdminGlobals } from '@/config/adminCustomComponents'
import { brandThemeConfig } from '@/config/brandTheme'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Dynamically generate views object for Payload CMS Admin from the config array
const customViewsRecord = customAdminViews.reduce((acc, view) => {
  acc[view.id] = {
    Component: view.componentPath,
    path: view.path,
    exact: view.exact ?? true,
  }
  return acc
}, {} as Record<string, { Component: string; path: `/${string}`; exact: boolean }>)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      icons: [
        {
          rel: 'icon',
          url: brandThemeConfig.icon.light,
        },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: './admin/components/AdminLogo#AdminLogo',
        Icon: './admin/components/AdminIcon#AdminIcon',
      },
      views: {
        ...customViewsRecord,
      },
      afterNavLinks: [
        './admin/components/CustomAdminNavLinks#CustomAdminNavLinks',
      ],
    },
  },
  collections: [Users, Media],
  globals: [SiteSettings, ...generateAdminGlobals()],
  editor: lexicalEditor(),
  email: payloadEmailAdapter(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: payloadPlugins,
})
