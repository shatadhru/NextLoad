"use client"

import { authClient } from "@/payload/auth/client"
import { useRouter } from "next/navigation"
import React, { ReactNode } from "react"
import { Spinner } from "@/components/ui/spinner"
import { SiteConfig } from "@/config/site"
import { GalleryVerticalEndIcon } from "lucide-react"
import Link from "next/link"

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
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium hover:opacity-80 transition-opacity"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          {SiteConfig.site.name}
        </Link>
        {children}
      </div>
    </div>
  )
}
