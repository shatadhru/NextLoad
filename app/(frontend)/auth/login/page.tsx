"use client"

import { LoginForm } from "@/app/(frontend)/auth/login/login-form"
import { Logo } from "@/components/ui/Logo"
import { AuthTopNav } from "@/components/auth/AuthTopNav"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <AuthTopNav />
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo href="/" size="lg" className="flex items-center" align="center" />
        <LoginForm />
      </div>
    </div>
  )
}
