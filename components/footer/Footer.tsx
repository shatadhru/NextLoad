'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { footerConfig } from '@/config/footer'
import { NewsletterForm } from './NewsletterForm'
import { PaymentIcons } from './PaymentIcons'
import { SiteConfig } from '@/config/site'
import { ShieldCheck, Heart } from 'lucide-react'

export interface FooterProps {
  className?: string
}

import { SocialIcons } from '@/components/footer/SocialIcons'

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear().toString()
  const defaultCopyright = `© ${currentYear} ${SiteConfig.site.name}. All rights reserved.`
  const defaultTagline = SiteConfig.site.description || 'Enterprise-grade full-stack web application platform with Next.js 16 and Payload CMS.'

  const [copyright, setCopyright] = useState(defaultCopyright)
  const [tagline, setTagline] = useState(defaultTagline)
  const [socialLinks, setSocialLinks] = useState(footerConfig.socials)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentSettings, setPaymentSettings] = useState<{
    showPaymentMethods?: boolean
    enabledMethods?: string[]
    customMethods?: any[]
  }>({
    showPaymentMethods: true,
    enabledMethods: ['visa', 'mastercard', 'amex', 'paypal'],
    customMethods: [],
  })

  useEffect(() => {
    let isMounted = true
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted || !data) return
        if (data.copyright) {
          setCopyright(data.copyright.replace('{year}', currentYear))
        }
        if (data.footerTagline) {
          setTagline(data.footerTagline)
        }
        if (data.socialLinks && Array.isArray(data.socialLinks)) {
          setSocialLinks(data.socialLinks)
        }
        if (data.paymentMethods) {
          setPaymentSettings({
            showPaymentMethods: data.paymentMethods.showPaymentMethods !== false,
            enabledMethods: Array.isArray(data.paymentMethods.enabledMethods)
              ? data.paymentMethods.enabledMethods
              : ['visa', 'mastercard', 'amex', 'paypal'],
            customMethods: Array.isArray(data.paymentMethods.customMethods)
              ? data.paymentMethods.customMethods
              : [],
          })
        }
      })
      .catch(() => {
        // Silently use defaults
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [currentYear])

  return (
    <footer className={`border-t bg-muted/20 text-muted-foreground text-xs relative overflow-hidden ${className}`}>
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-12">
        {/* Main Grid: Brand & Newsletter + Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <Logo href="/" size="md" />
             
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              {tagline}
            </p>

            {/* Newsletter Subscription Box */}
            <div className="pt-2 max-w-sm space-y-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Stay in the loop
              </span>
              <NewsletterForm />
            </div>
          </div>

          {/* Navigation Menu Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {footerConfig.columns.map((column, colIdx) => (
              <div key={colIdx} className="space-y-3.5">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  {column.title}
                </h4>
                <ul className="space-y-2.5">
                  {column.items.map((item, itemIdx) => {
                    const IconComponent = item.icon
                    return (
                      <li key={itemIdx}>
                        <Link
                          href={item.href}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noopener noreferrer' : undefined}
                          className="group inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {IconComponent && (
                            <IconComponent className="size-3.5 text-muted-foreground/70 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors shrink-0" />
                          )}
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-teal-500/10 text-teal-600 border border-teal-500/20">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider with Payment Badges & Social Links */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Payment Badges (Controlled from Admin) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-teal-600 dark:text-teal-400" />
              <span>Supported Payments:</span>
            </span>
            <PaymentIcons
              enabledMethods={paymentSettings.enabledMethods}
              customMethods={paymentSettings.customMethods}
              showPayments={paymentSettings.showPaymentMethods}
            />
          </div>

          {/* Social Links with react-social-icons and shimmer effect */}
          <SocialIcons
            socialLinks={socialLinks}
            isLoading={isLoading}
            iconSize={30}
          />
        </div>

        {/* Bottom Bar: Copyright Text & Security */}
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <p>{copyright}</p>
          <div className="flex items-center gap-4">
            <Link href="/auth/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/auth/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              Built with <Heart className="size-3 text-rose-500 fill-rose-500" /> NextLoad by Scalvio
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
