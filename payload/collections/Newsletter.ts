import adminOnly from '@/payload/access/adminOnly'
import type { CollectionConfig } from 'payload'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter',
  labels: {
    singular: 'Subscriber',
    plural: 'Newsletter Subscribers',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'source', 'createdAt'],
    group: 'Marketing',
    description: 'Audience and newsletter email subscriber list.',
  },
  access: {
    create: () => true, // Allows visitors to subscribe
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        placeholder: 'subscriber@example.com',
      },
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Optional subscriber name.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'subscribed',
      required: true,
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'footer',
      admin: {
        position: 'sidebar',
        description: 'Where this subscription was submitted from.',
      },
    },
  ],
}

export default Newsletter
