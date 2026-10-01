'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart, useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { Minus, Plus, Trash2, Loader2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  formatPrice,
  getProductTitle,
  getProductUnitPrice,
  getProductImageUrl,
} from './cart-utils'

interface CartDrawerItemProps {
  itemId: string
  product: any
  variant?: any
  quantity: number
}

export function CartDrawerItem({
  itemId,
  product,
  variant,
  quantity,
}: CartDrawerItemProps) {
  const { incrementItem, decrementItem, removeItem, isLoading } = useCart()
  const { currency } = useCurrency()
  const [isUpdating, setIsUpdating] = useState(false)

  const title = getProductTitle(product)
  const imageUrl = getProductImageUrl(product)
  const unitPrice = getProductUnitPrice(product, variant)
  const itemTotal = unitPrice * quantity
  const currencySymbol = currency?.symbol || '৳'

  const handleIncrement = async () => {
    if (isUpdating || isLoading) return
    setIsUpdating(true)
    try {
      await incrementItem(itemId)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDecrement = async () => {
    if (isUpdating || isLoading) return
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
    if (isUpdating || isLoading) return
    setIsUpdating(true)
    try {
      await removeItem(itemId)
    } finally {
      setIsUpdating(false)
    }
  }

  const productSlug = typeof product === 'object' && product?.slug ? product.slug : null

  return (
    <div className="group relative flex items-center gap-3.5 rounded-xl border border-border/70 bg-card/60 p-3 backdrop-blur-xs transition-all hover:border-primary/40 hover:shadow-xs">
      {/* Thumbnail */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground bg-muted/60">
            <Package className="size-6" />
          </div>
        )}
      </div>

      {/* Info & Controls */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {productSlug ? (
              <Link
                href={`/store/${productSlug}`}
                className="font-semibold text-xs sm:text-sm text-foreground hover:text-primary line-clamp-1 transition-colors"
              >
                {title}
              </Link>
            ) : (
              <span className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1">
                {title}
              </span>
            )}
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {formatPrice(unitPrice, currencySymbol, currency?.decimals || 0)} each
            </p>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUpdating}
            className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            title="Remove item"
            aria-label={`Remove ${title} from cart`}
          >
            {isUpdating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>
        </div>

        {/* Quantity Controls & Line Total */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-md border border-border/80 bg-background/90 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isUpdating}
              className="size-6 rounded flex items-center justify-center hover:bg-muted text-foreground transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-xs font-semibold tabular-nums text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={isUpdating}
              className="size-6 rounded flex items-center justify-center hover:bg-muted text-foreground transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <span className="font-semibold text-xs sm:text-sm text-foreground tabular-nums">
            {formatPrice(itemTotal, currencySymbol, currency?.decimals || 0)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartDrawerItem
