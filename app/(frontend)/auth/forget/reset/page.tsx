"use client"

import * as React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  ShieldIcon,
} from "lucide-react"
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authClient } from "@/payload/auth/client"
import { toast } from "@/components/ui/toast"
import { StepIndicator } from "@/app/(frontend)/auth/forget/components/step-indicator"
import Link from "next/link"

function ResetContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenFromUrl = searchParams.get("token") || ""

  const [token, setToken] = useState(tokenFromUrl)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!token.trim()) {
      toast.add({
        type: "error",
        title: "Missing Token",
        description: "Reset code or token is required. Please verify your code first.",
      })
      return
    }

    if (password.length < 8) {
      toast.add({
        type: "error",
        title: "Password Too Short",
        description: "Password must be at least 8 characters.",
      })
      return
    }

    if (password !== confirmPassword) {
      toast.add({
        type: "error",
        title: "Passwords Don't Match",
        description: "Your new password and confirmation password do not match.",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token: token.trim(),
      })

      if (result?.error) {
        toast.add({
          type: "error",
          title: "Reset Failed",
          description: result.error.message || "Failed to reset password. The code may be invalid or expired.",
        })
      } else {
        toast.add({
          type: "success",
          title: "Password Updated",
          description: "Your password has been reset successfully.",
        })
        router.push("/auth/forget/success")
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
          <LockIcon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Create New Password</CardTitle>
        <CardDescription>
          Set a new secure password for your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <StepIndicator currentStep={3} />

        <Alert className="mb-4 bg-muted/60 text-foreground">
          <ShieldIcon className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs">
            Your identity has been verified. Create a strong, new password.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!tokenFromUrl && (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="token">Reset Code / Token</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="token"
                    placeholder="Enter reset code"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    disabled={isLoading}
                  />
                </InputGroup>
              </Field>
            </FieldGroup>
          )}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  placeholder="••••••••"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Must be at least 8 characters
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                    aria-label={isConfirmPasswordVisible ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              "Reset Password"
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Card className="w-full p-8 text-center">Loading reset form...</Card>}>
      <ResetContent />
    </Suspense>
  )
}
