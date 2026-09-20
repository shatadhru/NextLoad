"use client"

import React from "react"
import { CldImage as BaseCldImage, type CldImageProps } from "next-cloudinary"
import { cn } from "@/lib/utils"

export interface SafeCldImageProps extends Omit<CldImageProps, "src" | "alt"> {
  src: string
  alt: string
  fallbackSrc?: string
}

/**
 * Safely check if a given string is a Cloudinary asset (URL or public ID).
 */
export function isCloudinarySrc(src: string): boolean {
  if (!src || typeof src !== "string") return false
  if (src.includes("res.cloudinary.com") || src.includes("cloudinary.com")) return true
  // If it's a Cloudinary public ID (doesn't start with protocol, leading slash, or data:)
  if (
    !src.startsWith("http://") &&
    !src.startsWith("https://") &&
    !src.startsWith("/") &&
    !src.startsWith("data:")
  ) {
    return true
  }
  return false
}

/**
 * Safe wrapper around next-cloudinary's CldImage.
 * Automatically utilizes Cloudinary's fast edge CDN, auto-formatting (AVIF/WebP),
 * and responsive sizing, with seamless fallback for non-Cloudinary images.
 */
export function SafeCldImage({
  src,
  width = 960,
  height = 600,
  sizes = "100vw",
  alt,
  className,
  fallbackSrc,
  ...props
}: SafeCldImageProps) {
  if (!src) {
    if (fallbackSrc) {
      return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={fallbackSrc}
          alt={alt}
          className={cn("object-contain", className)}
        />
      )
    }
    return null
  }

  // If Cloudinary asset, use next-cloudinary's CldImage
  if (isCloudinarySrc(src)) {
    return (
      <BaseCldImage
        width={width}
        height={height}
        src={src}
        sizes={sizes}
        alt={alt}
        className={className}
        {...props}
      />
    )
  }

  // Safe fallback for local/external non-Cloudinary images
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className={className}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
    />
  )
}

export { BaseCldImage as CldImage }
export default SafeCldImage
