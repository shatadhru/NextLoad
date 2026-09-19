"use client"

import * as React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRightIcon, KeyIcon, Loader2Icon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/payload/auth/client"
import { toast } from "@/components/ui/toast"
import { StepIndicator } from "@/app/(frontend)/auth/forget/components/step-indicator"
import Link from "next/link"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [token, setToken] = useState("")
  const [isResending, setIsResending] = useState(false)

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token.trim()) {
      toast.add({
        type: "error",
        title: "Code Required",
        description: "Please enter the verification code sent to your email.",
      })
      return
    }

    router.push(
      `/auth/forget/reset?token=${encodeURIComponent(token.trim())}&email=${encodeURIComponent(email)}`
    )
  }

  const handleResend = async () => {
    if (!email) {
      toast.add({
        type: "error",
        title: "Email Missing",
        description: "Please go back and enter your email address.",
      })
      return
    }

    setIsResending(true)
    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/forget/reset`,
      })

      if (result?.error) {
        toast.add({
          type: "error",
          title: "Resend Failed",
          description: result.error.message || "Failed to resend reset code.",
        })
      } else {
        toast.add({
          type: "success",
          title: "Code Resent",
          description: `A new reset code has been sent to ${email}`,
        })
      }
    } catch (err: any) {
      console.error(err)
      toast.add({
        type: "error",
        title: "Error",
        description: err?.message || "Failed to resend reset code.",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <KeyIcon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Verify Reset Code</CardTitle>
        <CardDescription>
          {email ? (
            <>
              Enter the reset code sent to <span className="font-semibold text-foreground">{email}</span>
            </>
          ) : (
            "Enter the reset code from your email to continue"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <StepIndicator currentStep={2} />

        <form onSubmit={handleVerify} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="token">Reset Code</FieldLabel>
              <Input
                id="token"
                placeholder="Enter reset code"
                required
                className="text-center font-mono text-lg tracking-widest uppercase"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <FieldDescription>
                Check your email inbox or spam folder for the code
              </FieldDescription>
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full">
            Continue to Reset <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>

          {email && (
            <div className="text-center pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={isResending}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {isResending ? (
                  <>
                    <Loader2Icon className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Resending code...
                  </>
                ) : (
                  <>
                    <RefreshCwIcon className="mr-1.5 h-3.5 w-3.5" />
                    Didn&apos;t receive code? Resend
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Wrong email address?{" "}
          <Link
            href="/auth/forget"
            className="text-primary underline underline-offset-4 hover:opacity-80"
          >
            Change email
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<Card className="w-full p-8 text-center">Loading verification...</Card>}>
      <VerifyContent />
    </Suspense>
  )
}
