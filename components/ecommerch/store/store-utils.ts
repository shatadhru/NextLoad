/**
 * Store utility functions for the ecommerce frontend
 * Shared across product/, store/, and reviews/ component groups
 */

import type { Product, Media } from '@/payload/payload-types'
import { CurrencyNextLoad } from '@/config/Currency'

export const defaultStoreCurrency = CurrencyNextLoad[0] || {
  code: 'BDT',
  symbol: '৳',
  decimals: 0,
  label: 'Bangladeshi Taka',
}

/** Format a price number to BDT or configured currency */
export function formatStorePrice(
  amount: number | null | undefined,
  symbol = defaultStoreCurrency.symbol,
  decimals = defaultStoreCurrency.decimals
): string {
  if (typeof amount !== 'number' || isNaN(amount)) return `${symbol}0`
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/** Calculate discount percentage between regular and sale price */
export function getDiscountPercent(price: number, salePrice: number | null | undefined): number {
  if (!salePrice || salePrice >= price || price <= 0) return 0
  return Math.round(((price - salePrice) / price) * 100)
}

/** Get the regular price (from priceInBDT or price) */
export function getProductRegularPrice(
  product: Product & { priceInBDT?: number | null; price?: number | null }
): number {
  if (typeof product.priceInBDT === 'number' && !isNaN(product.priceInBDT)) {
    return product.priceInBDT
  }
  if (typeof product.price === 'number' && !isNaN(product.price)) {
    return product.price
  }
  return 0
}

/** Get the effective price (sale or regular) */
export function getEffectivePrice(
  product: Product & { salePrice?: number | null; priceInBDT?: number | null }
): number {
  const regular = getProductRegularPrice(product)
  const sale = product.salePrice
  return typeof sale === 'number' && !isNaN(sale) && sale < regular ? sale : regular
}

/** Get primary image URL from a product */
export function getStoreProductImage(product: Product): string | null {
  if (!product.image) return null
  const img = product.image as Media
  if (typeof img === 'string') return null
  return (img as any)?.cloudinary?.secure_url || img?.url || null
}

/** Get gallery images from a product */
export function getProductGalleryImages(
  product: Product & {
    gallery?: Array<{ image: string | Media; alt?: string | null; id?: string | null }>
  }
): Array<{ src: string; alt: string }> {
  if (!product.gallery?.length) {
    const primary = getStoreProductImage(product)
    return primary ? [{ src: primary, alt: product.title }] : []
  }
  return product.gallery
    .map((item) => {
      const img = item.image as Media
      if (typeof img === 'string') return null
      const src = (img as any)?.cloudinary?.secure_url || img?.url || null
      if (!src) return null
      return { src, alt: item.alt || product.title }
    })
    .filter(Boolean) as Array<{ src: string; alt: string }>
}

/** Generate a store product URL */
export function getProductUrl(product: Product & { slug?: string | null }): string {
  const slug = product.slug || product.id
  return `/store/${slug}`
}

/** Get stock status label and color */
export function getStockStatus(
  product: Product & { stockStatus?: string | null }
): { label: string; color: string; available: boolean } {
  const status = product.stockStatus
  switch (status) {
    case 'out_of_stock':
      return { label: 'Out of Stock', color: 'text-red-500', available: false }
    case 'low_stock':
      return { label: 'Low Stock', color: 'text-amber-500', available: true }
    case 'preorder':
      return { label: 'Pre-order', color: 'text-blue-500', available: true }
    default:
      return { label: 'In Stock', color: 'text-emerald-600', available: true }
  }
}

/** Truncate a description string */
export function truncateText(text: string | null | undefined, maxLen = 80): string {
  if (!text) return ''
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}
