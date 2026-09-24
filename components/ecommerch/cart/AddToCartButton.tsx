"use client"

import * as React from "react"
import { useCart } from "@payloadcms/plugin-ecommerce/client/react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/payload/lib/utils"

export interface AddToCartButtonProps {
  /**
   * The Payload product document ID (string or number depending on DB adapter)
   */
  productId: string
  /**
   * Optional variant document ID
   */
  variantId?: string
  /**
   * Quantity to add (defaults to 1)
   */
  quantity?: number
  /**
   * Optional product title to display in success toast
   */
  productTitle?: string
  /**
   * Optional custom button label (default: "Add to Cart")
   */
  label?: string
  /**
   * Icon-only mode (useful for product cards / grids)
   */
  iconOnly?: boolean
  /**
   * Button variant
   */
  variant?: "default" | "outline" | "secondary" | "ghost"
  /**
   * Button size
   */
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  /**
   * Custom classes
   */
  className?: string
  /**
   * Disabled state override
   */
  disabled?: boolean
  /**
   * Callback on success
   */
  onSuccess?: () => void
}

/**
 * Reusable AddToCart button that integrates with Payload CMS Ecommerce plugin.
 * Handles loading spinners, success state feedback, and Sonner notifications.
 */
export function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  productTitle,
  label = "Add to Cart",
  iconOnly = false,
  variant = "default",
  size = "default",
  className,
  disabled = false,
  onSuccess,
}: AddToCartButtonProps) {
  const { addItem, isLoading } = useCart()
  const [isAdding, setIsAdding] = React.useState(false)
  const [justAdded, setJustAdded] = React.useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!productId || isAdding || isLoading) return

    setIsAdding(true)
    try {
      await addItem(
        {
          product: productId,
          ...(variantId ? { variant: variantId } : {}),
        },
        quantity
      )

      setJustAdded(true)
      toast.success(
        productTitle
          ? `Added "${productTitle}" to cart`
          : "Item added to cart",
        {
          description: `Quantity: ${quantity}`,
        }
      )

      onSuccess?.()

      setTimeout(() => {
        setJustAdded(false)
      }, 2000)
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.")
      // eslint-disable-next-line no-console
      console.error("AddToCart error:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const effectiveLoading = isAdding || isLoading

  if (iconOnly) {
    return (
      <Button
        variant={variant}
        size={size === "default" ? "icon" : size}
        onClick={handleAddToCart}
        disabled={disabled || effectiveLoading}
        className={cn("rounded-xl transition-all", className)}
        aria-label={`Add ${productTitle || "product"} to cart`}
      >
        {effectiveLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : justAdded ? (
          <Check className="size-4 text-emerald-500 animate-in zoom-in" />
        ) : (
          <ShoppingBag className="size-4" />
        )}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={disabled || effectiveLoading}
      className={cn(
        "gap-2 rounded-xl font-medium transition-all shadow-xs",
        justAdded && "bg-emerald-600 text-white hover:bg-emerald-700",
        className
      )}
    >
      {effectiveLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : justAdded ? (
        <Check className="size-4 animate-in zoom-in" />
      ) : (
        <ShoppingBag className="size-4" />
      )}
      <span>{justAdded ? "Added to Cart" : label}</span>
    </Button>
  )
}
