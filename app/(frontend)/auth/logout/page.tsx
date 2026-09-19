"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/payload/auth/client"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await authClient.signOut()
        toast.add({
          type: "success",
          title: "Logged out",
          description: "You have been logged out successfully",
        })
      } catch (error: any) {
        console.error("Logout error:", error)
        toast.add({
          type: "error",
          title: "Logout Error",
          description: error?.message || "Failed to log out cleanly",
        })
      } finally {
        router.push("/auth/login")
        router.refresh()
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-muted p-6">
      <Spinner />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Logging out...
      </p>
    </div>
  )
}
