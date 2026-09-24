"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart, useCurrency, useAddresses } from "@payloadcms/plugin-ecommerce/client/react"
import {
  formatPrice,
  getProductTitle,
  getProductUnitPrice,
  getProductImageUrl,
  getProductImageAlt,
} from "../cart/cart-utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Truck,
  ShieldCheck,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  User,
  Mail,
  Phone,
  Building2,
  Sparkles,
  RotateCcw,
  BadgeCheck,
} from "lucide-react"

// Popular country list with Bangladesh first
const SUPPORTED_COUNTRIES = [
  { label: "Bangladesh", value: "BD" },
  { label: "United States", value: "US" },
  { label: "United Kingdom", value: "GB" },
  { label: "Canada", value: "CA" },
  { label: "Australia", value: "AU" },
  { label: "India", value: "IN" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "Saudi Arabia", value: "SA" },
  { label: "Singapore", value: "SG" },
  { label: "Malaysia", value: "MY" },
]

export function CheckoutForm() {
  const router = useRouter()
  const { cart, isLoading: isCartLoading, clearCart } = useCart()
  const { currency } = useCurrency()
  const { addresses, isLoading: isAddressesLoading } = useAddresses()

  // Form State
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  })

  const [shippingAddress, setShippingAddress] = useState({
    title: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "Dhaka",
    state: "Dhaka Division",
    postalCode: "",
    country: "BD",
  })

  const [deliveryInstructions, setDeliveryInstructions] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "mobile_banking" | "card" | "bank_transfer">("cod")
  const [saveAddress, setSaveAddress] = useState(false)
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(null)

  // Promo code mock state
  const [promoCode, setPromoCode] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [completedOrder, setCompletedOrder] = useState<any | null>(null)

  // Populate from saved address if selected
  const handleSelectSavedAddress = (addressId: string) => {
    setSelectedSavedAddressId(addressId)
    const found = addresses?.find((a: any) => a.id === addressId)
    if (found) {
      setCustomerInfo((prev) => ({
        ...prev,
        firstName: found.firstName || prev.firstName,
        lastName: found.lastName || prev.lastName,
        phone: found.phone || prev.phone,
        company: found.company || prev.company,
      }))
      setShippingAddress({
        title: found.title || "Saved Address",
        addressLine1: found.addressLine1 || "",
        addressLine2: found.addressLine2 || "",
        city: found.city || "",
        state: found.state || "",
        postalCode: found.postalCode || "",
        country: found.country || "BD",
      })
    }
  }

  // Calculate items and pricing
  const items = cart?.items || []
  const subtotal = items.reduce((acc, item) => {
    const unitPrice = getProductUnitPrice(item.product, item.variant)
    return acc + unitPrice * (item.quantity || 1)
  }, 0)

  // Free shipping over 1500 BDT or standard 60 BDT
  const shippingCost = subtotal > 1500 || subtotal === 0 ? 0 : 60
  const grandTotal = Math.max(0, subtotal + shippingCost - discountAmount)

  // Handle promo code apply
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError("")
    setPromoSuccess("")

    const cleanCode = promoCode.trim().toUpperCase()
    if (!cleanCode) return

    if (cleanCode === "NEXT10" || cleanCode === "WELCOME10") {
      const discount = Math.round(subtotal * 0.1)
      setDiscountAmount(discount)
      setPromoSuccess(`Promo code applied! 10% discount (-৳${discount})`)
    } else if (cleanCode === "FREESHIP") {
      setDiscountAmount(shippingCost)
      setPromoSuccess("Free shipping promo applied!")
    } else {
      setPromoError("Invalid promo code. Try NEXT10 for 10% off.")
    }
  }

  // Handle order submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Form validation
    if (!customerInfo.firstName.trim() || !customerInfo.email.trim() || !customerInfo.phone.trim()) {
      setErrorMessage("Please complete your contact details (First Name, Email, Phone number).")
      return
    }

    if (!shippingAddress.addressLine1.trim() || !shippingAddress.city.trim()) {
      setErrorMessage("Please complete your delivery address (Street Address and City).")
      return
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items to checkout.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo,
          shippingAddress,
          deliveryInstructions,
          paymentMethod,
          items: items.map((item) => ({
            product: item.product,
            variant: item.variant,
            quantity: item.quantity,
          })),
          subtotal,
          shippingCost,
          saveAddress,
          cartID: (cart as any)?.id,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process your order. Please try again.")
      }

      // Clear the cart locally and via context
      try {
        await clearCart()
      } catch (clearErr) {
        console.warn("Failed to clear cart on client:", clearErr)
      }

      // Set order confirmation details
      setCompletedOrder({
        orderID: data.orderID,
        orderNumber: data.orderNumber || data.orderID?.slice(-8).toUpperCase(),
        total: grandTotal,
        items: [...items],
        customerInfo,
        shippingAddress,
        paymentMethod,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      })
    } catch (err: any) {
      console.error("Order submission error:", err)
      setErrorMessage(err.message || "An unexpected error occurred while placing your order.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ----------------------------------------------------
  // 1. LOADING SKELETON STATE
  // ----------------------------------------------------
  if (isCartLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-44 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Skeleton className="size-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
                <Separator />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-12 w-full mt-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // ----------------------------------------------------
  // 2. ORDER SUCCESS CONFIRMATION STATE
  // ----------------------------------------------------
  if (completedOrder) {
    return (
      <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />
          <CardHeader className="text-center pb-6 pt-8">
            <div className="size-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-500/5 animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="size-10" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Thank You! Order Confirmed
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2 max-w-md mx-auto">
              Your order has been placed successfully and is now being processed. A receipt has been sent to{" "}
              <span className="font-semibold text-foreground">{completedOrder.customerInfo.email}</span>.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order meta bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-card border text-sm">
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">Order Number</span>
                <span className="font-mono font-bold text-foreground text-base">#{completedOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">Date</span>
                <span className="font-medium text-foreground">{completedOrder.date}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">Total Paid</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">{formatPrice(completedOrder.total, currency?.symbol || "৳", 0)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">Payment</span>
                <span className="font-medium capitalize text-foreground">
                  {completedOrder.paymentMethod.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="p-4 rounded-xl bg-card border space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <MapPin className="size-4 text-primary" /> Delivery Address
              </h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {completedOrder.customerInfo.firstName} {completedOrder.customerInfo.lastName}
                </span>
                <br />
                {completedOrder.shippingAddress.addressLine1}
                {completedOrder.shippingAddress.addressLine2 && `, ${completedOrder.shippingAddress.addressLine2}`}
                <br />
                {completedOrder.shippingAddress.city} - {completedOrder.shippingAddress.postalCode}, {completedOrder.shippingAddress.country}
                <br />
                Phone: {completedOrder.customerInfo.phone}
              </p>
            </div>

            {/* Ordered Items Preview */}
            <div className="border rounded-xl p-4 bg-card divide-y">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ShoppingBag className="size-4 text-primary" /> Ordered Items ({completedOrder.items.length})
              </h4>
              <div className="space-y-3 pt-2">
                {completedOrder.items.map((item: any, idx: number) => {
                  const title = getProductTitle(item.product)
                  const unitPrice = getProductUnitPrice(item.product, item.variant)
                  const imageUrl = getProductImageUrl(item.product)
                  const imageAlt = getProductImageAlt(item.product)

                  return (
                    <div key={idx} className="flex items-center gap-3 pt-2 first:pt-0">
                      <div className="relative size-12 rounded-lg bg-muted border overflow-hidden shrink-0">
                        {imageUrl ? (
                          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
                        ) : (
                          <div className="size-full flex items-center justify-center text-muted-foreground">
                            <ShoppingBag className="size-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-foreground">
                          {formatPrice(unitPrice * item.quantity, currency?.symbol || "৳", 0)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/"
                className={cn(buttonVariants({ size: "lg" }), "flex-1")}
              >
                <ArrowLeft className="mr-2 size-4" /> Continue Shopping
              </Link>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-1")}
              >
                <BadgeCheck className="mr-2 size-4" /> Go to Dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ----------------------------------------------------
  // 3. EMPTY CART STATE
  // ----------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 px-4 text-center">
        <Card className="border-dashed p-8 sm:p-12">
          <div className="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="size-10" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">Your Shopping Cart is Empty</CardTitle>
          <CardDescription className="text-muted-foreground max-w-sm mx-auto mb-6">
            Looks like you haven&apos;t added any items to your cart yet. Explore our store and pick your favorites.
          </CardDescription>
          <Link
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "rounded-xl px-8 shadow-md inline-flex items-center justify-center")}
          >
            <ShoppingBag className="mr-2 size-4" /> Start Shopping
          </Link>
        </Card>
      </div>
    )
  }

  // ----------------------------------------------------
  // 4. MAIN CHECKOUT FORM & REVIEW
  // ----------------------------------------------------
  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <ShieldCheck className="size-4" /> Secure 256-bit Encrypted Checkout
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Checkout</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Please provide your contact information and delivery address to complete your order.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
          <div className="size-2 rounded-full bg-destructive shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Customer info, Delivery Address, Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Contact Information */}
            <Card className="border shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <User className="size-5 text-primary" /> Customer Contact
                  </CardTitle>
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-medium">
                    Step 1 of 3
                  </span>
                </div>
                <CardDescription>
                  We&apos;ll send the order confirmation and tracking updates here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      placeholder="e.g. John"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="e.g. Doe"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="e.g. +880 1712 345678"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-muted-foreground font-normal">Company (Optional)</Label>
                  <Input
                    id="company"
                    placeholder="Company or Business name"
                    value={customerInfo.company}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Shipping Address */}
            <Card className="border shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="size-5 text-primary" /> Delivery & Shipping Address
                  </CardTitle>
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-medium">
                    Step 2 of 3
                  </span>
                </div>
                <CardDescription>
                  Where should we dispatch your products?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saved addresses selector if available */}
                {addresses && addresses.length > 0 && (
                  <div className="p-3 bg-muted/40 rounded-xl border mb-4 space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Use Saved Address
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {addresses.map((addr: any) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(addr.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            selectedSavedAddressId === addr.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          {addr.title || "Address"} ({addr.city})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Street Address *</Label>
                  <Input
                    id="addressLine1"
                    required
                    placeholder="House / Flat no., Road, Street"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2" className="text-muted-foreground font-normal">
                    Apartment, suite, unit, area (Optional)
                  </Label>
                  <Input
                    id="addressLine2"
                    placeholder="e.g. Sector 4, Uttara"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City / District *</Label>
                    <Input
                      id="city"
                      required
                      placeholder="e.g. Dhaka"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Division</Label>
                    <Input
                      id="state"
                      placeholder="e.g. Dhaka"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="e.g. 1230"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-muted-foreground font-normal">
                    Delivery Instructions / Notes (Optional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="e.g. Please call before arriving or leave with front desk security."
                    rows={2}
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary size-4"
                    />
                    <span>Save this address to my account for future orders</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* 3. Payment Method */}
            <Card className="border shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <CreditCard className="size-5 text-primary" /> Payment Method
                  </CardTitle>
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-medium">
                    Step 3 of 3
                  </span>
                </div>
                <CardDescription>
                  Choose how you would like to pay for your purchase.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Option 1: Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted/50 border-input"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <Banknote className="size-4 text-emerald-600 dark:text-emerald-400" /> Cash on Delivery (COD)
                      </span>
                      <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pay with cash directly to the delivery person once your package arrives at your door.
                    </p>
                  </div>
                </label>

                {/* Option 2: Mobile Banking (bKash / Nagad / Rocket) */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "mobile_banking"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted/50 border-input"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="mobile_banking"
                    checked={paymentMethod === "mobile_banking"}
                    onChange={() => setPaymentMethod("mobile_banking")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <Wallet className="size-4 text-rose-500" /> Mobile Banking (bKash / Nagad / Rocket)
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">Instant</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Quick payment via bKash, Nagad, or Rocket mobile wallet gateway.
                    </p>
                  </div>
                </label>

                {/* Option 3: Credit / Debit Card */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted/50 border-input"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <CreditCard className="size-4 text-blue-500" /> Credit / Debit Card
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">Visa / MC / Amex</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Secure payment with local & international cards via verified payment gateway.
                    </p>
                  </div>
                </label>

                {/* Option 4: Direct Bank Transfer */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "bank_transfer"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted/50 border-input"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <Building2 className="size-4 text-violet-500" /> Direct Bank Transfer
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">BFTN / NPSB</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Transfer money directly from your bank account. Account info provided on checkout.
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary */}
          <div className="lg:col-span-5 sticky top-20 space-y-6">
            <Card className="border shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ShoppingBag className="size-5 text-primary" /> Order Summary
                  </CardTitle>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-5">
                {/* Item List */}
                <div className="divide-y max-h-72 overflow-y-auto pr-1">
                  {items.map((item, idx) => {
                    const title = getProductTitle(item.product)
                    const unitPrice = getProductUnitPrice(item.product, item.variant)
                    const imageUrl = getProductImageUrl(item.product)
                    const imageAlt = getProductImageAlt(item.product)

                    return (
                      <div key={idx} className="flex gap-3 py-3 first:pt-0 last:pb-0 items-center">
                        <div className="relative size-14 rounded-lg bg-muted border overflow-hidden shrink-0">
                          {imageUrl ? (
                            <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
                          ) : (
                            <div className="size-full flex items-center justify-center text-muted-foreground">
                              <ShoppingBag className="size-5" />
                            </div>
                          )}
                          <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{title}</p>
                          <p className="text-xs text-muted-foreground">
                            Unit: {formatPrice(unitPrice, currency?.symbol || "৳", 0)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-foreground">
                            {formatPrice(unitPrice * (item.quantity || 1), currency?.symbol || "৳", 0)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Separator />

                {/* Promo Code Input */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code (e.g. NEXT10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="text-xs uppercase"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleApplyPromo}
                      disabled={isSubmitting || !promoCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                  {promoSuccess && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Sparkles className="size-3" /> {promoSuccess}
                    </p>
                  )}
                  {promoError && (
                    <p className="text-xs text-destructive">{promoError}</p>
                  )}
                </div>

                <Separator />

                {/* Calculation breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">
                      {formatPrice(subtotal, currency?.symbol || "৳", 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Truck className="size-3.5" /> Shipping & Delivery
                    </span>
                    <span className="font-medium text-foreground">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase text-xs">
                          Free Shipping
                        </span>
                      ) : (
                        formatPrice(shippingCost, currency?.symbol || "৳", 0)
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount, currency?.symbol || "৳", 0)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-base font-bold text-foreground">Total</span>
                    <span className="text-2xl font-black text-primary">
                      {formatPrice(grandTotal, currency?.symbol || "৳", 0)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-right">
                    Including all applicable VAT & Taxes
                  </p>
                </div>

                {/* Submit button with Shadcn Spinner loading state */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full text-base font-bold py-6 rounded-xl shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 size-5 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 size-5" />
                      Place Order • {formatPrice(grandTotal, currency?.symbol || "৳", 0)}
                    </>
                  )}
                </Button>

                {/* Trust and Assurance badges */}
                <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Safe & Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-primary shrink-0" />
                    <span>Fast Island-wide Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="size-4 text-amber-500 shrink-0" />
                    <span>7-Day Return Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="size-4 text-blue-500 shrink-0" />
                    <span>100% Genuine Products</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
