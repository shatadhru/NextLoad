"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { MailWarningIcon, XIcon, ArrowRightIcon, RefreshCwIcon, CheckCircle2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/payload/auth/client"
import { toast } from "@/components/ui/toast"

interface EmailVerificationBannerProps {
  className?: string
}

export function EmailVerificationBanner({ className }: EmailVerificationBannerProps) {
  const { data: session, isPending } = authClient.useSession()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Persist dismissal during current browser session
  useEffect(() => {
    try {
      if (sessionStorage.getItem("hide_verification_banner") === "true") {
        setIsDismissed(true)
      }
    } catch {
      // sessionStorage might not be accessible in all contexts
    }
  }, [])

  const user = session?.user as
    | { emailVerified?: boolean | null; email?: string; name?: string }
    | undefined

  // Don't render while session is loading, if dismissed, if not logged in, or if already verified
  if (isPending || isDismissed || !user || user.emailVerified) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    try {
      sessionStorage.setItem("hide_verification_banner", "true")
    } catch {
      // ignore
    }
  }

  const handleResendVerification = async () => {
    if (!user?.email || isSendingEmail || emailSent) return
    setIsSendingEmail(true)
    try {
      const res = await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: "/dashboard",
      })

      if (res?.error) {
        toast.add({
          title: "Failed to send email",
          description: res.error.message || "Could not send verification email. Please try again.",
          type: "error",
        })
      } else {
        setEmailSent(true)
        toast.add({
          title: "Verification email sent",
          description: `A verification link has been sent to ${user.email}. Please check your inbox or spam folder.`,
          type: "success",
        })
      }
    } catch (err: any) {
      console.warn("Failed to resend verification email:", err)
      toast.add({
        title: "Error",
        description: err?.message || "Failed to send verification email.",
        type: "error",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "relative flex items-center gap-3 px-4 py-2.5 shrink-0 transition-colors",
        "bg-amber-500/10 dark:bg-amber-950/40",
        "border-b border-amber-500/20 dark:border-amber-800/60",
        className
      )}
    >
      {/* Left accent indicator */}
      <div className="absolute inset-y-0 left-0 w-1 bg-amber-500 rounded-r-xs" />

      {/* Warning Icon Badge */}
      <div className="ml-1 shrink-0 flex items-center justify-center size-7 rounded-full bg-amber-500/15 dark:bg-amber-900/50 border border-amber-500/30">
        <MailWarningIcon className="size-3.5 text-amber-600 dark:text-amber-400" />
      </div>

      {/* Message & Details */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 leading-snug">
            Your email address is unverified.
            <span className="font-normal text-amber-700/90 dark:text-amber-300/80 ml-1.5 hidden md:inline">
              Please verify your account ({user.email}) to unlock all features and ensure secure access.
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {emailSent ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2Icon className="size-3" />
              Email sent! Check inbox
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isSendingEmail}
              className={cn(
                "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer",
                "bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-100",
                "border border-amber-500/30 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
              )}
            >
              {isSendingEmail ? (
                <>
                  <RefreshCwIcon className="size-3 animate-spin" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <RefreshCwIcon className="size-3" />
                  <span>Resend verification</span>
                </>
              )}
            </button>
          )}

          <Link
            href="/dashboard/profile"
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded",
              "text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100",
              "hover:bg-amber-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            )}
          >
            <span>Profile</span>
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss verification banner"
        className={cn(
          "shrink-0 p-1 rounded-md transition-colors cursor-pointer",
          "text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-100",
          "hover:bg-amber-500/15",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
        )}
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  )
}

export default EmailVerificationBanner
