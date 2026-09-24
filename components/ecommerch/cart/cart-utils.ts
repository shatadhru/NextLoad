import type { Product, Variant, Media } from "@/payload/payload-types"

/**
 * Format currency with symbol and decimal precision
 */
export function formatPrice(
  amount: number | null | undefined,
  currencySymbol: string = "৳",
  decimals: number = 0
): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    return `${currencySymbol}0`
  }

  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return `${currencySymbol}${formatted}`
}

/**
 * Safely extracts product title, fallbacking gracefully
 */
export function getProductTitle(product: string | Product | null | undefined): string {
  if (!product) return "Product"
  if (typeof product === "string") return "Product"
  return product.title || "Product"
}

/**
 * Safely gets unit price from a product (checking currency specific price or base price)
 */
export function getProductUnitPrice(
  product: string | Product | null | undefined,
  variant?: string | Variant | null | undefined
): number {
  if (variant && typeof variant === "object") {
    if (typeof variant.priceInBDT === "number") return variant.priceInBDT
  }

  if (product && typeof product === "object") {
    if (typeof product.priceInBDT === "number") return product.priceInBDT
    if (typeof product.price === "number") return product.price
  }

  return 0
}

/**
 * Safely gets product image source (Cloudinary secure_url or public ID or regular url)
 */
export function getProductImageUrl(product: string | Product | null | undefined): string | null {
  if (!product || typeof product === "string" || !product.image) return null
  const img = product.image as Media
  if (typeof img === "string") return null
  return img.cloudinary?.secure_url || img.url || img.cloudinary?.public_id || null
}

/**
 * Safely gets product image alt tag
 */
export function getProductImageAlt(product: string | Product | null | undefined): string {
  if (!product || typeof product === "string" || !product.image) return "Product Image"
  const img = product.image as Media
  if (typeof img === "object" && img.alt) return img.alt
  return typeof product === "object" ? product.title || "Product Image" : "Product Image"
}
