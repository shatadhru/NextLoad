"use client"

import * as React from "react"
import { useCart, useCurrency } from "@payloadcms/plugin-ecommerce/client/react"
import { ShoppingBag, Loader2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/payload/lib/utils"

export interface CartIconTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
}

/**
 * Reusable icon-based Cart trigger button with real-time item counter badge.
 * Uses native button with forwarded ref to seamlessly support Base UI / Radix SheetTrigger.
 */
export const CartIconTrigger = React.forwardRef<HTMLButtonElement, CartIconTriggerProps>(
  function CartIconTrigger(
    {
      className,
      showBadge = true,
      size = "icon",
      ariaLabel = "Shopping Cart",
      onClick,
      ...props
    },
    ref
  ) {
    const { cart, isLoading } = useCart()
    const { currency } = useCurrency()

    // Calculate total item count safely across items array
    const totalItemCount = React.useMemo(() => {
      if (!cart?.items || !Array.isArray(cart.items)) return 0
      return cart.items.reduce((total, item) => total + (item.quantity || 0), 0)
    }, [cart?.items])

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          buttonVariants({ variant: "outline", size }),
          "relative inline-flex items-center justify-center rounded-xl border border-border/80 bg-background/80 hover:bg-accent/60 transition-all duration-200 shadow-xs cursor-pointer",
          className
        )}
        aria-label={`${ariaLabel}, ${totalItemCount} items in cart`}
        {...props}
      >
        <ShoppingBag className="size-4 text-foreground transition-transform duration-200 hover:scale-110" />

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
      </button>
    )
  }
)

CartIconTrigger.displayName = "CartIconTrigger"
