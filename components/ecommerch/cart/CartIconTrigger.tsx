"use client"

import * as React from "react"
import { useCart, useCurrency } from "@payloadcms/plugin-ecommerce/client/react"
import { ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/payload/lib/utils"

export interface CartIconTriggerProps {
  className?: string
  /**
   * If true, renders a subtle floating indicator or badge
   */
  showBadge?: boolean
  /**
   * Icon size variant
   */
  size?: "default" | "sm" | "lg" | "icon"
  /**
   * Optional custom aria-label
   */
  ariaLabel?: string
  /**
   * Optional click handler (overrides default or attaches to it)
   */
  onClick?: () => void
}

/**
 * Reusable icon-based Cart trigger button with real-time item counter badge
 * Connects directly to Payload CMS Ecommerce plugin client state
 */
export function CartIconTrigger({
  className,
  showBadge = true,
  size = "icon",
  ariaLabel = "Shopping Cart",
  onClick,
}: CartIconTriggerProps) {
  const { cart, isLoading } = useCart()
  const { currency } = useCurrency()

  // Calculate total item count safely across items array
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const totalItemCount = React.useMemo(() => {
    if (!cart?.items || !Array.isArray(cart.items)) return 0
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0)
  }, [cart?.items])

  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl border border-border/80 bg-background/80 hover:bg-accent/60 transition-all duration-200 shadow-xs",
        className
      )}
      aria-label={`${ariaLabel}, ${totalItemCount} items in cart`}
    >
      <ShoppingBag className="size-4.5 text-foreground transition-transform duration-200 group-hover/button:scale-110" />

      {/* Item badge count */}
      {showBadge && totalItemCount > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground shadow-xs animate-in zoom-in-75 duration-200"
          data-slot="cart-badge"
        >
          {totalItemCount > 99 ? "99+" : totalItemCount}
        </span>
      )}

      {/* Subdued loader indicator when cart operation is syncing */}
      {isLoading && (
        <span className="absolute -bottom-1 -right-1 flex size-3 items-center justify-center rounded-full bg-background border border-border">
          <Loader2 className="size-2 text-primary animate-spin" />
        </span>
      )}
    </Button>
  )
}
