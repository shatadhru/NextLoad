'use client'

import React from 'react'
import Image from 'next/image'
import { PaymentIcon } from 'react-svg-credit-card-payment-icons'

interface PaymentIconsProps {
  enabledMethods?: string[]
  customMethods?: Array<{
    name?: string
    icon?: any
  }>
  showPayments?: boolean
}

const methodTypeMap: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'AmericanExpress',
  paypal: 'PayPal',
  discover: 'Discover',
  jcb: 'JCB',
  unionpay: 'UnionPay',
  maestro: 'Maestro',
  diners: 'DinersClub',
  alipay: 'Alipay',
}

export function PaymentIcons({
  enabledMethods = ['visa', 'mastercard', 'amex', 'paypal'],
  customMethods = [],
  showPayments = true,
}: PaymentIconsProps) {
  if (!showPayments) return null

  const safeMethods = Array.isArray(enabledMethods) ? enabledMethods : ['visa', 'mastercard', 'amex', 'paypal']
  const safeCustom = Array.isArray(customMethods) ? customMethods : []

  return (
    <div className="flex items-center gap-2 flex-wrap" aria-label="Accepted Payment Methods">
      {safeMethods.map((key) => {
        const iconType = methodTypeMap[key] || 'Generic'
        return (
          <div
            key={key}
            className="flex items-center justify-center rounded-md border border-border/60 bg-background/80 p-0.5 shadow-2xs hover:scale-105 transition-transform"
            title={iconType}
          >
            <PaymentIcon type={iconType as any} format="flatRounded" width={34} />
          </div>
        )
      })}

      {safeCustom.map((cm, idx) => {
        const iconUrl =
          typeof cm.icon === 'object' && cm.icon
            ? cm.icon.cloudinary?.secure_url || cm.icon.url
            : null

        if (iconUrl) {
          return (
            <div
              key={idx}
              className="relative h-6 w-9 shrink-0 overflow-hidden rounded-md border border-border/60 bg-background/80 shadow-2xs hover:scale-105 transition-transform"
              title={cm.name || 'Payment Method'}
            >
              <Image
                src={iconUrl}
                alt={cm.name || 'Payment badge'}
                fill
                className="object-contain p-0.5"
                sizes="36px"
              />
            </div>
          )
        }

        return (
          <div
            key={idx}
            className="h-6 px-1.5 rounded-md border border-border/60 bg-background/80 text-[10px] font-semibold text-muted-foreground flex items-center justify-center shadow-2xs"
          >
            {cm.name || 'Payment'}
          </div>
        )
      })}
    </div>
  )
}

export default PaymentIcons
