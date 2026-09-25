"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/ecommerch/cart/AddToCartButton"
import {
  Heart,
  Star,
  Eye,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  Package,
  Pencil,
} from "lucide-react"
import { cn } from "@/payload/lib/utils"
import {
  formatStorePrice,
  getDiscountPercent,
  getEffectivePrice,
  getProductRegularPrice,
  getStoreProductImage,
  getProductUrl,
  getStockStatus,
  truncateText,
} from "../store/store-utils"
import type { Product } from "@/payload/payload-types"

type ExtendedProduct = Product & {
  salePrice?: number | null
  slug?: string | null
  stockStatus?: string | null
  isNew?: boolean | null
  isBestSeller?: boolean | null
  isFeatured?: boolean | null
  category?: any
  avgRating?: number
  reviewCount?: number
}

export interface ProductCardProps {
  product: ExtendedProduct
  /** Compact mode for tighter grids */
  compact?: boolean
  /** Show quick-view button */
  showQuickView?: boolean
  /** Show wishlist button */
  showWishlist?: boolean
  /** Show direct edit product button/link */
  showEdit?: boolean
  /** Called when wishlist toggled */
  onWishlistToggle?: (productId: string) => void
  /** Whether this product is in wishlist */
  isWishlisted?: boolean
  /** Called when quick view is triggered */
  onQuickView?: (product: ExtendedProduct) => void
  /** Custom handler when edit is triggered (defaults to opening /admin/collections/products/[id]) */
  onEdit?: (product: ExtendedProduct) => void
  className?: string
}

/**
 * Premium product card for the store grid.
 * Features: image hover zoom, badges (New/Sale/Best Seller), price with strikethrough,
 * star rating, Add to Cart button, quick-view, wishlist toggle, and instant edit action — all mobile-first.
 */
export function ProductCard({
  product,
  compact = false,
  showQuickView = true,
  showWishlist = true,
  showEdit = true,
  onWishlistToggle,
  isWishlisted = false,
  onQuickView,
  onEdit,
  className,
}: ProductCardProps) {
  const [imgError, setImgError] = React.useState(false)
  const [wishlistHovered, setWishlistHovered] = React.useState(false)

  const imageUrl = getStoreProductImage(product)
  const productUrl = getProductUrl(product)
  const regularPrice = getProductRegularPrice(product)
  const effectivePrice = getEffectivePrice(product)
  const discountPercent = getDiscountPercent(regularPrice, product.salePrice)
  const stockInfo = getStockStatus(product)
  const hasSale = discountPercent > 0
  const rating = product.avgRating ?? 0
  const reviewCount = product.reviewCount ?? 0

  const badges: Array<{ label: string; variant: "default" | "destructive" | "secondary" | "outline"; icon?: React.ReactNode }> = []
  if (product.isNew) badges.push({ label: "New", variant: "default", icon: <Sparkles className="size-2.5" /> })
  if (hasSale) badges.push({ label: `-${discountPercent}%`, variant: "destructive" })
  if (product.isBestSeller) badges.push({ label: "Best Seller", variant: "secondary", icon: <TrendingUp className="size-2.5" /> })

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden",
        "shadow-sm hover:shadow-xl hover:-translate-y-0.5",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      {/* Image Container */}
      <div className={cn("relative overflow-hidden bg-gray-50", compact ? "aspect-[4/3]" : "aspect-square")}>
        <Link href={productUrl} className="relative block w-full h-full" aria-label={`View ${product.title}`}>
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package className="size-16 stroke-[1]" />
            </div>
          )}
        </Link>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {badges.map((badge) => (
              <Badge
                key={badge.label}
                variant={badge.variant}
                className="text-[10px] font-bold px-2 py-0.5 gap-1 shadow-sm"
              >
                {badge.icon}
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons (mobile-friendly & hover reveal on desktop) */}
        <div
          className={cn(
            "absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10",
            "transition-all duration-200",
            "opacity-85 sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0"
          )}
        >
          {showEdit && (
            onEdit ? (
              <button
                type="button"
                aria-label={`Edit ${product.title}`}
                title="Edit Product"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onEdit(product)
                }}
                className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm border border-gray-100 text-gray-500 hover:text-indigo-600 transition-all duration-150 hover:scale-110"
              >
                <Pencil className="size-3.5" />
              </button>
            ) : (
              <a
                href={`/admin/collections/products/${product.id}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Edit ${product.title} in Admin`}
                title="Edit in Payload Admin"
                onClick={(e) => e.stopPropagation()}
                className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm border border-gray-100 text-gray-500 hover:text-indigo-600 transition-all duration-150 hover:scale-110"
              >
                <Pencil className="size-3.5" />
              </a>
            )
          )}
          {showWishlist && (
            <button
              type="button"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onMouseEnter={() => setWishlistHovered(true)}
              onMouseLeave={() => setWishlistHovered(false)}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onWishlistToggle?.(product.id)
              }}
              className={cn(
                "flex size-7 sm:size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm",
                "border border-gray-100 transition-all duration-150 hover:scale-110",
                isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-400"
              )}
            >
              <Heart className={cn("size-3.5 sm:size-4", (isWishlisted || wishlistHovered) && "fill-current")} />
            </button>
          )}
          {showQuickView && (
            <button
              type="button"
              aria-label="Quick view"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onQuickView?.(product)
              }}
              className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm border border-gray-100 text-gray-400 hover:text-gray-700 transition-all duration-150 hover:scale-110"
            >
              <Eye className="size-3.5 sm:size-4" />
            </button>
          )}
        </div>

        {/* Out of stock overlay */}
        {!stockInfo.available && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-xs font-semibold text-gray-500 bg-white/90 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover Add to Cart (slide up from bottom on hover) */}
        <div
          className={cn(
            "absolute bottom-0 inset-x-0 p-3 z-20",
            "translate-y-full group-hover:translate-y-0",
            "transition-transform duration-300 ease-out",
            !stockInfo.available && "pointer-events-none opacity-0"
          )}
        >
          <AddToCartButton
            productId={product.id}
            productTitle={product.title}
            variant="default"
            size="sm"
            className="w-full rounded-xl font-semibold text-xs shadow-md"
            disabled={!stockInfo.available}
          />
        </div>
      </div>

      {/* Card Body */}
      <div className={cn("flex flex-col gap-2 p-4", compact && "p-3 gap-1.5")}>
        {/* Category + Rating Row */}
        <div className="flex items-center justify-between gap-2">
          {product.category && typeof product.category === "object" && "title" in product.category && (
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide truncate">
              {(product.category as { title: string }).title}
            </span>
          )}
          {rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-semibold text-gray-600">
                {rating.toFixed(1)}
              </span>
              {reviewCount > 0 && (
                <span className="text-[11px] text-gray-400">({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={productUrl} className="group/title">
          <h3
            className={cn(
              "font-semibold text-gray-900 leading-snug line-clamp-2",
              "group-hover/title:text-gray-600 transition-colors duration-150",
              compact ? "text-sm" : "text-sm sm:text-base"
            )}
          >
            {product.title}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className={cn("font-bold text-gray-900", compact ? "text-sm" : "text-base")}>
            {formatStorePrice(effectivePrice)}
          </span>
          {hasSale && (
            <span className="text-xs text-gray-400 line-through">
              {formatStorePrice(regularPrice)}
            </span>
          )}
          {!compact && (
            <span className={cn("ml-auto text-[11px] font-medium", stockInfo.color)}>
              {stockInfo.label}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
