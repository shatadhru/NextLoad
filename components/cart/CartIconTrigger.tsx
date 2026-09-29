'use client'

import React, { useMemo } from 'react'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { useCartDrawer } from './cart-drawer-context'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CartIconTriggerProps {
  className?: string
  showBadge?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  ariaLabel?: string
}

export function CartIconTrigger({
  className,
  showBadge = true,
  size = 'icon',
  ariaLabel = 'Shopping Cart',
}: CartIconTriggerProps) {
  const { cart, isLoading } = useCart()
  const { openDrawer } = useCartDrawer()

  const totalItemCount = useMemo(() => {
    if (!cart?.items || !Array.isArray(cart.items)) return 0
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0)
  }, [cart?.items])

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={cn(
        buttonVariants({ variant: 'outline', size }),
        'relative inline-flex items-center justify-center rounded-xl border border-border/80 bg-background/80 hover:bg-accent/60 transition-all duration-200 shadow-xs cursor-pointer',
        className
      )}
      aria-label={`${ariaLabel}, ${totalItemCount} items in cart`}
    >
      <ShoppingBag className="size-4 text-foreground transition-transform duration-200 hover:scale-110" />

      {/* Floating item badge count */}
      {showBadge && totalItemCount > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-75 duration-200"
          data-slot="cart-badge"
        >
          {totalItemCount > 99 ? '99+' : totalItemCount}
        </span>
      )}

      {/* Syncing indicator */}
      {isLoading && (
        <span className="absolute -bottom-1 -right-1 flex size-3 items-center justify-center rounded-full bg-background border border-border">
          <Loader2 className="size-2 text-teal-600 animate-spin" />
        </span>
      )}
    </button>
  )
}

export default CartIconTrigger
