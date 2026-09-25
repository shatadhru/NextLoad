"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductGrid } from "@/components/ecommerch/product/ProductGrid"
import { StoreFilterBar, type StoreFilterState } from "@/components/ecommerch/store/StoreFilterBar"
import { StoreNavbar } from "@/components/ecommerch/store/StoreNavbar"
import { formatStorePrice } from "@/components/ecommerch/store/store-utils"
import type { Product } from "@/payload/payload-types"
import { Sparkles, TrendingUp, Tag } from "lucide-react"

type ExtendedProduct = Product & {
  salePrice?: number | null
  slug?: string | null
  stockStatus?: string | null
  isNew?: boolean | null
  isBestSeller?: boolean | null
  isFeatured?: boolean | null
  category?: any
}

interface StoreClientProps {
  initialProducts: ExtendedProduct[]
  categories: Array<{ id: string; title: string; slug?: string | null }>
  featuredProducts: ExtendedProduct[]
}

export function StoreClient({ initialProducts, categories, featuredProducts }: StoreClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = React.useState<StoreFilterState>({
    search: searchParams.get("search") || "",
    categories: searchParams.get("category") ? [searchParams.get("category")!] : [],
    priceRange: [0, 50000],
    sortBy: searchParams.get("sort") || "newest",
    inStockOnly: false,
    onSaleOnly: false,
  })

  const [wishlistedIds, setWishlistedIds] = React.useState<Set<string>>(new Set())

  // Apply filters client-side
  const filtered = React.useMemo(() => {
    let products = [...initialProducts]

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    }

    // Category
    if (filters.categories.length > 0) {
      products = products.filter((p) => {
        if (!p.category) return false
        const catId = typeof p.category === "object" ? p.category.id : p.category
        return filters.categories.includes(catId)
      })
    }

    // Price
    products = products.filter((p) => {
      const regular = (p as any).priceInBDT ?? p.price ?? 0
      const price = (p as any).salePrice && (p as any).salePrice < regular
        ? (p as any).salePrice
        : regular
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Stock
    if (filters.inStockOnly) {
      products = products.filter(
        (p) => !((p as any).stockStatus === "out_of_stock")
      )
    }

    // Sale only
    if (filters.onSaleOnly) {
      products = products.filter((p) => {
        const regular = (p as any).priceInBDT ?? p.price ?? 0
        return (p as any).salePrice && (p as any).salePrice < regular
      })
    }

    // Sort
    switch (filters.sortBy) {
      case "price_asc":
        products.sort((a, b) => {
          const aPrice = (a as any).priceInBDT ?? a.price ?? 0
          const bPrice = (b as any).priceInBDT ?? b.price ?? 0
          return aPrice - bPrice
        })
        break
      case "price_desc":
        products.sort((a, b) => {
          const aPrice = (a as any).priceInBDT ?? a.price ?? 0
          const bPrice = (b as any).priceInBDT ?? b.price ?? 0
          return bPrice - aPrice
        })
        break
      case "best_seller":
        products.sort((a, b) =>
          ((b as any).isBestSeller ? 1 : 0) - ((a as any).isBestSeller ? 1 : 0)
        )
        break
      case "newest":
      default:
        products.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

    return products
  }, [initialProducts, filters])

  const handleWishlist = (productId: string) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <StoreNavbar storeName="Shop" categories={categories} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Banner */}
        <div className="relative mb-8 rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>New Season</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight max-w-md">
              Discover Something
              <br />
              <span className="text-gray-400">You&apos;ll Love</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Curated products with free shipping on orders over ৳2,000.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 size-48 rounded-full bg-gray-50 border border-gray-100" />
          <div className="absolute -right-4 -bottom-4 size-32 rounded-full bg-gray-50 border border-gray-100" />
        </div>

        {/* Featured Strip */}
        {featuredProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="size-4 text-gray-600" />
              <h2 className="text-sm font-semibold text-gray-700">Featured</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {featuredProducts.slice(0, 6).map((product) => (
                <a
                  key={product.id}
                  href={`/store/${(product as any).slug || product.id}`}
                  className="group shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-gray-200 transition-all duration-200 min-w-[180px]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-gray-600">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatStorePrice((product as any).salePrice || (product as any).priceInBDT || product.price)}
                    </p>
                  </div>
                  {(product as any).isNew && (
                    <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-900 text-white">
                      New
                    </span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Bar (renders sidebar on desktop, mobile trigger bar & drawer on mobile) */}
          <StoreFilterBar
            categories={categories}
            filters={filters}
            onChange={setFilters}
            totalProducts={filtered.length}
          />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Grid header (desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-700">
                {filtered.length} Product{filtered.length !== 1 && "s"}
              </h2>
              {filters.search && (
                <p className="text-xs text-gray-500">
                  Results for &ldquo;<strong>{filters.search}</strong>&rdquo;
                </p>
              )}
            </div>

            <ProductGrid
              products={filtered}
              columns="auto"
              onWishlistToggle={handleWishlist}
              wishlistedIds={wishlistedIds}
              emptyMessage="No products match your filters"
              emptyActionHref="/store"
              emptyActionLabel="Clear Filters"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
