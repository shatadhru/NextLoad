"use client"

import { authClient } from "@/payload/auth/client"
import { useRouter } from "next/navigation"
import React, { ReactNode } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Logo } from "@/components/ui/Logo"

export default function ForgetLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (session) {
    router.push("/")
    return null
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Logo href="/" size="lg" className="self-center" />
        {children}
      </div>
    </div>
  )
}
