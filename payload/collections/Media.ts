import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user && (req.user as { role?: string }).role === 'admin'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    disableLocalStorage: true,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc?.cloudinary?.secure_url && !doc.url) {
          doc.url = doc.cloudinary.secure_url
        }
        if (!doc.cloudinary && (doc.cloudinaryUrl || doc.cloudinaryPublicId)) {
          doc.cloudinary = {
            secure_url: doc.cloudinaryUrl || doc.url,
            public_id: doc.cloudinaryPublicId,
          }
        }
        return doc
      },
    ],
  },
}
