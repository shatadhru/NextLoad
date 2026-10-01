'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import { PaymentIcon } from 'react-svg-credit-card-payment-icons'
import { CreditCard, Smartphone, Monitor } from 'lucide-react'

export function PaymentMethodsPreview() {
  const formState = useFormFields(([fields]) => {
    const showPayments = fields?.['paymentMethods.showPaymentMethods']?.value !== false

    const rawEnabled = fields?.['paymentMethods.enabledMethods']?.value
    const selectedMethods = Array.isArray(rawEnabled)
      ? (rawEnabled as string[])
      : ['visa', 'mastercard', 'amex', 'paypal']

    const rawCustom = fields?.['paymentMethods.customMethods']?.value
    let customMethods: Array<{ name?: string }> = []

    if (Array.isArray(rawCustom)) {
      customMethods = rawCustom
    } else if (typeof rawCustom === 'number' && rawCustom > 0) {
      for (let i = 0; i < rawCustom; i++) {
        const nameVal = fields?.[`paymentMethods.customMethods.${i}.name`]?.value as string | undefined
        customMethods.push({ name: nameVal || `Custom Method ${i + 1}` })
      }
    }

    return {
      showPayments,
      selectedMethods,
      customMethods,
    }
  })

  const showPayments = formState?.showPayments !== false
  const selectedMethods = Array.isArray(formState?.selectedMethods)
    ? formState.selectedMethods
    : ['visa', 'mastercard', 'amex', 'paypal']
  const customMethods = Array.isArray(formState?.customMethods)
    ? formState.customMethods
    : []

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

  return (
    <div className="my-3 rounded-lg border border-border/80 bg-background/80 p-3 shadow-xs">
      <div className="flex items-center justify-between mb-2.5 border-b pb-2">
        <div className="flex items-center gap-2">
          <CreditCard className="size-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Live Payment Badges Preview
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {showPayments ? 'Enabled on Footer' : 'Hidden on Footer'}
        </span>
      </div>

      {showPayments ? (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedMethods.map((methodKey) => {
              const iconType = methodTypeMap[methodKey] || 'Generic'
              return (
                <div
                  key={methodKey}
                  className="rounded-md border border-border/60 bg-muted/30 p-1 flex items-center justify-center transition-all hover:scale-105 shadow-2xs"
                  title={iconType}
                >
                  <PaymentIcon type={iconType as any} format="flatRounded" width={38} />
                </div>
              )
            })}

            {customMethods.map((cm, idx) => (
              <div
                key={idx}
                className="h-6 px-2 rounded-md border border-dashed border-primary/40 bg-primary/5 text-[10px] font-semibold text-primary flex items-center justify-center"
              >
                {cm.name || 'Custom Card'}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            SVG vector icons rendered crisply across mobile and retina screens.
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic py-2">
          Payment badges are currently disabled in footer settings.
        </p>
      )}
    </div>
  )
}

export default PaymentMethodsPreview
