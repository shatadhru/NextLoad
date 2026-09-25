"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronLeft,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Star,
  TrendingUp,
  Tag,
  Package,
  Check,
  Pencil,
} from "lucide-react"
import { AddToCartButton } from "@/components/ecommerch/cart/AddToCartButton"
import { ProductImageGallery } from "@/components/ecommerch/product/ProductImageGallery"
import { ProductReviews, StarRow } from "@/components/ecommerch/reviews/ProductReviews"
import { ReviewForm } from "@/components/ecommerch/reviews/ReviewForm"
import { ProductGrid } from "@/components/ecommerch/product/ProductGrid"
import { StoreNavbar } from "@/components/ecommerch/store/StoreNavbar"
import { formatStorePrice, getDiscountPercent, getEffectivePrice, getProductRegularPrice, getProductGalleryImages, getStockStatus } from "@/components/ecommerch/store/store-utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/payload/lib/utils"
import { toast } from "sonner"
import type { Product } from "@/payload/payload-types"

type ExtendedProduct = Product & {
  salePrice?: number | null
  slug?: string | null
  stockStatus?: string | null
  isNew?: boolean | null
  isBestSeller?: boolean | null
  isFeatured?: boolean | null
  gallery?: Array<{ image: any; alt?: string | null; id?: string | null }>
  category?: any
  tags?: Array<{ tag: string; id?: string | null }>
  shippingInfo?: {
    freeShipping?: boolean | null
    estimatedDelivery?: string | null
    weight?: number | null
  }
  richDescription?: any
}

interface ReviewData {
  id: string
  title: string
  body: string
  rating: number
  author: string
  verified?: boolean
  createdAt: string
}

interface ProductDetailClientProps {
  product: ExtendedProduct
  reviews: ReviewData[]
  relatedProducts: ExtendedProduct[]
  categories: Array<{ id: string; title: string; slug?: string | null }>
}

