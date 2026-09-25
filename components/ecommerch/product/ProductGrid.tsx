"use client"

import * as React from "react"
import { ProductCard } from "./ProductCard"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/payload/lib/utils"
import type { Product } from "@/payload/payload-types"
import { Package, SearchX } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

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

export interface ProductGridProps {
  products: ExtendedProduct[]
  isLoading?: boolean
  /** Number of skeleton cards to show while loading */
  skeletonCount?: number
  /** Columns config (responsive): 'auto' uses CSS auto-fill */
  columns?: 2 | 3 | 4 | "auto"
  /** Compact mode */
  compact?: boolean
  /** Show edit button on cards */
  showEdit?: boolean
  /** Custom edit handler */
  onEdit?: (product: ExtendedProduct) => void
  /** Empty state message */
  emptyMessage?: string
  /** Empty state action link */
  emptyActionHref?: string
  /** Empty state action label */
  emptyActionLabel?: string
  /** Called when wishlist toggled */
  onWishlistToggle?: (productId: string) => void
  /** Set of wishlisted product IDs */
  wishlistedIds?: Set<string>
  /** Called when quick view triggered */
  onQuickView?: (product: ExtendedProduct) => void
  className?: string
}

const COLUMNS_CLASS: Record<string, string> = {
  "2": "grid-cols-2",
  "3": "grid-cols-2 sm:grid-cols-3",
  "4": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  auto: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
}

/**
 * Responsive product grid with skeleton loading state and empty state.
 * Mobile-first 2-column default.
 */
export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  columns = "auto",
  compact = false,
  showEdit = true,
  onEdit,
  emptyMessage = "No products found",
  emptyActionHref = "/store",
  emptyActionLabel = "Browse All Products",
  onWishlistToggle,
  wishlistedIds,
  onQuickView,
  className,
}: ProductGridProps) {
  const colClass = COLUMNS_CLASS[String(columns)] ?? COLUMNS_CLASS.auto

  if (isLoading) {
    return (
      <div className={cn("grid gap-4", colClass, className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} compact={compact} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 text-gray-300">
          <SearchX className="size-8 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-800">{emptyMessage}</h3>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            Try adjusting your filters or search query.
          </p>
        </div>
        <Link
          href={emptyActionHref}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl mt-2")}
        >
          {emptyActionLabel}
        </Link>
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4 sm:gap-5", colClass, className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          compact={compact}
          showEdit={showEdit}
          onEdit={onEdit}
          onWishlistToggle={onWishlistToggle}
          isWishlisted={wishlistedIds?.has(product.id)}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  )
}

/** Skeleton loader that matches the ProductCard shape */
export function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
      <Skeleton className={cn("w-full bg-gray-100", compact ? "aspect-[4/3]" : "aspect-square")} />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-3 w-16 bg-gray-100" />
        <Skeleton className="h-4 w-full bg-gray-100" />
        <Skeleton className="h-4 w-3/4 bg-gray-100" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-5 w-20 bg-gray-100" />
          <Skeleton className="h-3 w-14 bg-gray-100" />
        </div>
      </div>
    </div>
  )
}
