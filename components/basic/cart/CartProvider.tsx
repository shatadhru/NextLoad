'use client'

import React from 'react'
import { CartDrawerProvider } from './cart-drawer-context'
import { CartDrawer } from './CartDrawer'

export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartDrawerProvider>
      {children}
      <CartDrawer />
    </CartDrawerProvider>
  )
}

export default CartProvider