export function ProductDetailClient({
  product,
  reviews,
  relatedProducts,
  categories,
}: ProductDetailClientProps) {
  const [qty, setQty] = React.useState(1)
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [reviewsVisible, setReviewsVisible] = React.useState(false)

  const images = getProductGalleryImages(product)
  const regularPrice = getProductRegularPrice(product)
  const effectivePrice = getEffectivePrice(product)
  const discountPercent = getDiscountPercent(regularPrice, product.salePrice)
  const stockInfo = getStockStatus(product)
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.title, url: window.location.href })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    }
  }

  const perks = [
    {
      icon: Truck,
      label: product.shippingInfo?.freeShipping
        ? "Free Shipping"
        : "Standard Shipping",
      sub: product.shippingInfo?.estimatedDelivery || "3–7 business days",
    },
    { icon: ShieldCheck, label: "Secure Checkout", sub: "SSL encrypted payment" },
    { icon: RefreshCcw, label: "Easy Returns", sub: "30-day hassle-free returns" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <StoreNavbar
        storeName="Shop"
        categories={categories}
        selectedCategoryId={
          product.category
            ? typeof product.category === "object"
              ? product.category.id
              : product.category
            : undefined
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/store" className="hover:text-gray-600 transition-colors">Shop</Link>
          {product.category && typeof product.category === "object" && "title" in product.category && (
            <>
              <span>/</span>
              <span className="text-gray-400">{(product.category as any).title}</span>
            </>
          )}
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[140px]">{product.title}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <ProductImageGallery images={images} productTitle={product.title} />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-5">
            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <Badge variant="default" className="text-xs gap-1">
                  ✨ New
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <TrendingUp className="size-3" /> Best Seller
                </Badge>
              )}
              {discountPercent > 0 && (
                <Badge variant="destructive" className="text-xs font-bold">
                  -{discountPercent}% OFF
                </Badge>
              )}
              {product.shippingInfo?.freeShipping && (
                <Badge variant="outline" className="text-xs gap-1 border-emerald-200 text-emerald-700 bg-emerald-50">
                  <Truck className="size-3" /> Free Shipping
                </Badge>
              )}
            </div>

            {/* Category */}
            {product.category && typeof product.category === "object" && "title" in product.category && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {(product.category as any).title}
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating row */}
            {reviews.length > 0 && (
              <button
                type="button"
                onClick={() => setReviewsVisible(true)}
                className="flex items-center gap-2 w-fit"
              >
                <StarRow rating={avgRating} size="sm" />
                <span className="text-xs font-medium text-gray-600">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  ({reviews.length} review{reviews.length !== 1 && "s"})
                </span>
              </button>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 tabular-nums">
                {formatStorePrice(effectivePrice)}
              </span>
              {discountPercent > 0 && (
                <span className="text-base text-gray-400 line-through tabular-nums">
                  {formatStorePrice(regularPrice)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "size-2 rounded-full",
                stockInfo.available ? "bg-emerald-500" : "bg-red-400"
              )} />
              <span className={cn("text-xs font-medium", stockInfo.color)}>
                {stockInfo.label}
              </span>
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="size-3.5 text-gray-400" />
                {product.tags.map((t) => (
                  <span
                    key={t.id || t.tag}
                    className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600"
                  >
                    {t.tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col gap-3">
              {/* Quantity Picker */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600">Qty</span>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex size-9 items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-gray-900 tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="flex size-9 items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <AddToCartButton
                  productId={product.id}
                  productTitle={product.title}
                  quantity={qty}
                  size="lg"
                  className="flex-1 rounded-xl font-semibold"
                  disabled={!stockInfo.available}
                />
                <button
                  type="button"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  onClick={() => setIsWishlisted((v) => !v)}
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-150",
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:text-red-400"
                  )}
                >
                  <Heart className={cn("size-5", isWishlisted && "fill-current")} />
                </button>
                <button
                  type="button"
                  aria-label="Share product"
                  onClick={handleShare}
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all duration-150"
                >
                  <Share2 className="size-5" />
                </button>
                <a
                  href={`/admin/collections/products/${product.id}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Edit product in Payload Admin"
                  title="Edit product in Payload Admin"
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-gray-200 bg-white text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-150"
                >
                  <Pencil className="size-5" />
                </a>
              </div>
            </div>

            {/* Perks */}
            <div className="rounded-2xl bg-gray-50/80 border border-gray-100 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {perks.map((perk) => {
                const Icon = perk.icon
                return (
                  <div key={perk.label} className="flex items-start gap-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-500">
                      <Icon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{perk.label}</p>
                      <p className="text-[11px] text-gray-500">{perk.sub}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tabs: Description, Details, Reviews */}
        <div className="mt-12 sm:mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full sm:w-auto rounded-xl bg-gray-100 p-1 flex overflow-x-auto scrollbar-hide">
              <TabsTrigger value="description" className="flex-1 sm:flex-none rounded-lg text-sm font-medium px-4">
                Description
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-1 sm:flex-none rounded-lg text-sm font-medium px-4">
                Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 sm:flex-none rounded-lg text-sm font-medium px-4 gap-1.5">
                Reviews
                {reviews.length > 0 && (
                  <span className="inline-flex size-4 items-center justify-center rounded-full bg-gray-900 text-white text-[9px] font-bold">
                    {reviews.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="description" className="space-y-4">
                <div className="prose prose-sm max-w-none text-gray-700">
                  {product.description || "No description provided."}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-3">
                <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden divide-y divide-gray-50">
                  {[
                    { label: "Product ID", value: product.id },
                    { label: "Category", value: typeof product.category === "object" ? (product.category as any)?.title : product.category || "—" },
                    { label: "Stock Status", value: stockInfo.label },
                    ...(product.shippingInfo?.weight
                      ? [{ label: "Weight", value: `${product.shippingInfo.weight}g` }]
                      : []),
                    ...(product.shippingInfo?.estimatedDelivery
                      ? [{ label: "Est. Delivery", value: product.shippingInfo.estimatedDelivery }]
                      : []),
                    { label: "Status", value: product._status === "published" ? "Available" : "Draft" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs font-medium text-gray-500">{label}</span>
                      <span className="text-xs text-gray-800 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-8">
                <ProductReviews
                  reviews={reviews}
                  avgRating={avgRating}
                  totalCount={reviews.length}
                />
                <ReviewForm
                  productId={product.id}
                  productTitle={product.title}
                  onSuccess={() => toast.success("Thanks! Your review will appear after approval.")}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">You May Also Like</h2>
              <Link href="/store" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
                View all →
              </Link>
            </div>
            <ProductGrid products={relatedProducts} columns={4} compact />
          </section>
        )}
      </main>
    </div>
  )
}
