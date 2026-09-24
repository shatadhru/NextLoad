"use client"

import * as React from "react"
import { useCart, useCurrency } from "@payloadcms/plugin-ecommerce/client/react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { CartIconTrigger } from "./CartIconTrigger"
import { CartDrawerItem } from "./CartDrawerItem"
import { formatPrice } from "./cart-utils"
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  PackageOpen,
  Sparkles,
  ShieldCheck,
  RussianRuble,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/payload/lib/utils"

export interface CartDrawerProps {
  /**
   * Optional custom trigger element. Defaults to <CartIconTrigger />
   */
  trigger?: React.ReactNode
  /**
   * Drawer side, defaults to "right"
   */
  side?: "right" | "left" | "top" | "bottom"
  /**
   * Link target for checkout button, defaults to "/checkout"
   */
  checkoutUrl?: string
  /**
   * Link target for continue shopping, defaults to "/"
   */
  shoppingUrl?: string
  /**
   * Controlled open state
   */
  open?: boolean
  /**
   * Callback on open state change
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Custom class names for the drawer content
   */
  className?: string
}

/**
 * Reusable icon-based Cart Drawer component using shadcn Sheet & Payload CMS Ecommerce Plugin.
 * Displays real-time cart items, live subtotal, quantity controls, clear cart action,
 * and a direct checkout CTA.
 */
export function CartDrawer({
  trigger,
  side = "right",
  checkoutUrl = "/checkout",
  shoppingUrl = "/",
  open,
  onOpenChange,
  className,
}: CartDrawerProps) {
  const { cart, clearCart, isLoading } = useCart()
  const { currency } = useCurrency()
  const [internalOpen, setInternalOpen] = React.useState(false)

  const isControlled = open !== undefined
  const currentOpen = isControlled ? open : internalOpen
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const items = (cart?.items || []) as Array<{
    id?: string | null
    product?: any
    variant?: any
    quantity: number
  }>

  const totalCount = React.useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity || 0), 0)
  }, [items])

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const subtotal = React.useMemo(() => {
    if (typeof cart?.subtotal === "number") {
      return cart.subtotal
    }
    // Calculate manually as fallback if not computed on the document yet
    return items.reduce((sum, item) => {
      const prod = item.product
      const varnt = item.variant
      const unitPrice =
        (varnt && typeof varnt === "object" && typeof varnt.priceInBDT === "number"
          ? varnt.priceInBDT
          : null) ??
        (prod && typeof prod === "object"
          ? typeof prod.priceInBDT === "number"
            ? prod.priceInBDT
            : typeof prod.price === "number"
            ? prod.price
            : 0
          : 0)
      return sum + unitPrice * (item.quantity || 0)
    }, 0)
  }, [cart?.subtotal, items])

  const currencySymbol = currency?.symbol || "৳"
  const formattedSubtotal = formatPrice(subtotal, currencySymbol, currency?.decimals || 0)

  return (
    <Sheet open={currentOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger render={trigger ? <>{trigger}</> : <CartIconTrigger />} />

      <SheetContent
        side={side}
        className={cn(
          "flex h-full w-full sm:max-w-md flex-col p-0 bg-background/95 backdrop-blur-md border-l border-border/80 shadow-2xl",
          className
        )}
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold text-foreground">
                Your Shopping Cart
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {totalCount} {totalCount === 1 ? "item" : "items"} selected
              </SheetDescription>
            </div>
          </div>

          {items.length > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => clearCart()}
              className="mr-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs gap-1"
              title="Empty entire cart"
            >
              <Trash2 className="size-3" />
              <span>Clear</span>
            </Button>
          )}
        </SheetHeader>

        {/* Cart Item List / Empty State */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4 py-12">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50 border border-border/50 text-muted-foreground mb-4">
                <PackageOpen className="size-8 stroke-[1.5]" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Your cart is empty</h3>
              <p className="mt-1.5 text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                Looks like you haven&apos;t added anything to your cart yet. Explore our products to get started!
              </p>
              <SheetClose
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-6 gap-2 rounded-xl"
                    nativeButton={false}
                    render={<Link href={shoppingUrl} />}
                  >
                    <span>Start Shopping</span>
                  </Button>
                }
              />
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

        {/* Footer with totals and checkout */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-border/60 bg-muted/20 px-5 py-4 flex flex-col gap-3">
            {/* Free shipping / Guarantee banner */}
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs text-primary font-medium">
              <ShieldCheck className="size-4 shrink-0" />
              <span>Secure checkout powered by NextLoad</span>
            </div>

            {/* Subtotal line */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-base text-foreground tabular-nums">
                {formattedSubtotal}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Taxes and shipping calculated at checkout.
            </p>

            {/* Checkout Action Button */}
            <SheetClose
              render={
                <Button
                  size="lg"
                  className="w-full gap-2 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg"
                  nativeButton={false}
                  render={<Link href={checkoutUrl} />}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="size-4" />
                </Button>
              }
            />

            {/* Secondary Continue Shopping link */}
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                  nativeButton={false}
                  render={<Link href={shoppingUrl} />}
                >
                  Continue Shopping
                </Button>
              }
            />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
