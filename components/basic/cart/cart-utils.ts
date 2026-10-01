export function formatPrice(
  amount: number | null | undefined,
  currencySymbol: string = '৳',
  decimals: number = 0
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currencySymbol}0`
  }

  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return `${currencySymbol}${formatted}`
}

export function getProductTitle(product: any): string {
  if (!product) return 'Product'
  if (typeof product === 'string') return 'Product'
  return product.title || 'Product'
}

export function getProductUnitPrice(product: any, variant?: any): number {
  if (variant && typeof variant === 'object') {
    if (typeof variant.priceInBDT === 'number') return variant.priceInBDT
    if (typeof variant.price === 'number') return variant.price
  }

  if (product && typeof product === 'object') {
    if (typeof product.priceInBDT === 'number') return product.priceInBDT
    if (typeof product.price === 'number') return product.price
  }

  return 0
}

export function getProductImageUrl(product: any): string | null {
  if (!product || typeof product === 'string') return null
  const img = product.featuredImage || product.image || (product.gallery && product.gallery[0]?.image)
  if (!img) return null
  if (typeof img === 'string') return img
  return img.cloudinary?.secure_url || img.url || null
}
