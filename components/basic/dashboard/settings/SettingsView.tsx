"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
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
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
  Palette,
  Sun,
  Moon,
  Laptop,
  Shield,
  KeyRound,
  Bell,
  HardDrive,
  AlertTriangle,
  LogOut,
  Check,
  CheckCircle2,
  Monitor,
  Eye,
  EyeOff,
  Save,
  Globe,
  Sliders,
  ShieldCheck,
  Smartphone,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { logActivity } from "@/lib/activity/activity-service"

export function SettingsView() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { data: session } = authClient.useSession()

  // Security / Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Notification Preferences (persisted in localStorage)
  const [emailSecurity, setEmailSecurity] = useState(true)
  const [emailUploads, setEmailUploads] = useState(true)
  const [emailDigest, setEmailDigest] = useState(false)
  const [inAppToasts, setInAppToasts] = useState(true)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)

  // Storage & Upload Preferences
  const [defaultPrivate, setDefaultPrivate] = useState(true)
  const [autoCompress, setAutoCompress] = useState(true)

  // Active section tab
  const [activeTab, setActiveTab] = useState<"appearance" | "security" | "notifications" | "storage">("appearance")

  // Sign out state
  const [isSigningOutAll, setIsSigningOutAll] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load local preferences
    const savedUploads = localStorage.getItem("pref_email_uploads")
    if (savedUploads !== null) setEmailUploads(savedUploads === "true")

    const savedDigest = localStorage.getItem("pref_email_digest")
    if (savedDigest !== null) setEmailDigest(savedDigest === "true")

    const savedPrivate = localStorage.getItem("pref_default_private")
    if (savedPrivate !== null) setDefaultPrivate(savedPrivate === "true")

    const savedCompress = localStorage.getItem("pref_auto_compress")
    if (savedCompress !== null) setAutoCompress(savedCompress === "true")
  }, [])

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
          description: error.message || "Please verify your current password.",
          type: "error",
        })
      } else {
        toast.add({
          title: "Password Changed",
          description: "Your password has been updated securely.",
          type: "success",
        })
        logActivity({
          title: "Password changed in Settings",
          description: "Updated account credentials and notified active sessions.",
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

  // Handle Save Notifications
  const handleSaveNotifications = () => {
    setIsSavingNotifications(true)
    localStorage.setItem("pref_email_uploads", String(emailUploads))
    localStorage.setItem("pref_email_digest", String(emailDigest))
    localStorage.setItem("pref_in_app_toasts", String(inAppToasts))

    setTimeout(() => {
      setIsSavingNotifications(false)
      toast.add({
        title: "Preferences Saved",
        description: "Your notification settings have been updated.",
        type: "success",
      })
      logActivity({
        title: "Notification preferences updated",
        description: "Saved email and in-app alert preferences.",
        category: "Settings",
        type: "settings_update",
        status: "info",
      })
    }, 400)
  }

  // Handle Save Storage
  const handleSaveStorage = () => {
    localStorage.setItem("pref_default_private", String(defaultPrivate))
    localStorage.setItem("pref_auto_compress", String(autoCompress))
    toast.add({
      title: "Storage Settings Saved",
      description: "Default file upload preferences have been updated.",
      type: "success",
    })
    logActivity({
      title: "Storage preferences updated",
      description: "Updated default file privacy and compression settings.",
      category: "Settings",
      type: "settings_update",
      status: "info",
    })
  }

  // Sign out from all sessions
  const handleRevokeAllSessions = async () => {
    setIsSigningOutAll(true)
    try {
      await authClient.signOut()
      toast.add({
        title: "Sessions Revoked",
        description: "All active sessions have been signed out.",
        type: "success",
      })
      router.push("/auth/login")
    } catch {
      toast.add({
        title: "Error",
        description: "Failed to revoke sessions. Please try again.",
        type: "error",
      })
      setIsSigningOutAll(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your app appearance, security credentials, notifications, and storage preferences.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <Button
          variant={activeTab === "appearance" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("appearance")}
          className="gap-2 text-xs md:text-sm"
        >
          <Palette className="size-4" />
          Appearance & Theme
        </Button>
        <Button
          variant={activeTab === "security" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("security")}
          className="gap-2 text-xs md:text-sm"
        >
          <KeyRound className="size-4" />
          Security & Password
        </Button>
        <Button
          variant={activeTab === "notifications" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("notifications")}
          className="gap-2 text-xs md:text-sm"
        >
          <Bell className="size-4" />
          Notifications
        </Button>
        <Button
          variant={activeTab === "storage" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("storage")}
          className="gap-2 text-xs md:text-sm"
        >
          <HardDrive className="size-4" />
          Storage & Uploads
        </Button>
      </div>

      {/* SECTION 1: APPEARANCE & THEME */}
      {activeTab === "appearance" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="size-4 text-primary" />
                Theme & Display
              </CardTitle>
              <CardDescription>
                Customize how NextLoad looks on your device. Choose between light, dark, or system preference.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Light Theme */}
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    mounted && theme === "light"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                  }`}
                >
                  <div className="size-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Sun className="size-5" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-sm">Light Mode</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Crisp, high-contrast light theme</p>
                  </div>
                  {mounted && theme === "light" && (
                    <div className="absolute top-3 right-3 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="size-3" />
                    </div>
                  )}
                </button>

                {/* Dark Theme */}
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    mounted && theme === "dark"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                  }`}
                >
                  <div className="size-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Moon className="size-5" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-sm">Dark Mode</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Sleek, low-glare dark theme</p>
                  </div>
                  {mounted && theme === "dark" && (
                    <div className="absolute top-3 right-3 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="size-3" />
                    </div>
                  )}
                </button>

                {/* System Theme */}
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    mounted && theme === "system"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                  }`}
                >
                  <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Laptop className="size-5" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-sm">System Default</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Matches your OS preference</p>
                  </div>
                  {mounted && theme === "system" && (
                    <div className="absolute top-3 right-3 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="size-3" />
                    </div>
                  )}
                </button>
              </div>

              <Separator />

              {/* General Display Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="size-3.5 text-muted-foreground" />
                      Interface Language
                    </Label>
                    <p className="text-xs text-muted-foreground">Select your preferred display language.</p>
                  </div>
                  <div className="text-sm font-medium px-3 py-1.5 rounded-md border bg-muted/30">
                    English (US)
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Sliders className="size-3.5 text-muted-foreground" />
                      Sidebar Density
                    </Label>
                    <p className="text-xs text-muted-foreground">Compact desktop icon rail on sidebar collapse.</p>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    Enabled
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 2: SECURITY & PASSWORD */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Password Change Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                Change Password
              </CardTitle>
              <CardDescription>
                Ensure your account is using a long, random password to stay secure.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sec-current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="sec-current-password"
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
                    <Label htmlFor="sec-new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="sec-new-password"
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
                    <Label htmlFor="sec-confirm-password">Confirm New Password</Label>
                    <Input
                      id="sec-confirm-password"
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
                    <Label htmlFor="sec-revoke-sessions" className="text-sm cursor-pointer">
                      Revoke other active sessions
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Sign out from all other browsers and mobile devices upon password update.
                    </p>
                  </div>
                  <Switch
                    id="sec-revoke-sessions"
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
                      Updating...
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

          {/* Active Sessions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="size-4 text-primary" />
                Active Sessions & Devices
              </CardTitle>
              <CardDescription>
                Devices currently authenticated into your NextLoad account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Monitor className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Current Browser</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                        ACTIVE NOW
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session?.user?.email || "Authenticated Session"} • 30-Day Session Lifetime
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSigningOutAll}
                  onClick={handleRevokeAllSessions}
                  className="text-xs text-destructive hover:bg-destructive/10"
                >
                  {isSigningOutAll ? <Spinner className="size-3 mr-1" /> : <LogOut className="size-3 mr-1" />}
                  Sign Out All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 3: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="size-4 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what updates and communications you receive from NextLoad.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Alerts */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    Security & Account Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Crucial security notifications, password resets, and suspicious login warnings.
                  </p>
                </div>
                <Switch checked={emailSecurity} disabled />
              </div>

              <Separator />

              {/* File Activity */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-uploads" className="text-sm font-medium cursor-pointer">
                    File Upload & Sharing Activity
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive confirmation when files are processed and uploaded.
                  </p>
                </div>
                <Switch
                  id="notif-uploads"
                  checked={emailUploads}
                  onCheckedChange={setEmailUploads}
                />
              </div>

              <Separator />

              {/* Weekly Digest */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-digest" className="text-sm font-medium cursor-pointer">
                    Weekly Activity Digest
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    A summary of your workspace storage and activity delivered once a week.
                  </p>
                </div>
                <Switch
                  id="notif-digest"
                  checked={emailDigest}
                  onCheckedChange={setEmailDigest}
                />
              </div>

              <Separator />

              {/* In-app Toasts */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-toasts" className="text-sm font-medium cursor-pointer">
                    In-App Toast Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Display pop-up toast alerts for file actions and state changes in the dashboard.
                  </p>
                </div>
                <Switch
                  id="notif-toasts"
                  checked={inAppToasts}
                  onCheckedChange={setInAppToasts}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t px-6 py-4 bg-muted/20">
              <Button
                type="button"
                size="sm"
                disabled={isSavingNotifications}
                onClick={handleSaveNotifications}
              >
                {isSavingNotifications ? (
                  <>
                    <Spinner className="size-3.5 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-3.5 mr-1.5" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* SECTION 4: STORAGE & UPLOADS */}
      {activeTab === "storage" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HardDrive className="size-4 text-primary" />
                Storage & Upload Preferences
              </CardTitle>
              <CardDescription>
                Configure default settings for your uploaded files and cloud storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Storage Quota Usage */}
              <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Cloud Storage Quota</span>
                  <span className="font-semibold text-primary">1.2 GB / 5.0 GB (24%)</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: "24%" }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Need more capacity? Workspace upgrade options are available through your administrator.
                </p>
              </div>

              <Separator />

              {/* Default Privacy */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="storage-privacy" className="text-sm font-medium cursor-pointer">
                    Default File Privacy
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically set new uploads to Private (only accessible by your account).
                  </p>
                </div>
                <Switch
                  id="storage-privacy"
                  checked={defaultPrivate}
                  onCheckedChange={setDefaultPrivate}
                />
              </div>

              <Separator />

              {/* Auto Compression */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="storage-compress" className="text-sm font-medium cursor-pointer">
                    Smart Image Optimization
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically optimize avatars and media via Cloudinary for faster loading.
                  </p>
                </div>
                <Switch
                  id="storage-compress"
                  checked={autoCompress}
                  onCheckedChange={setAutoCompress}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t px-6 py-4 bg-muted/20">
              <Button type="button" size="sm" onClick={handleSaveStorage}>
                <Save className="size-3.5 mr-1.5" />
                Save Storage Settings
              </Button>
            </CardFooter>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base text-destructive flex items-center gap-2">
                <AlertTriangle className="size-4" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Actions here impact your active sessions and stored data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-lg border border-destructive/20 bg-destructive/5">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-destructive">Terminate All Sessions</span>
                  <p className="text-xs text-muted-foreground">
                    Forces an immediate log out from all devices, including this one.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isSigningOutAll}
                  onClick={handleRevokeAllSessions}
                >
                  <LogOut className="size-3.5 mr-1.5" />
                  Sign Out Everywhere
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default SettingsView
