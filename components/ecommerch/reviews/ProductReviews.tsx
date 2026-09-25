"use client"

import * as React from "react"
import { Star, ThumbsUp } from "lucide-react"
import { cn } from "@/payload/lib/utils"
import { formatDistanceToNow } from "date-fns"

export interface ReviewItem {
  id: string
  title: string
  body: string
  rating: number
  author: string
  verified?: boolean
  createdAt: string
}

export interface ProductReviewsProps {
  reviews: ReviewItem[]
  avgRating?: number
  totalCount?: number
  className?: string
}

/** Star row component */
function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = { sm: "size-3.5", md: "size-4", lg: "size-5" }[size]
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  )
}

/** Rating breakdown bar */
function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span className="w-6 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-5 shrink-0 text-gray-400">{count}</span>
    </div>
  )
}

/**
 * Product reviews section with summary panel (avg rating + breakdown bars) and individual review cards.
 */
export function ProductReviews({
  reviews,
  avgRating = 0,
  totalCount = 0,
  className,
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = React.useState<"newest" | "highest" | "lowest">("newest")

  // Build breakdown counts
  const breakdown = React.useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => {
      const k = Math.min(5, Math.max(1, Math.round(r.rating)))
      counts[k] = (counts[k] ?? 0) + 1
    })
    return counts
  }, [reviews])

  const sorted = React.useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "highest") return b.rating - a.rating
      return a.rating - b.rating
    })
  }, [reviews, sortBy])

  if (!reviews.length) {
    return (
      <div className={cn("py-10 text-center text-sm text-gray-500", className)}>
        No reviews yet. Be the first to share your experience!
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Panel */}
      <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-gray-50 border border-gray-100">
        {/* Score */}
        <div className="flex flex-col items-center justify-center gap-1 sm:pr-6 sm:border-r sm:border-gray-200">
          <span className="text-5xl font-bold text-gray-900 tabular-nums">
            {avgRating.toFixed(1)}
          </span>
          <StarRow rating={avgRating} size="md" />
          <span className="text-xs text-gray-500 mt-0.5">{totalCount} reviews</span>
        </div>

        {/* Breakdown */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBar
              key={star}
              label={String(star)}
              count={breakdown[star] ?? 0}
              total={totalCount}
            />
          ))}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          {reviews.length} Review{reviews.length !== 1 && "s"}
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          aria-label="Sort reviews"
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-gray-300"
        >
          <option value="newest">Newest</option>
          <option value="highest">Highest rated</option>
          <option value="lowest">Lowest rated</option>
        </select>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {sorted.map((review) => (
          <div
            key={review.id}
            className="p-4 sm:p-5 rounded-2xl border border-gray-100 bg-white shadow-xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                    {review.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{review.author}</span>
                  {review.verified && (
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <StarRow rating={review.rating} size="sm" />
              </div>
              <time className="text-[11px] text-gray-400 shrink-0">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </time>
            </div>

            <p className="text-sm font-semibold text-gray-800">{review.title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export { StarRow }
