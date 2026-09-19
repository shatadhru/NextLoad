import {
  isAdmin, isAdminField, isAdminOrSelf,
  hasRole, requireAllRoles,
  isAuthenticated, isAuthenticatedField,
  canUpdateOwnFields,
} from '@delmaredigital/payload-better-auth'



import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
