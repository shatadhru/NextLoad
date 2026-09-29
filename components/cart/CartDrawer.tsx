'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useCart, useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  ShoppingBag,
  Trash2,
  PackageOpen,
  ShieldCheck,
  ArrowRight,
  X,
  Lock,
} from 'lucide-react'
import { useCartDrawer } from './cart-drawer-context'
import { CartDrawerItem } from './CartDrawerItem'
import { formatPrice } from './cart-utils'
import { cn } from '@/lib/utils'

export interface CartDrawerProps {
  checkoutUrl?: string
  shoppingUrl?: string
  className?: string
}

export function CartDrawer({
  checkoutUrl = '/checkout',
  shoppingUrl = '/blog',
  className,
}: CartDrawerProps) {
  const { isOpen, setIsOpen, closeDrawer } = useCartDrawer()
  const { cart, clearCart, isLoading } = useCart()
  const { currency } = useCurrency()

  const items = (cart?.items || []) as Array<{
    id?: string | null
    product?: any
    variant?: any
    quantity: number
  }>

  const totalCount = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity || 0), 0)
  }, [items])

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const subtotal = useMemo(() => {
    if (typeof cart?.subtotal === 'number') {
      return cart.subtotal
    }
    return items.reduce((sum, item) => {
      const prod = item.product
      const varnt = item.variant
      const unitPrice =
        (varnt && typeof varnt === 'object' && typeof varnt.priceInBDT === 'number'
          ? varnt.priceInBDT
          : null) ??
        (prod && typeof prod === 'object'
          ? typeof prod.priceInBDT === 'number'
            ? prod.priceInBDT
            : typeof prod.price === 'number'
            ? prod.price
            : 0
          : 0)
      return sum + unitPrice * (item.quantity || 0)
    }, 0)
  }, [cart?.subtotal, items])

  const currencySymbol = currency?.symbol || '৳'
  const formattedSubtotal = formatPrice(subtotal, currencySymbol, currency?.decimals || 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className={cn(
          // Mobile: 100% full screen drawer!
          'w-full! h-full! max-w-none! inset-0!',
          // Desktop: sleek minimal right slide-over drawer!
          'sm:w-full! sm:max-w-md! sm:inset-y-0! sm:right-0! sm:left-auto! sm:h-full!',
          'flex flex-col p-0 bg-background/95 backdrop-blur-md border-l border-border/80 shadow-2xl z-50',
          className
        )}
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border/60 px-5 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-2xs">
              <ShoppingBag className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-foreground">
                Shopping Cart
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} in your cart
              </SheetDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearCart()}
                disabled={isLoading}
                className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2 gap-1"
                title="Clear all items"
              >
                <Trash2 className="size-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}

            {/* Custom Close Button */}
            <button
              type="button"
              onClick={closeDrawer}
              className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="size-4" />
            </button>
          </div>
        </SheetHeader>

        {/* Body: Items or Empty State */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4 py-16">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 mb-4 shadow-xs">
                <PackageOpen className="size-10 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Your cart is empty</h3>
              <p className="mt-1.5 text-xs text-muted-foreground max-w-[260px] leading-relaxed">
                You haven&apos;t added any items to your cart yet. Explore our products and articles to get started!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={closeDrawer}
                className="mt-6 rounded-xl text-xs font-semibold gap-1.5"
                
              >
                <Link href={shoppingUrl}>
                  <span>Start Exploring</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item, index) => {
                const itemId = item.id || `cart-item-${index}`
                return (
                  <CartDrawerItem
                    key={itemId}
                    itemId={itemId}
                    product={item.product}
                    variant={item.variant}
                    quantity={item.quantity}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Footer: Subtotal & Checkout */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-border/60 bg-muted/20 px-5 py-4 flex flex-col gap-3 shrink-0">
            {/* Payload CMS Security Guarantee */}
            <div className="flex items-center gap-2 rounded-lg bg-teal-500/10 border border-teal-500/20 px-3 py-2 text-xs text-teal-700 dark:text-teal-300 font-medium">
              <ShieldCheck className="size-4 shrink-0 text-teal-600 dark:text-teal-400" />
              <span>Encrypted & secure checkout via Payload CMS</span>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm pt-1">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="font-bold text-lg text-foreground tabular-nums">
                {formattedSubtotal}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Taxes and shipping fees calculated at checkout.
            </p>

            {/* Checkout Button */}
            <Button
              size="lg"
              onClick={closeDrawer}
              className="w-full gap-2 rounded-xl font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all hover:shadow-lg cursor-pointer"
            >
              <Link href={checkoutUrl}>
                <Lock className="size-4" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="size-4 ml-auto" />
              </Link>
            </Button>

            {/* Continue Shopping Button */}
            <button
              type="button"
              onClick={closeDrawer}
              className="w-full py-1 text-center text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CartDrawer
