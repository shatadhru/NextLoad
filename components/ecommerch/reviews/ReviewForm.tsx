"use client"

import * as React from "react"
import { Star, Send, Loader2 } from "lucide-react"
import { cn } from "@/payload/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export interface ReviewFormProps {
  productId: string
  productTitle?: string
  onSuccess?: () => void
  className?: string
}

/**
 * Review submission form. POSTs to /api/reviews via Payload REST.
 */
export function ReviewForm({
  productId,
  productTitle,
  onSuccess,
  className,
}: ReviewFormProps) {
  const [hoveredStar, setHoveredStar] = React.useState(0)
  const [selectedRating, setSelectedRating] = React.useState(5)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [title, setTitle] = React.useState("")
  const [body, setBody] = React.useState("")
  const [author, setAuthor] = React.useState("")
  const [authorEmail, setAuthorEmail] = React.useState("")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = "Please add a title"
    if (!body.trim()) errs.body = "Please write your review"
    if (!author.trim()) errs.author = "Please enter your name"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          author,
          authorEmail,
          rating: selectedRating,
          product: productId,
        }),
      })
      if (!res.ok) throw new Error("Submission failed")
      toast.success("Review submitted!", {
        description: "Your review is pending approval and will appear shortly.",
      })
      setTitle("")
      setBody("")
      setAuthor("")
      setAuthorEmail("")
      setErrors({})
      setSelectedRating(5)
      onSuccess?.()
    } catch {
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredStar || selectedRating

  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs", className)}
    >
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">Write a Review</h3>
        {productTitle && (
          <p className="text-xs text-gray-500">for {productTitle}</p>
        )}
      </div>

      {/* Star Rating Picker */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-gray-600">Your Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setSelectedRating(star)}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={cn(
                  "size-7 transition-colors duration-100",
                  star <= displayRating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="review-title" className="text-xs font-medium text-gray-600">
          Review Title <span className="text-red-400">*</span>
        </Label>
        <Input
          id="review-title"
          placeholder="e.g. Amazing quality!"
          className="rounded-xl text-sm"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }))
          }}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <Label htmlFor="review-body" className="text-xs font-medium text-gray-600">
          Your Review <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="review-body"
          placeholder="Share your experience with this product…"
          rows={4}
          className="rounded-xl text-sm resize-none"
          value={body}
          onChange={(e) => {
            setBody(e.target.value)
            if (errors.body) setErrors((prev) => ({ ...prev, body: "" }))
          }}
        />
        {errors.body && (
          <p className="text-xs text-red-500">{errors.body}</p>
        )}
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="review-author" className="text-xs font-medium text-gray-600">
            Your Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="review-author"
            placeholder="John Doe"
            className="rounded-xl text-sm"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value)
              if (errors.author) setErrors((prev) => ({ ...prev, author: "" }))
            }}
          />
          {errors.author && (
            <p className="text-xs text-red-500">{errors.author}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="review-email" className="text-xs font-medium text-gray-600">
            Email (not shown)
          </Label>
          <Input
            id="review-email"
            type="email"
            placeholder="you@example.com"
            className="rounded-xl text-sm"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        size="sm"
        className="w-full rounded-xl gap-2 font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Submit Review
          </>
        )}
      </Button>
    </form>
  )
}
