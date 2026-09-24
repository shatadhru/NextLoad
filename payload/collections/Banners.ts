import type { CollectionConfig } from 'payload'
import adminOnly from '@/payload/access/adminOnly'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: 'Notice Banner',
    plural: 'Notice Banners',
  },
  access: {
    create: adminOnly,
    read: () => true, // Public read so visitors can see active banners
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isActive', 'badge', 'backgroundType', 'updatedAt'],
    group: 'Content',
    description: 'Create and manage mobile-friendly announcement and notice banners displayed across the site.',
  },
  fields: [
    {
      name: 'preview',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: './admin/components/BannerLivePreview#BannerLivePreview',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Banner Title (Admin Reference)',
      required: true,
      admin: {
        description: 'Internal title used to identify this notice in the admin panel (e.g. "Scheduled Maintenance Alert").',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Enable / Show Banner',
      defaultValue: true,
      admin: {
        description: 'Toggle this notice on or off. Only active banners are rendered to visitors.',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Notice Message',
      required: true,
      defaultValue: '🚀 Welcome to NextLoad! Enjoy our newest features and lightning-fast performance.',
      admin: {
        description: 'The main message text displayed on the banner. Keep it concise for optimal mobile display.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text (Optional)',
          defaultValue: 'Notice',
          admin: {
            width: '50%',
            description: 'Optional small badge pill (e.g. "Notice", "New", "Important", "Offer", "Alert").',
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          defaultValue: 'megaphone',
          options: [
            { label: 'Megaphone (Announcement)', value: 'megaphone' },
            { label: 'Bell (Notification)', value: 'bell' },
            { label: 'Sparkles (Feature / New)', value: 'sparkles' },
            { label: 'Alert Triangle (Warning)', value: 'alert' },
            { label: 'Info (Information)', value: 'info' },
            { label: 'Check Circle (Success)', value: 'check' },
            { label: 'None', value: 'none' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Banner Appearance & Background',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundType',
              type: 'select',
              label: 'Background Type',
              defaultValue: 'preset',
              options: [
                { label: 'Curated Preset Themes', value: 'preset' },
                { label: 'Custom Solid Color (Hex)', value: 'custom' },
                { label: 'Custom CSS Gradient', value: 'gradient' },
              ],
              admin: {
                width: '50%',
                description: 'Select how you want to style the banner background.',
              },
            },
            {
              name: 'presetTheme',
              type: 'select',
              label: 'Preset Theme',
              defaultValue: 'teal',
              admin: {
                width: '50%',
                condition: (data) => !data?.backgroundType || data?.backgroundType === 'preset',
              },
              options: [
                { label: 'Teal Ocean (Brand Primary)', value: 'teal' },
                { label: 'Sapphire Blue (Information)', value: 'blue' },
                { label: 'Sunset Amber (Warning / Attention)', value: 'amber' },
                { label: 'Rose Crimson (Urgent / Alert)', value: 'rose' },
                { label: 'Emerald Forest (Success / Promo)', value: 'emerald' },
                { label: 'Electric Violet (Modern / Trendy)', value: 'violet' },
                { label: 'Midnight Slate (Minimalist Dark)', value: 'dark' },
                { label: 'Neon Sunset (Purple to Rose Gradient)', value: 'gradient-sunset' },
                { label: 'Northern Lights (Blue to Teal Gradient)', value: 'gradient-aurora' },
                { label: 'Cyber Violet (Indigo to Fuchsia Gradient)', value: 'gradient-cyber' },
              ],
            },
          ],
        },
        {
          name: 'customColor',
          type: 'text',
          label: 'Custom Background Color (Hex / RGB / HSL)',
          defaultValue: '#0f766e',
          admin: {
            condition: (data) => data?.backgroundType === 'custom',
            description: 'Enter any valid CSS color, e.g. #0f766e, #1e293b, or rgb(15, 118, 110).',
          },
        },
        {
          name: 'customGradient',
          type: 'text',
          label: 'Custom CSS Gradient',
          defaultValue: 'linear-gradient(135deg, #0f766e 0%, #1e1b4b 100%)',
          admin: {
            condition: (data) => data?.backgroundType === 'gradient',
            description: 'Enter any valid CSS linear-gradient or radial-gradient string.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'textColor',
              type: 'select',
              label: 'Text Color Scheme',
              defaultValue: 'white',
              options: [
                { label: 'Light / White Text (Recommended for dark & vibrant backgrounds)', value: 'white' },
                { label: 'Dark / Charcoal Text (Recommended for light backgrounds)', value: 'dark' },
                { label: 'Custom Text Color', value: 'custom' },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'customTextColor',
              type: 'text',
              label: 'Custom Text Color (Hex)',
              defaultValue: '#ffffff',
              admin: {
                width: '50%',
                condition: (data) => data?.textColor === 'custom',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Small Close Icon (Dismiss Settings)',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'isDismissible',
              type: 'checkbox',
              label: 'Show Small Close Icon (X)',
              defaultValue: true,
              admin: {
                width: '50%',
                description: 'Allow visitors to dismiss/hide the banner by clicking the small close icon.',
              },
            },
            {
              name: 'dismissExpiryDays',
              type: 'number',
              label: 'Dismiss Memory Duration (Days)',
              defaultValue: 1,
              min: 0,
              max: 365,
              admin: {
                width: '50%',
                condition: (data) => Boolean(data?.isDismissible),
                description: 'How many days until the banner reappears for dismissed users (0 = session only). Note: Updating the banner re-shows it immediately.',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Action Button / Link (Optional)',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'link',
          type: 'group',
          label: false,
          fields: [
            {
              name: 'enableLink',
              type: 'checkbox',
              label: 'Add Call-to-Action (CTA) Button / Link',
              defaultValue: false,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Button Label',
                  defaultValue: 'Learn More',
                  admin: {
                    width: '50%',
                    condition: (_, siblingData) => Boolean(siblingData?.enableLink),
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Destination URL',
                  defaultValue: '/updates',
                  admin: {
                    width: '50%',
                    condition: (_, siblingData) => Boolean(siblingData?.enableLink),
                  },
                },
              ],
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open link in a new tab',
              defaultValue: false,
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enableLink),
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Targeting & Priority',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'priority',
              type: 'number',
              label: 'Priority Order',
              defaultValue: 1,
              admin: {
                width: '50%',
                description: 'Higher numbers take priority when multiple banners are active.',
              },
            },
            {
              name: 'isSticky',
              type: 'checkbox',
              label: 'Sticky at top of viewport',
              defaultValue: true,
              admin: {
                width: '50%',
                description: 'Keeps the banner pinned at the very top as the user scrolls.',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'startDate',
              type: 'date',
              label: 'Start Date (Optional)',
              admin: {
                width: '50%',
                description: 'Optional date when the banner starts displaying.',
              },
            },
            {
              name: 'endDate',
              type: 'date',
              label: 'End Date (Optional)',
              admin: {
                width: '50%',
                description: 'Optional expiration date when the banner automatically hides.',
              },
            },
          ],
        },
      ],
    },
  ],
}
