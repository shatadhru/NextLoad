"use client"

import * as React from "react"
import { useCart, useCurrency } from "@payloadcms/plugin-ecommerce/client/react"
import { Plus, Minus, Trash2, Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SafeCldImage, isCloudinarySrc } from "@/components/ui/SafeCldImage"
import {
  formatPrice,
  getProductTitle,
  getProductUnitPrice,
  getProductImageUrl,
  getProductImageAlt,
} from "./cart-utils"
import type { Product, Variant } from "@/payload/payload-types"
import { cn } from "@/payload/lib/utils"

export interface CartDrawerItemProps {
  itemId: string
  product: string | Product | null | undefined
  variant?: string | Variant | null | undefined
  quantity: number
  className?: string
}

/**
 * Individual Cart item row with item image, product title, unit price,
 * quantity increment/decrement controls, item subtotal, and remove action.
 */
export function CartDrawerItem({
  itemId,
  product,
  variant,
  quantity,
  className,
}: CartDrawerItemProps) {
  const { incrementItem, decrementItem, removeItem } = useCart()
  const { currency } = useCurrency()
  const [isUpdating, setIsUpdating] = React.useState(false)

  const title = getProductTitle(product)
  const unitPrice = getProductUnitPrice(product, variant)
  const imageUrl = getProductImageUrl(product)
  const imageAlt = getProductImageAlt(product)
  const itemTotal = unitPrice * quantity
  const currencySymbol = currency?.symbol || "৳"

  const handleIncrement = async () => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      await incrementItem(itemId)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDecrement = async () => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      if (quantity <= 1) {
        await removeItem(itemId)
      } else {
        await decrementItem(itemId)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      await removeItem(itemId)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3.5 rounded-xl border border-border/50 bg-card p-3 transition-colors hover:border-border",
        isUpdating && "opacity-60 pointer-events-none",
        className
      )}
    >
      {/* Product Image Thumbnail */}
      <div className="relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/60 border border-border/40">
        {imageUrl && isCloudinarySrc(imageUrl) ? (
          <SafeCldImage
            src={imageUrl}
            alt={imageAlt}
            width={120}
            height={120}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Package className="size-6 text-muted-foreground/60" />
        )}
      </div>

      {/* Product Info & Actions */}
      <div className="flex flex-1 flex-col justify-between self-stretch">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="line-clamp-1 font-medium text-sm text-foreground">
              {title}
            </h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatPrice(unitPrice, currencySymbol, currency?.decimals || 0)} each
            </p>
          </div>

          {/* Remove Item Button */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Remove item"
            aria-label={`Remove ${title} from cart`}
          >
            {isUpdating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </Button>
        </div>

        {/* Quantity Controls & Line Total */}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-border/80 bg-background p-0.5 shadow-2xs">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleDecrement}
              disabled={isUpdating}
              className="size-6 rounded-md hover:bg-muted text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-7 text-center text-xs font-semibold tabular-nums text-foreground">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleIncrement}
              disabled={isUpdating}
              className="size-6 rounded-md hover:bg-muted text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </Button>
          </div>

          <span className="font-semibold text-sm text-foreground tabular-nums">
            {formatPrice(itemTotal, currencySymbol, currency?.decimals || 0)}
          </span>
        </div>
      </div>
    </div>
  )
}
