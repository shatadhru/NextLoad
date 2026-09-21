"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { authClient } from "@/payload/auth/client"
import {
  Bell,
  CheckCheck,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Info,
  ExternalLink,
  Filter,
  Check,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationItem {
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

export default function NotificationsPage() {
  const { data: session } = authClient.useSession()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [filter, setFilter] = useState<"all" | "unread" | "announcement" | "security">("all")
  const [isLoading, setIsLoading] = useState(true)

  const userEmail = session?.user?.email || ""
  const userRole = (session?.user as { role?: string } | undefined)?.role || "user"

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const url = userEmail
        ? `/api/user/notifications?email=${encodeURIComponent(userEmail)}&role=${encodeURIComponent(userRole)}`
        : "/api/user/notifications"
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        if (data.notifications) setNotifications(data.notifications)
      }
    } catch (err) {
      console.error("Failed to load notifications:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [userEmail, userRole])

  const handleMarkAsRead = async (id: string) => {
    if (!userEmail) return
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    await fetch("/api/user/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_read", id, email: userEmail }),
    })
  }

  const handleMarkAllAsRead = async () => {
    if (!userEmail) return
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    await fetch("/api/user/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_all_read", email: userEmail }),
    })
  }

  const handleDeleteNotification = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!userEmail) return
    setNotifications((prev) => prev.filter((n) => n.id !== id))
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

  const handleClearAll = async () => {
    if (!userEmail || notifications.length === 0) return
    if (!confirm("Are you sure you want to clear all notifications from your feed?")) return
    setNotifications([])
    try {
      await fetch("/api/user/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_all", email: userEmail }),
      })
    } catch (err) {
      console.error("Failed to clear all notifications:", err)
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead
    if (filter === "announcement") return n.priority === "announcement"
    if (filter === "security") return n.priority === "security" || n.priority === "urgent"
    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "announcement":
        return {
          icon: <Sparkles className="size-3.5" />,
          label: "Announcement",
          className: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
        }
      case "security":
        return {
          icon: <ShieldAlert className="size-3.5" />,
          label: "Security Alert",
          className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        }
      case "urgent":
        return {
          icon: <AlertTriangle className="size-3.5" />,
          label: "Urgent",
          className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        }
      default:
        return {
          icon: <Info className="size-3.5" />,
          label: "Information",
          className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-xs px-2.5 py-0.5">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            System announcements, platform updates, and security alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              <CheckCheck className="size-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="size-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all" as const, label: `All (${notifications.length})` },
          { id: "unread" as const, label: `Unread (${unreadCount})` },
          { id: "announcement" as const, label: "Announcements" },
          { id: "security" as const, label: "Security & Alerts" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              filter === tab.id
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed bg-card/50">
            <Bell className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-semibold text-sm">No notifications found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              You are all caught up! No notifications match your current filter.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const badge = getPriorityBadge(notif.priority)
            return (
              <div
                key={notif.id}
                className={cn(
                  "p-5 rounded-xl border transition-all relative group bg-card",
                  !notif.isRead
                    ? "border-teal-500/30 bg-teal-500/5 shadow-xs"
                    : "border-border/60 hover:border-border"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                          badge.className
                        )}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notif.sentAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {!notif.isRead && (
                        <span className="inline-flex items-center text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                          • New
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-sm text-foreground">
                      {notif.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {notif.message}
                    </p>

                    {notif.imageUrl && (
                      <div className="pt-2 pb-1">
                        <div className="relative overflow-hidden rounded-xl border border-border/60 bg-muted/20 max-w-lg">
                          <img
                            src={notif.imageUrl}
                            alt={notif.title}
                            className="w-full max-h-72 object-cover transition-transform duration-300 hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}

                    {notif.actionUrl && (
                      <div className="pt-2">
                        <Link
                          href={notif.actionUrl}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          <span>{notif.actionText || "View details"}</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notif.id)}
                        title="Mark as read"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-80 group-hover:opacity-100"
                      >
                        <Check className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteNotification(notif.id, e)}
                      title="Delete notification"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors opacity-80 group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
