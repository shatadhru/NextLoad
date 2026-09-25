"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { cn } from "@/payload/lib/utils"

export interface GalleryImage {
  src: string
  alt: string
}

export interface ProductImageGalleryProps {
  images: GalleryImage[]
  productTitle: string
  className?: string
}

/**
 * Mobile-first product image gallery with thumbnail strip,
 * keyboard navigation, and smooth transitions.
 */
export function ProductImageGallery({
  images,
  productTitle,
  className,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [zoomed, setZoomed] = React.useState(false)

  const total = images.length
  const current = images[activeIndex]

  const prev = () => setActiveIndex((i) => (i - 1 + total) % total)
  const next = () => setActiveIndex((i) => (i + 1) % total)

  // Keyboard navigation
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
      if (e.key === "Escape") setZoomed(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  })

  if (!images.length) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
        <span className="text-sm">No images</span>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
        <Image
          src={current.src}
          alt={current.alt || productTitle}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            "object-cover transition-all duration-500",
            zoomed && "scale-150 cursor-zoom-out",
            !zoomed && "cursor-zoom-in"
          )}
          onClick={() => setZoomed((z) => !z)}
        />

        {/* Zoom hint */}
        <button
          type="button"
          aria-label="Toggle zoom"
          onClick={() => setZoomed((z) => !z)}
          className={cn(
            "absolute top-3 right-3 flex size-8 items-center justify-center rounded-full",
            "bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm text-gray-500",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-gray-800",
            zoomed && "opacity-100"
          )}
        >
          <ZoomIn className="size-4" />
        </button>

        {/* Prev/Next arrows (only if multiple images) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full",
                "bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm text-gray-600",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-gray-900 hover:bg-white"
              )}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full",
                "bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm text-gray-600",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-gray-900 hover:bg-white"
              )}
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}

        {/* Dot indicators (mobile) */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  i === activeIndex
                    ? "w-5 h-1.5 bg-gray-800"
                    : "w-1.5 h-1.5 bg-gray-400/60"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip (hidden on mobile, shown on sm+) */}
      {total > 1 && (
        <div className="hidden sm:flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              aria-label={`View image ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative shrink-0 size-16 rounded-xl overflow-hidden border-2 transition-all duration-200",
                i === activeIndex
                  ? "border-gray-900 shadow-md"
                  : "border-transparent hover:border-gray-300 opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
