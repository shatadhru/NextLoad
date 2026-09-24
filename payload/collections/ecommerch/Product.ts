import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'


export const productCollectionOverride: CollectionOverride = ({ defaultCollection }) => {
  return {
    ...defaultCollection,
    admin: {
      ...defaultCollection.admin,
      useAsTitle: 'title',
      defaultColumns: ['title', 'price', 'inventory', '_status'],
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        label: 'Product Title',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
      },
      {
        name: 'price',
        type: 'number',
        required: true,
        defaultValue: 0,
        label: 'Price',
      },
      {
        name: 'category',
        type: 'select',
        defaultValue: 'general',
        options: [
          { label: 'General', value: 'general' },
          { label: 'Clothing', value: 'clothing' },
          { label: 'Electronics', value: 'electronics' },
          { label: 'Digital', value: 'digital' },
        ],
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        label: 'Product Image',
      },
      // Keep ecommerce plugin fields (inventory, variants, etc.)
      ...defaultCollection.fields,
    ],
  }
}

export default productCollectionOverride
