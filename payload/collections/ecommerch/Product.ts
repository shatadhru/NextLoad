import { slugField, type DefaultDocumentIDType, type Where } from 'payload'
import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const generatePreviewPath = ({ slug }: { slug?: string | null }) =>
  slug ? `/store/${slug}` : '/store'

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: ['title', 'enableVariants', '_status', 'variants.variants'],
    livePreview: {
      url: ({ data }) => generatePreviewPath({ slug: data?.slug }),
    },
    preview: (data) => generatePreviewPath({ slug: (data?.slug as string) || '' }),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    ...defaultCollection?.defaultPopulate,
    title: true,
    slug: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    priceInBDT: true,
    inventory: true,
    meta: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              label: false,
              required: false,
            },
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'variantOption',
                  type: 'relationship',
                  relationTo: 'variantOptions',
                  admin: {
                    condition: (data) =>
                      Boolean(data?.enableVariants && data?.variantTypes?.length > 0),
                  },
                  filterOptions: ({ data }) => {
                    if (data?.enableVariants && data?.variantTypes?.length) {
                      const variantTypeIDs = data.variantTypes.map((item: any) =>
                        typeof item === 'object' && item?.id ? item.id : item
                      ) as DefaultDocumentIDType[]

                      if (variantTypeIDs.length === 0) return { variantType: { in: [] } }
                      return { variantType: { in: variantTypeIDs } } as Where
                    }
                    return { variantType: { in: [] } } as Where
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Product Details',
          fields: [
            ...defaultCollection.fields,
            {
              name: 'relatedProducts',
              type: 'relationship',
              filterOptions: ({ id }) =>
                id ? { id: { not_in: [id] } } : { id: { exists: true } },
              hasMany: true,
              relationTo: 'products',
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            { name: 'title', type: 'text', label: 'Meta Title' },
            { name: 'description', type: 'textarea', label: 'Meta Description' },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Meta Image' },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    slugField(),
  ],
})

export const productCollectionOverride = ProductsCollection
export default ProductsCollection
