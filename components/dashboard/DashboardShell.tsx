"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { sidebarConfig, type Workspace } from "@/config/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ExternalLinkIcon,
  DatabaseIcon,
  LifeBuoyIcon,
  BellIcon,
  CheckCheckIcon,
  SparklesIcon,
  ShieldAlertIcon,
  AlertTriangleIcon,
  InfoIcon,
  XIcon,
} from "lucide-react"
import { authClient } from "@/payload/auth/client"
import { Logo } from "@/components/ui/Logo"
import { EmailVerificationBanner } from "./EmailVerificationBanner"

interface UserNotification {
  id: string
  title: string
  message: string
  priority: "info" | "announcement" | "security" | "urgent"
  actionUrl?: string
  actionText?: string
  imageUrl?: string
  sentAt: string
  isRead: boolean
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [workspace, setWorkspace] = useState<Workspace>(sidebarConfig.workspaces[0])
  const { data: session } = authClient.useSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin"

  // Notification State
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false)
  const notifDropdownRef = useRef<HTMLDivElement>(null)

  const userEmail = session?.user?.email || ""
  const userRole = (session?.user as { role?: string } | undefined)?.role || "user"

  // Fetch notifications for the user
  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifs(true)
      const url = userEmail
        ? `/api/user/notifications?email=${encodeURIComponent(userEmail)}&role=${encodeURIComponent(userRole)}`
        : "/api/user/notifications"
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        if (data.notifications) setNotifications(data.notifications)
        if (typeof data.unreadCount === "number") setUnreadCount(data.unreadCount)
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    } finally {
      setIsLoadingNotifs(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [userEmail, userRole])

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false)
      }
    }
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isNotifOpen])

  // Mark single notification as read
  const handleMarkAsRead = async (id: string, actionUrl?: string) => {
    if (!userEmail) return
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))

      await fetch("/api/user/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", id, email: userEmail }),
      })

      if (actionUrl) {
        setIsNotifOpen(false)
        router.push(actionUrl)
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!userEmail) return
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)

      await fetch("/api/user/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read", email: userEmail }),
      })
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
    }
  }

  // Delete / dismiss single notification
  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!userEmail) return
    const targetNotif = notifications.find((n) => n.id === id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (targetNotif && !targetNotif.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
    try {
      await fetch("/api/user/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id, email: userEmail }),
      })
    } catch (err) {
      console.error("Failed to delete notification:", err)
    }
  }

  // Priority styling helper
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "announcement":
        return <SparklesIcon className="size-3.5 text-teal-600 dark:text-teal-400" />
      case "security":
        return <ShieldAlertIcon className="size-3.5 text-amber-600 dark:text-amber-400" />
      case "urgent":
        return <AlertTriangleIcon className="size-3.5 text-rose-600 dark:text-rose-400" />
      default:
        return <InfoIcon className="size-3.5 text-blue-600 dark:text-blue-400" />
    }
  }

  // Format date helper
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins}m ago`
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `${diffHours}h ago`
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}d ago`
    } catch {
      return "Recently"
    }
  }

  return (
    <SidebarProvider className="relative h-dvh min-h-0 w-full overflow-hidden">
      <AppSidebar selectedWorkspace={workspace} onSelectWorkspace={setWorkspace} />
      <SidebarInset className="min-w-0 overflow-hidden flex flex-col h-full">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur z-20">
          <SidebarTrigger className="-ml-1" />

          {/* Mobile Brand Logo - Visible on mobile (< md), hidden on desktop */}
          <div className="flex md:hidden items-center">
            <Logo href="/dashboard" size="sm" />
          </div>

          {/* Desktop Breadcrumbs - Hidden on mobile, visible on desktop (md:flex) */}
          <Breadcrumb className="hidden md:flex min-w-0">
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbLink href="/dashboard" className="truncate font-medium">
                  {workspace.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            {/* NOTIFICATION BELL WITH NUMBER SYSTEM */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                aria-label="Notifications"
                className={cn(
                  "relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-hidden",
                  isNotifOpen && "bg-muted text-foreground"
                )}
              >
                <BellIcon className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN POPUP */}
              {isNotifOpen && (
                <>
                  {/* Mobile Backdrop overlay */}
                  <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
                    onClick={() => setIsNotifOpen(false)}
                  />

                  {/* Dropdown Box: Mobile (fixed inset-x-3 top-14) / Desktop (absolute right-0 top-full mt-2 w-96) */}
                  <div className="fixed inset-x-3 top-14 max-h-[82vh] flex flex-col sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-h-[520px] rounded-xl border bg-card text-card-foreground shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-[11px] px-2 py-0.5">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                          >
                            <CheckCheckIcon className="size-3" />
                            <span>Mark all read</span>
                          </button>
                        )}
                        {/* Mobile Close Button */}
                        <button
                          type="button"
                          onClick={() => setIsNotifOpen(false)}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted sm:hidden"
                          aria-label="Close"
                        >
                          <XIcon className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notification List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-border/50 overscroll-contain">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <BellIcon className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">No notifications yet.</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleMarkAsRead(notif.id, notif.actionUrl)}
                            className={cn(
                              "p-3.5 text-left cursor-pointer transition-colors hover:bg-muted/50 flex gap-3 items-start relative group",
                              !notif.isRead && "bg-muted/20"
                            )}
                          >
                            <div className="mt-0.5 shrink-0 rounded-full p-1.5 bg-muted">
                              {getPriorityIcon(notif.priority)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <h4 className={cn("text-xs font-semibold truncate", !notif.isRead ? "text-foreground" : "text-muted-foreground")}>
                                  {notif.title}
                                </h4>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10px] text-muted-foreground">
                                    {formatTimeAgo(notif.sentAt)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                                    title="Dismiss notification"
                                    className="p-0.5 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <XIcon className="size-3" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {notif.message}
                              </p>
                              {notif.actionUrl && (
                                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-teal-600 dark:text-teal-400">
                                  <span>{notif.actionText || "View details"}</span>
                                  <ExternalLinkIcon className="size-2.5" />
                                </div>
                              )}
                            </div>
                            {notif.imageUrl && (
                              <div className="shrink-0 size-11 rounded-lg overflow-hidden border border-border/60 bg-muted/40 self-center">
                                <img
                                  src={notif.imageUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            {!notif.isRead && (
                              <span className="size-2 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Dropdown Footer */}
                    <div className="p-2.5 border-t bg-muted/20 text-center shrink-0">
                      <Link
                        href="/dashboard/notifications"
                        onClick={() => setIsNotifOpen(false)}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 py-1 px-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <span>View all notifications</span>
                        <ExternalLinkIcon className="size-3" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {isAdmin ? (
              <Link
                href="/admin"
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "flex items-center gap-1.5 text-xs"
                )}
              >
                <DatabaseIcon className="size-3.5 text-teal-600" />
                <span>Payload CMS Admin</span>
                <ExternalLinkIcon className="size-3 opacity-60" />
              </Link>
            ) : (
              <Link
                href="/dashboard/support"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "flex items-center gap-1.5 text-xs text-muted-foreground"
                )}
              >
                <LifeBuoyIcon className="size-3.5" />
                <span>Support</span>
              </Link>
            )}
          </div>
        </header>

        <EmailVerificationBanner />

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardShell
