import adminOnly from '@/payload/access/adminOnly'
import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

export const BlogTags: CollectionConfig = {
  slug: 'blog-tags',
  labels: {
    singular: 'Tag',
    plural: 'Tags',
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
  ],
}

export default BlogTags
