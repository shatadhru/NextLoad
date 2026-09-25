"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ShoppingBag, Search, ChevronLeft, Home } from "lucide-react"
import { CartDrawer } from "@/components/ecommerch/cart/CartDrawer"
import { cn } from "@/payload/lib/utils"

export interface StoreNavbarProps {
  storeName?: string
  categories?: Array<{ id: string; title: string; slug?: string | null }>
  selectedCategoryId?: string
  className?: string
}

/**
 * Sticky store navbar with logo, category nav, cart drawer trigger.
 * Mobile-optimized with horizontal scrollable category pills and active state.
 */
export function StoreNavbar({
  storeName = "Shop",
  categories = [],
  selectedCategoryId,
  className,
}: StoreNavbarProps) {
  const searchParams = useSearchParams()
  const activeCategory = selectedCategoryId ?? searchParams.get("category") ?? ""
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100",
        "transition-shadow duration-200",
        scrolled ? "shadow-sm" : "shadow-none",
        className
      )}
    >
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Back + Store name */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Back to home"
          >
            <Home className="size-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <span className="text-gray-200">/</span>
          <Link
            href="/store"
            className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
          >
            {storeName}
          </Link>
        </div>

        {/* Right: Cart */}
        <div className="flex items-center gap-2">
          <CartDrawer checkoutUrl="/checkout" shoppingUrl="/store" />
        </div>
      </div>

      {/* Category pill strip (mobile horizontal scroll) */}
      {categories.length > 0 && (
        <div className="border-t border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-hide">
              <Link
                href="/store"
                className={cn(
                  "shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                  !activeCategory
                    ? "border-gray-900 bg-gray-900 text-white shadow-xs"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-800 bg-white"
                )}
              >
                All
              </Link>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id || (cat.slug && activeCategory === cat.slug)
                return (
                  <Link
                    key={cat.id}
                    href={`/store?category=${cat.id}`}
                    className={cn(
                      "shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                      isActive
                        ? "border-gray-900 bg-gray-900 text-white shadow-xs"
                        : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-800 bg-white"
                    )}
                  >
                    {cat.title}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
