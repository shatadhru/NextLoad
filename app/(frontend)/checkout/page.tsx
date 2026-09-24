import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { CheckoutForm } from "@/components/ecommerch/checkout"
import { CartDrawer, CartIconTrigger } from "@/components/ecommerch/cart"
import { ChevronRight, Home, ShoppingBag, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Checkout | NextLoad",
  description: "Secure, reliable, and instant checkout for your NextLoad shopping cart.",
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Checkout Header */}
      <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Breadcrumb */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-black tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
            >
              NextLoad
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <ChevronRight className="size-3.5" />
              <Link href="/" className="hover:text-foreground flex items-center gap-1">
                <Home className="size-3" /> Home
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="text-foreground font-semibold flex items-center gap-1">
                <ShoppingBag className="size-3" /> Checkout
              </span>
            </div>
          </div>

          {/* Right Header: Cart Trigger and Security badge */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-medium">
              <ShieldCheck className="size-4" /> 256-bit SSL Secured
            </div>
            <CartDrawer trigger={<CartIconTrigger />} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        <CheckoutForm />
      </main>
    </div>
  )
}
