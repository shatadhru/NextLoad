"use client"

import React, { useState, useRef, useEffect } from "react"
import { authClient } from "@/payload/auth/client"
import { toast } from "@/components/ui/toast"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import {
  User,
  Mail,
  Shield,
  KeyRound,
  Camera,
  Trash2,
  Copy,
  Check,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Save,
  Clock,
  IdCard,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { logActivity } from "@/lib/activity/activity-service"

export function ProfileSettingsView() {
  const router = useRouter()
  const { data: session, isPending: sessionLoading, refetch } = authClient.useSession()

  // Profile fields state
  const [name, setName] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Avatar state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Copy state
  const [copiedId, setCopiedId] = useState(false)

  // Sign out state
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Synchronize name from session once loaded
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session?.user?.name])

  // Handle Profile Update (Name)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Name cannot be empty.",
        type: "error",
      })
      return
    }

    if (name.trim().length < 2) {
      toast.add({
        title: "Validation Error",
        description: "Name must be at least 2 characters long.",
        type: "error",
      })
      return
    }

    setIsUpdatingProfile(true)
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      })

      if (error) {
        toast.add({
          title: "Update Failed",
          description: error.message || "Failed to update profile name.",
          type: "error",
        })
      } else {
        toast.add({
          title: "Profile Updated",
          description: "Your display name has been successfully updated.",
          type: "success",
        })
        logActivity({
          title: "Display name updated",
          description: `Display name changed to "${name.trim()}".`,
          category: "Account",
          type: "profile_update",
          status: "success",
        })
        if (refetch) await refetch()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      toast.add({
        title: "Error",
        description: message,
        type: "error",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Handle Avatar Upload via Cloudinary
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear input value so same file can be re-selected if desired
    e.target.value = ""

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Invalid File",
        description: "Please select an image file (PNG, JPG, WebP, etc.).",
        type: "error",
      })
      return
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        title: "File Too Large",
        description: "Avatar image must be smaller than 5MB.",
        type: "error",
      })
      return
    }

    setIsUploadingAvatar(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const uploadRes = await fetch("/api/upload/avatar", {
        method: "POST",
        body: uploadFormData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || "Failed to upload image to Cloudinary.")
      }

      // Update Better Auth user with the professional Cloudinary CDN URL
      const { error } = await authClient.updateUser({
        image: uploadData.url,
      })

      if (error) {
        toast.add({
          title: "Avatar Update Failed",
          description: error.message || "Could not update avatar image in profile.",
          type: "error",
        })
      } else {
        toast.add({
          title: "Avatar Updated",
          description: "Your professional profile picture has been uploaded and optimized.",
          type: "success",
        })
        logActivity({
          title: "Avatar updated",
          description: "High-definition profile picture processed and optimized with auto face-detection.",
          category: "Account",
          type: "avatar_update",
          status: "success",
          metadata: { provider: "Cloudinary CDN" },
        })
        if (refetch) await refetch()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to process image."
      toast.add({
        title: "Upload Error",
        description: message,
        type: "error",
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Handle Avatar Removal
  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true)
    try {
      const { error } = await authClient.updateUser({
        image: null as unknown as string,
      })

      if (error) {
        toast.add({
          title: "Removal Failed",
          description: error.message || "Failed to remove avatar.",
          type: "error",
        })
      } else {
        toast.add({
          title: "Avatar Removed",
          description: "Your avatar has been reset to the default initials.",
          type: "success",
        })
        logActivity({
          title: "Avatar removed",
          description: "Profile picture reset to default initials.",
          category: "Account",
          type: "avatar_update",
          status: "info",
        })
        if (refetch) await refetch()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to remove avatar."
      toast.add({
        title: "Error",
        description: message,
        type: "error",
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.add({
        title: "Validation Error",
        description: "Please enter your current password.",
        type: "error",
      })
      return
    }

    if (newPassword.length < 8) {
      toast.add({
        title: "Validation Error",
        description: "New password must be at least 8 characters long.",
        type: "error",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast.add({
        title: "Validation Error",
        description: "New password and confirmation do not match.",
        type: "error",
      })
      return
    }

    setIsUpdatingPassword(true)
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      })

      if (error) {
        toast.add({
          title: "Password Change Failed",
          description: error.message || "Could not change password. Please verify your current password.",
          type: "error",
        })
      } else {
        toast.add({
          title: "Password Updated",
          description: "Your password has been changed successfully.",
          type: "success",
        })
        logActivity({
          title: "Password changed successfully",
          description: "Account security credentials updated via Profile.",
          category: "Security",
          type: "password_change",
          status: "success",
        })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      toast.add({
        title: "Error",
        description: message,
        type: "error",
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  // Copy User ID
  const handleCopyId = () => {
    if (session?.user?.id) {
      navigator.clipboard.writeText(session.user.id)
      setCopiedId(true)
      toast.add({
        title: "Copied",
        description: "User ID copied to clipboard.",
        type: "success",
      })
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  // Sign out
  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await authClient.signOut()
      toast.add({
        title: "Signed Out",
        description: "You have been safely signed out.",
        type: "success",
      })
      router.push("/auth/login")
    } catch {
      toast.add({
        title: "Sign Out Failed",
        description: "Could not sign out. Please try again.",
        type: "error",
      })
      setIsSigningOut(false)
    }
  }

  // Loading state
  if (sessionLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="size-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = session?.user
  const userRole = (user as { role?: string } | undefined)?.role || "user"
  const isEmailVerified = user?.emailVerified ?? false
  const userInitials = (user?.name || user?.email || "U")
    .slice(0, 2)
    .toUpperCase()

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const isNameChanged = name.trim() !== (user?.name || "")

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile & Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details, avatar, and security credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}>
                <Avatar className="size-20 border-2 border-primary/20 shadow-md ring-2 ring-primary/10 transition-transform group-hover:scale-105">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "User Avatar"} className="object-cover" />
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs text-white">
                  <Camera className="size-5" />
                  <span className="text-[10px] font-medium mt-0.5">Change</span>
                </div>

                {/* Uploading Spinner */}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-background/80 rounded-full flex flex-col items-center justify-center backdrop-blur-xs z-10">
                    <Spinner className="size-6 text-primary" />
                    <span className="text-[9px] font-semibold text-primary mt-1">Uploading...</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold">{user?.name || "Unnamed User"}</h2>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      userRole === "admin"
                        ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                        : "bg-muted text-muted-foreground border"
                    }`}
                  >
                    {userRole === "admin" ? "Admin" : "User"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                      isEmailVerified
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {isEmailVerified ? (
                      <>
                        <ShieldCheck className="size-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="size-3" />
                        Unverified
                      </>
                    )}
                  </span>
                  {user?.image && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                      <Sparkles className="size-3" />
                      HD Avatar
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Avatar action buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial shadow-xs"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="size-3.5 mr-1.5" />
                Change Picture
              </Button>

              {user?.image && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={isUploadingAvatar}
                  onClick={handleRemoveAvatar}
                  title="Remove avatar"
                >
                  <Trash2 className="size-3.5 mr-1.5" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information (Editable) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="size-4 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your public display name. Email and system role are managed by security policies.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name (Editable) */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  disabled={isUpdatingProfile}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Visible to other members across your workspace.
                </p>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email Address</Label>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="size-3 text-muted-foreground" />
                    Read-only
                  </span>
                </div>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted/50 cursor-not-allowed text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Primary identifier for sign-in and security notifications.
                </p>
              </div>
            </div>

            {/* Role & Workspace Info */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="space-y-1.5">
                <Label>System Role</Label>
                <div className="flex items-center h-9 px-3 rounded-md border bg-muted/40 text-sm text-muted-foreground">
                  <span className="capitalize font-medium text-foreground mr-2">{userRole}</span>
                  <span className="text-xs text-muted-foreground">
                    ({userRole === "admin" ? "Full administrative access" : "Standard user permissions"})
                  </span>
                </div>
              </div>

              {formattedDate && (
                <div className="space-y-1.5">
                  <Label>Member Since</Label>
                  <div className="flex items-center gap-2 h-9 px-3 rounded-md border bg-muted/40 text-sm text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-4 bg-muted/20">
            <Button
              type="submit"
              size="sm"
              disabled={isUpdatingProfile || !isNameChanged || !name.trim()}
            >
              {isUpdatingProfile ? (
                <>
                  <Spinner className="size-3.5 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-3.5 mr-1.5" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Security & Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            Security & Password
          </CardTitle>
          <CardDescription>
            Change your account password to maintain security. Minimum 8 characters required.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  disabled={isUpdatingPassword}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    disabled={isUpdatingPassword}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  disabled={isUpdatingPassword}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="revoke-sessions" className="text-sm cursor-pointer">
                  Revoke other active sessions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Sign out from all other browsers and mobile devices upon password update.
                </p>
              </div>
              <Switch
                id="revoke-sessions"
                checked={revokeOtherSessions}
                onCheckedChange={setRevokeOtherSessions}
                disabled={isUpdatingPassword}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-4 bg-muted/20">
            <Button
              type="submit"
              size="sm"
              disabled={
                isUpdatingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword.length < 8
              }
            >
              {isUpdatingPassword ? (
                <>
                  <Spinner className="size-3.5 mr-2" />
                  Updating Password...
                </>
              ) : (
                <>
                  <KeyRound className="size-3.5 mr-1.5" />
                  Update Password
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Account Details & Danger Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IdCard className="size-4 text-primary" />
            Account Information
          </CardTitle>
          <CardDescription>
            System identifiers and session status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border bg-muted/30">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-muted-foreground">User ID</span>
              <p className="text-xs font-mono text-foreground break-all">{user?.id || "N/A"}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 h-8 text-xs"
              onClick={handleCopyId}
            >
              {copiedId ? (
                <>
                  <Check className="size-3 mr-1 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3 mr-1" />
                  Copy ID
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Active Session</p>
              <p className="text-xs text-muted-foreground">
                Currently signed in via Better Auth session.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isSigningOut}
              onClick={handleSignOut}
            >
              {isSigningOut ? (
                <>
                  <Spinner className="size-3.5 mr-2" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="size-3.5 mr-1.5" />
                  Sign Out
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileSettingsView
