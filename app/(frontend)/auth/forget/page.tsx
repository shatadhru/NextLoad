"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, Loader2Icon, MailIcon } from "lucide-react"
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

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/forget/reset`,
      })

      if (result?.error) {
        toast.add({
          type: "error",
          title: "Request Failed",
          description: result.error.message || "Failed to send reset code. Please try again.",
        })
      } else {
        toast.add({
          type: "success",
          title: "Code Sent",
          description: "If an account exists with this email, a reset code was sent.",
        })
        router.push(`/auth/forget/verify?email=${encodeURIComponent(email)}`)
      }
    } catch (err: any) {
      console.error(err)
      toast.add({
        type: "error",
        title: "Error",
        description: err?.message || "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <MailIcon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a verification code
        </CardDescription>
      </CardHeader>

      <CardContent>
        <StepIndicator currentStep={1} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <FieldDescription>
                We will send a reset code to this email if it is registered
              </FieldDescription>
            </Field>
          </FieldGroup>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              <>
                Send Reset Code <ArrowRightIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-primary underline underline-offset-4 hover:opacity-80"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
