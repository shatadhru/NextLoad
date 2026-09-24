import type { Access, FieldAccess } from 'payload'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { adminOnly } from '../access/adminOnly'

/**
 * Limited to only admin users, specifically for Field level access control.
 */
export const adminOnlyFieldAccess: FieldAccess = ({ req }) => {
  return (req?.user as { role?: string })?.role === 'admin'
}

/**
 * The document is published or user is admin.
 */
export const adminOrPublishedStatus: Access = ({ req }) => {
  if ((req?.user as { role?: string })?.role === 'admin') return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

/**
 * Checks if the user is an admin.
 */
export const isAdmin: Access = adminOnly

/**
 * Checks if the user is authenticated (any role).
 */
export const isAuthenticated: Access = ({ req }) => {
  return Boolean(req?.user)
}

/**
 * Checks if the user is a customer (authenticated but not admin). Used for address creation.
 */
export const isCustomer: FieldAccess = ({ req }) => {
  return Boolean(req?.user && (req.user as { role?: string })?.role !== 'admin')
}

/**
 * Checks if the user owns the document being accessed.
 */
export const isDocumentOwner: Access = ({ req }) => {
  if (!req?.user) return false
  if ((req.user as { role?: string })?.role === 'admin') return true
  return {
    customer: {
      equals: req.user.id,
    },
  }
}

/**
 * Entirely public access.
 */
export const publicAccess: Access = () => true

import { productCollectionOverride } from '../collections/ecommerch/Product'
import { CurrencyNextLoad } from '@/config/Currency'
import { currencyCode } from 'better-auth'

export const ecommerceConnector = ecommercePlugin({
  access: {
    adminOnlyFieldAccess,
    adminOrPublishedStatus,
    isAdmin,
    isAuthenticated,
    isCustomer,
    isDocumentOwner,
    publicAccess,
  },
  currencies: {
    supportedCurrencies: [...CurrencyNextLoad],
    defaultCurrency: CurrencyNextLoad[0].code
  },
  customers: {
    slug: 'users',
  },
  products: {
    productsCollectionOverride: productCollectionOverride,
  },
})