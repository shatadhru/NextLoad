"use client"

import * as React from "react"
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/payload/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { formatStorePrice } from "./store-utils"

export interface StoreFilterState {
  search: string
  categories: string[]
  priceRange: [number, number]
  sortBy: string
  inStockOnly: boolean
  onSaleOnly: boolean
}

const DEFAULT_FILTERS: StoreFilterState = {
  search: "",
  categories: [],
  priceRange: [0, 50000],
  sortBy: "newest",
  inStockOnly: false,
  onSaleOnly: false,
}

export interface StoreFilterBarProps {
  categories: Array<{ id: string; title: string }>
  filters: StoreFilterState
  onChange: (filters: StoreFilterState) => void
  totalProducts?: number
  maxPrice?: number
  className?: string
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "best_seller", label: "Best Sellers" },
  { value: "rating", label: "Top Rated" },
]

/**
 * Mobile-first filter bar — inline on desktop, drawer trigger on mobile.
 * Controls: search, category pills, price range slider, sort, toggles.
 */
export function StoreFilterBar({
  categories,
  filters,
  onChange,
  totalProducts = 0,
  maxPrice = 50000,
  className,
}: StoreFilterBarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [priceExpanded, setPriceExpanded] = React.useState(true)
  const [catExpanded, setCatExpanded] = React.useState(true)

  const activeFilterCount = [
    filters.categories.length > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice,
    filters.inStockOnly,
    filters.onSaleOnly,
    filters.search.length > 0,
  ].filter(Boolean).length

  const resetFilters = () => onChange({ ...DEFAULT_FILTERS, priceRange: [0, maxPrice] })
  const update = (patch: Partial<StoreFilterState>) => onChange({ ...filters, ...patch })

  const toggleCategory = (id: string) => {
    const cats = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id]
    update({ categories: cats })
  }

  const FilterContent = (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
        <Input
          type="search"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search products…"
          className="pl-9 rounded-xl text-sm border-gray-200 bg-white"
        />
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => update({ sortBy: e.target.value })}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-gray-300"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setCatExpanded((v) => !v)}
          className="flex w-full items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide"
        >
          <span>Category</span>
          {catExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
        {catExpanded && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = filters.categories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                    active
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  )}
                >
                  {cat.title}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setPriceExpanded((v) => !v)}
          className="flex w-full items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide"
        >
          <span>Price Range</span>
          {priceExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
        {priceExpanded && (
          <div className="space-y-3">
            <Slider
              min={0}
              max={maxPrice}
              step={500}
              value={filters.priceRange}
              onValueChange={(v) => update({ priceRange: v as [number, number] })}
              className="mt-2"
              aria-label="Price range"
            />
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{formatStorePrice(filters.priceRange[0])}</span>
              <span>{formatStorePrice(filters.priceRange[1])}</span>
            </div>
          </div>
        )}
      </div>

      {/* Toggles */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Options</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => update({ inStockOnly: e.target.checked })}
              className="size-4 rounded border-gray-300 text-gray-900 accent-gray-900"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">In Stock Only</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={(e) => update({ onSaleOnly: e.target.checked })}
              className="size-4 rounded border-gray-300 text-gray-900 accent-gray-900"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">On Sale</span>
          </label>
        </div>
      </div>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="w-full rounded-xl text-xs gap-1.5"
        >
          <X className="size-3.5" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile trigger bar */}
      <div className={cn("flex lg:hidden items-center gap-2", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="gap-2 rounded-xl text-xs font-medium border-gray-200"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-gray-900 text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <select
          value={filters.sortBy}
          onChange={(e) => update({ sortBy: e.target.value })}
          className="flex-1 text-xs border border-gray-200 rounded-xl px-2.5 py-1.5 bg-white text-gray-700 outline-none"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 shrink-0">{totalProducts} items</span>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative ml-auto w-72 h-full bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 z-10">
              <span className="font-semibold text-sm text-gray-900">
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-gray-900 text-white text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-5">
              {FilterContent}
            </div>
            <div className="sticky bottom-0 p-4 border-t border-gray-100 bg-white">
              <Button
                size="sm"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl font-semibold"
              >
                Show {totalProducts} Results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={cn("hidden lg:block w-56 xl:w-64 shrink-0", className)}>
        <div className="sticky top-4 space-y-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-800">
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex size-4 items-center justify-center rounded-full bg-gray-900 text-white text-[9px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </span>
            <span className="text-xs text-gray-400">{totalProducts} items</span>
          </div>
          {FilterContent}
        </div>
      </aside>
    </>
  )
}
