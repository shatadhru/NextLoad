import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { getServerSession } from "@delmaredigital/payload-better-auth"

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, req.headers)

    const body = await req.json()
    const {
      customerInfo,
      shippingAddress,
      deliveryInstructions,
      paymentMethod,
      items,
      subtotal,
      shippingCost = 0,
      saveAddress = false,
      cartID,
    } = body

    // 1. Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty. Please add items before checking out." },
        { status: 400 }
      )
    }

    if (!customerInfo?.email || !customerInfo?.firstName || !customerInfo?.phone) {
      return NextResponse.json(
        { error: "Please fill in all required customer contact details (Name, Email, Phone)." },
        { status: 400 }
      )
    }

    if (!shippingAddress?.addressLine1 || !shippingAddress?.city) {
      return NextResponse.json(
        { error: "Please provide a valid shipping address (Address Line 1 and City)." },
        { status: 400 }
      )
    }

    // 2. Prepare items for Payload Order collection
    // Items format: { product: string | object, variant?: string | object, quantity: number }
    const orderItems = items.map((item: any) => {
      const productID =
        typeof item.product === "object" && item.product !== null
          ? item.product.id
          : item.product
      const variantID =
        item.variant && typeof item.variant === "object"
          ? item.variant.id
          : item.variant || undefined

      return {
        product: productID,
        ...(variantID ? { variant: variantID } : {}),
        quantity: Math.max(1, Number(item.quantity) || 1),
      }
    })

    // Calculate total amount
    const totalAmount = Math.max(0, (Number(subtotal) || 0) + (Number(shippingCost) || 0))

    // Customer association
    const customerId = session?.user?.id || undefined
    const customerEmail = customerInfo.email.trim().toLowerCase()

    // 3. Create the Order in Payload CMS
    const order = await payload.create({
      collection: "orders",
      data: {
        customer: customerId,
        customerEmail: customerEmail,
        shippingAddress: {
          title: shippingAddress.title || "Shipping Address",
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName || "",
          company: customerInfo.company || "",
          phone: customerInfo.phone,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || "",
          city: shippingAddress.city,
          state: shippingAddress.state || "",
          postalCode: shippingAddress.postalCode || "",
          country: shippingAddress.country || "BD",
        },
        items: orderItems,
        amount: totalAmount,
        currency: "BDT",
        status: "processing",
      },
    })

    // 4. Optionally save address for authenticated users in the addresses collection
    if (saveAddress && customerId) {
      try {
        await payload.create({
          collection: "addresses",
          data: {
            customer: customerId,
            title: shippingAddress.title || "Home Address",
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName || "",
            company: customerInfo.company || "",
            phone: customerInfo.phone,
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2 || "",
            city: shippingAddress.city,
            state: shippingAddress.state || "",
            postalCode: shippingAddress.postalCode || "",
            country: (shippingAddress.country as any) || "BD",
          },
        })
      } catch (addrErr) {
        // Non-blocking if address saving fails
        console.warn("Failed to auto-save address:", addrErr)
      }
    }

    // 5. If cartID was provided, clear the cart on server
    if (cartID) {
      try {
        await payload.update({
          collection: "carts",
          id: cartID,
          data: {
            items: [],
            subtotal: 0,
            status: "purchased",
            purchasedAt: new Date().toISOString(),
          },
        })
      } catch (cartErr) {
        console.warn("Failed to mark cart as purchased on server:", cartErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderID: order.id,
      orderNumber: String(order.id).slice(-8).toUpperCase(),
      order,
    })
  } catch (error: any) {
    console.error("POST /api/checkout error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to process checkout. Please try again." },
      { status: 500 }
    )
  }
}
