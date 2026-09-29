import adminOnly from '@/payload/access/adminOnly'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from 'payload'
import type { Access, CollectionConfig, Where } from 'payload'

/**
 * Calculates estimated reading time in minutes based on Lexical rich text content
 */
export const calculateReadingTime = (content: any): number => {
  if (!content) return 1
  let text = ''
  try {
    const traverse = (node: any) => {
      if (!node) return
      if (typeof node.text === 'string') text += ' ' + node.text
      if (Array.isArray(node.children)) {
        node.children.forEach(traverse)
      }
    }
    traverse(content.root || content)
  } catch {
    text = JSON.stringify(content || '')
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: adminOnly,
    update: ({ req }) => Boolean(req.user),
    read: (({ req }) => {
      const user = req?.user as { role?: string } | undefined
      if (user?.role === 'admin') return true

      const conditions: Where[] = [{ status: { equals: 'published' } }]

      if (!user) {
        conditions.push({ visibility: { not_equals: 'private' } })
      }

      return {
        and: conditions,
      }
    }) as Access,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'visibility', 'publishDate', 'updatedAt'],
    group: 'Blog',
    preview: (doc) => {
      return doc?.slug ? `/blog/${doc.slug}` : '/blog'
    },
    livePreview: {
      url: ({ data }) => {
        return data?.slug ? `/blog/${data.slug}` : '/blog'
      },
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.content) {
          data.readingTime = calculateReadingTime(data.content)
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Enter an engaging article title...',
              },
            },
            slugField({
              fieldToUse: 'title',
              position: undefined,
            }),
            {
              name: 'excerpt',
              type: 'textarea',
              admin: {
                description: 'Brief summary displayed in post cards, feeds, and search listings.',
                placeholder: 'Write a concise summary (1-2 sentences)...',
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Main cover image for the post and social sharing cards.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'blog-categories',
                  hasMany: false,
                  admin: {
                    width: '50%',
                    description: 'Primary topic or category for this post.',
                  },
                },
                {
                  name: 'tags',
                  type: 'relationship',
                  relationTo: 'blog-tags',
                  hasMany: true,
                  admin: {
                    width: '50%',
                    description: 'Descriptive tags to group related articles.',
                  },
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'SEO & Metadata',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'Meta Title',
              admin: {
                description: 'Custom SEO title tag (falls back to post title if blank).',
                placeholder: 'Max 60 characters recommended',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'Meta Description',
              admin: {
                description: 'Custom SEO description (falls back to excerpt if blank).',
                placeholder: 'Max 160 characters recommended',
              },
            },
            {
              name: 'seoKeywords',
              type: 'text',
              label: 'Meta Keywords',
              admin: {
                description: 'Comma-separated keywords for search engines.',
                placeholder: 'e.g. nextjs, payload cms, web development',
              },
            },
            {
              name: 'canonicalUrl',
              type: 'text',
              label: 'Canonical URL',
              admin: {
                description: 'Custom canonical URL if this article was syndicated from another origin.',
                placeholder: 'https://example.com/original-article',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Social Share Image (OG)',
              admin: {
                description: 'Dedicated Open Graph image (falls back to featured image if omitted).',
              },
            },
          ],
        },
      ],
    },
    // Sidebar fields for status, visibility, author & publishing metadata
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only published articles are live to the public.',
      },
    },
    {
      name: 'visibility',
      type: 'select',
      required: true,
      defaultValue: 'public',
      options: [
        { label: 'Public (Listing & Search)', value: 'public' },
        { label: 'Private (Members Only)', value: 'private' },
        { label: 'Unlisted (Direct Link Only)', value: 'unlisted' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Public: in listing & search. Private: requires member sign-in. Unlisted: direct link only.',
      },
    },
    {
      name: 'publishDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Scheduled or original publication timestamp.',
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: 'Author credited for this post.',
      },
      defaultValue: ({ req }: { req: any }) => req?.user?.id,
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Estimated reading time in minutes (auto-calculated).',
      },
      defaultValue: 1,
    },
  ],
}

export default Posts
