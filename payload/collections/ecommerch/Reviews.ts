import type { CollectionConfig } from 'payload'
import adminOnly from '@/payload/access/adminOnly'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
    group: 'E-commerce',
    defaultColumns: ['title', 'rating', 'product', 'author', 'approved', 'createdAt'],
  },
  access: {
    create: () => true, // Anyone can submit a review
    read: () => true,   // Public read (frontend filters by approved)
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Review Title',
      admin: {
        placeholder: 'e.g. Amazing product!',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Review Body',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      label: 'Rating (1–5)',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Reviewer Name',
    },
    {
      name: 'authorEmail',
      type: 'email',
      label: 'Reviewer Email',
      admin: {
        description: 'Not shown publicly.',
      },
    },
    {
      name: 'verified',
      type: 'checkbox',
      label: 'Verified Purchase',
      defaultValue: false,
      admin: {
        description: 'Check if this reviewer has purchased the product.',
      },
    },
    {
      name: 'approved',
      type: 'checkbox',
      label: 'Approved (Visible on store)',
      defaultValue: false,
      admin: {
        description: 'Only approved reviews appear on the store.',
      },
    },
  ],
}
