import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

export const productCollectionOverride: CollectionOverride = ({ defaultCollection }) => {
  return {
    ...defaultCollection,
    admin: {
      ...defaultCollection.admin,
      useAsTitle: 'title',
      defaultColumns: ['title', 'price', 'salePrice', 'inventory', 'category', '_status'],
      group: 'E-commerce',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        label: 'Product Title',
      },
      {
        name: 'slug',
        type: 'text',
        label: 'URL Slug',
        admin: {
          description: 'Used in the URL. Auto-generated from title if left empty.',
        },
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Short Description',
      },
      {
        name: 'richDescription',
        type: 'richText',
        label: 'Full Description (Rich Text)',
      },
      {
        name: 'price',
        type: 'number',
        required: true,
        defaultValue: 0,
        label: 'Regular Price (BDT)',
      },
      {
        name: 'salePrice',
        type: 'number',
        label: 'Sale Price (BDT)',
        admin: {
          description: 'Optional discount price. If set, shown as the current price.',
        },
      },
      {
        name: 'category',
        type: 'relationship',
        relationTo: 'categories',
        label: 'Category',
      },
      {
        name: 'tags',
        type: 'array',
        label: 'Tags',
        fields: [
          {
            name: 'tag',
            type: 'text',
            required: true,
          },
        ],
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        label: 'Primary Product Image',
        required: true,
      },
      {
        name: 'gallery',
        type: 'array',
        label: 'Image Gallery',
        admin: {
          description: 'Additional product images for the gallery carousel.',
        },
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
          },
          {
            name: 'alt',
            type: 'text',
            label: 'Alt Text',
          },
        ],
      },
      {
        name: 'isNew',
        type: 'checkbox',
        label: 'Mark as New',
        defaultValue: false,
      },
      {
        name: 'isBestSeller',
        type: 'checkbox',
        label: 'Mark as Best Seller',
        defaultValue: false,
      },
      {
        name: 'isFeatured',
        type: 'checkbox',
        label: 'Featured on Store Home',
        defaultValue: false,
      },
      {
        name: 'stockStatus',
        type: 'select',
        label: 'Stock Status',
        defaultValue: 'in_stock',
        options: [
          { label: 'In Stock', value: 'in_stock' },
          { label: 'Low Stock', value: 'low_stock' },
          { label: 'Out of Stock', value: 'out_of_stock' },
          { label: 'Pre-order', value: 'preorder' },
        ],
      },
      {
        name: 'shippingInfo',
        type: 'group',
        label: 'Shipping',
        fields: [
          {
            name: 'weight',
            type: 'number',
            label: 'Weight (grams)',
          },
          {
            name: 'freeShipping',
            type: 'checkbox',
            label: 'Free Shipping',
            defaultValue: false,
          },
          {
            name: 'estimatedDelivery',
            type: 'text',
            label: 'Estimated Delivery',
            admin: {
              placeholder: 'e.g. 3–5 business days',
            },
          },
        ],
      },
      {
        name: 'seoTitle',
        type: 'text',
        label: 'SEO Title',
        admin: { position: 'sidebar' },
      },
      {
        name: 'seoDescription',
        type: 'textarea',
        label: 'SEO Description',
        admin: { position: 'sidebar' },
      },
      // Keep ecommerce plugin fields (inventory, variants, etc.)
      ...defaultCollection.fields,
    ],
    hooks: {
      ...defaultCollection.hooks,
      beforeValidate: [
        ...(defaultCollection.hooks?.beforeValidate || []),
        ({ data }) => {
          if (!data) return data
          const p =
            typeof data.priceInBDT === 'number' && !isNaN(data.priceInBDT)
              ? data.priceInBDT
              : typeof data.price === 'number' && !isNaN(data.price)
              ? data.price
              : typeof data.salePrice === 'number' && !isNaN(data.salePrice)
              ? data.salePrice
              : 0
          data.priceInBDT = p
          data.price = p
          return data
        },
      ],
      beforeChange: [
        ...(defaultCollection.hooks?.beforeChange || []),
        ({ data }) => {
          if (!data) return data
          const p =
            typeof data.priceInBDT === 'number' && !isNaN(data.priceInBDT)
              ? data.priceInBDT
              : typeof data.price === 'number' && !isNaN(data.price)
              ? data.price
              : typeof data.salePrice === 'number' && !isNaN(data.salePrice)
              ? data.salePrice
              : 0
          data.priceInBDT = p
          data.price = p
          return data
        },
      ],
      afterRead: [
        ...(defaultCollection.hooks?.afterRead || []),
        ({ doc }) => {
          if (!doc) return doc
          const p =
            typeof doc.priceInBDT === 'number' && !isNaN(doc.priceInBDT)
              ? doc.priceInBDT
              : typeof doc.price === 'number' && !isNaN(doc.price)
              ? doc.price
              : 0
          doc.priceInBDT = p
          doc.price = p
          return doc
        },
      ],
    },
  }
}

export default productCollectionOverride
