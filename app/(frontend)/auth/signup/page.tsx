"use client"

import { SignUpForm } from "@/app/(frontend)/auth/signup/signup-form"
import { Logo } from "@/components/ui/Logo"

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo href="/" size="lg" className="self-center" />
        <SignUpForm />
      </div>
    </div>
  )
}
