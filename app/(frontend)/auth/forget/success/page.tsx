"use client"

import * as React from "react"
import { CheckCircle2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StepIndicator } from "@/app/(frontend)/auth/forget/components/step-indicator"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/50">
          <CheckCircle2Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl">Password Updated</CardTitle>
        <CardDescription>
          Your password has been reset successfully
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <StepIndicator currentStep={4} />

        <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Your account credentials have been updated. You can now sign in using your new password.
          </p>
        </div>

        <Link href="/auth/login" className="block w-full">
          <Button className="w-full">
            Sign in with new password
          </Button>
        </Link>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Need help?{" "}
          <a href="#" className="text-primary underline underline-offset-4 hover:opacity-80">
            Contact support
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
