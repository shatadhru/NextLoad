import type { CollectionConfig } from 'payload'
import adminOnly from '@/payload/access/adminOnly'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    group: 'E-commerce',
    defaultColumns: ['code', 'type', 'value', 'usageCount', 'maxUses', 'expiresAt', 'active'],
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Coupon Code',
      admin: {
        description: 'Uppercase code customers enter at checkout (e.g. SUMMER20)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Discount Type',
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed Amount (BDT)', value: 'fixed' },
        { label: 'Free Shipping', value: 'free_shipping' },
      ],
      defaultValue: 'percentage',
    },
    {
      name: 'value',
      type: 'number',
      label: 'Discount Value',
      admin: {
        description: 'For percentage: e.g. 20 means 20%. For fixed: amount in BDT.',
        condition: (data) => data.type !== 'free_shipping',
      },
    },
    {
      name: 'minOrderAmount',
      type: 'number',
      label: 'Minimum Order Amount (BDT)',
      admin: {
        description: 'Optional minimum cart total to apply this coupon.',
      },
    },
    {
      name: 'maxDiscountAmount',
      type: 'number',
      label: 'Maximum Discount Amount (BDT)',
      admin: {
        description: 'Optional cap for percentage discounts.',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      label: 'Times Used',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'maxUses',
      type: 'number',
      label: 'Max Uses (0 = unlimited)',
      defaultValue: 0,
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expiry Date',
      admin: {
        description: 'Leave blank for no expiry.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
    },
    {
      name: 'applicableProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Applicable Products (blank = all)',
      admin: {
        description: 'Leave empty to apply to all products.',
      },
    },
    {
      name: 'applicableCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Applicable Categories (blank = all)',
    },
  ],
}
