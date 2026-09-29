import adminOnly from '@/payload/access/adminOnly'
import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: adminOnly,
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'title',
    group: 'Blog',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      fieldToUse: 'title',
      position: undefined,
    }),
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of this category for category archive pages and SEO.',
      },
    },
  ],
}

export default BlogCategories
