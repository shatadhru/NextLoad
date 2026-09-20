"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { CustomAdminViewWrapper } from "../components/CustomAdminViewWrapper"
import { SiteConfig } from "@/config/site"
import {
  Bell,
  Send,
  Globe,
  User,
  Users,
  ListPlus,
  Info,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Mail,
  Smartphone,
  RefreshCw,
  ExternalLink,
  History,
  RotateCcw,
  ChevronDown,
  Search,
  Check,
} from "lucide-react"

type TargetType = "all" | "specific" | "role" | "bulk"
type PriorityType = "info" | "announcement" | "security" | "urgent"
type ChannelType = "in_app" | "email"

interface BroadcastItem {
  id: string
  title: string
  message: string
  priority: PriorityType
  target: TargetType
  targetValue?: string
  channels: ChannelType[]
  recipientCount: number
  status: "delivered" | "partial" | "failed"
  actionUrl?: string
  actionText?: string
  sentAt: string
}

export function NotificationBroadcastView() {
  // Form State
  const [target, setTarget] = useState<TargetType>("all")
  const [specificEmail, setSpecificEmail] = useState("")
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [isManualEmail, setIsManualEmail] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user")
  const [bulkEmails, setBulkEmails] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState<PriorityType>("announcement")
  const [channels, setChannels] = useState<ChannelType[]>(["in_app", "email"])
  const [actionUrl, setActionUrl] = useState("")
  const [actionText, setActionText] = useState("View Details")

  // UI & Feedback State
  const [previewMode, setPreviewMode] = useState<"in_app" | "email">("in_app")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Data & History State
  const [stats, setStats] = useState({ totalUsers: 1284, adminCount: 4, regularCount: 1280 })
  const [availableUsers, setAvailableUsers] = useState<{ id: string; email: string; name: string; role: string }[]>([])
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)

  // Fetch initial stats and history
  const loadData = async () => {
    setIsLoadingData(true)
    try {
      const res = await fetch("/api/admin/notifications/send")
      if (res.ok) {
        const data = await res.json()
        if (data.stats) setStats(data.stats)
        if (data.users) setAvailableUsers(data.users)
        if (data.broadcasts) setBroadcasts(data.broadcasts)
      }
    } catch (err) {
      console.error("Failed to load notifications data:", err)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Selected user object
  const selectedUser = useMemo(() => {
    return availableUsers.find(
      (u) => u.email.toLowerCase() === specificEmail.toLowerCase()
    )
  }, [availableUsers, specificEmail])

  // Filtered users for dropdown search
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return availableUsers
    const q = userSearchQuery.toLowerCase()
    return availableUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    )
  }, [availableUsers, userSearchQuery])

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false)
      }
    }
    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserDropdownOpen])

  // Calculate estimated recipients
  const estimatedCount = useMemo(() => {
    if (target === "all") return stats.totalUsers || 1
    if (target === "role") return selectedRole === "admin" ? stats.adminCount : stats.regularCount
    if (target === "specific") return specificEmail.trim() ? 1 : 0
    if (target === "bulk") {
      const list = bulkEmails
        .split(/[\n,;]+/)
        .map((e) => e.trim())
        .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      return new Set(list).size
    }
    return 0
  }, [target, selectedRole, specificEmail, bulkEmails, stats])

  // Toggle channel selection
  const handleToggleChannel = (channel: ChannelType) => {
    setChannels((prev) => {
      if (prev.includes(channel)) {
        if (prev.length === 1) return prev // keep at least one
        return prev.filter((c) => c !== channel)
      } else {
        return [...prev, channel]
      }
    })
  }

  // Handle Form Submission
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    if (!title.trim()) {
      setFeedback({ type: "error", text: "Please enter a notification title." })
      return
    }
    if (!message.trim()) {
      setFeedback({ type: "error", text: "Please enter notification message content." })
      return
    }
    if (target === "specific" && !specificEmail.trim()) {
      setFeedback({ type: "error", text: "Please provide a valid recipient email." })
      return
    }
    if (target === "bulk" && estimatedCount === 0) {
      setFeedback({ type: "error", text: "Please enter at least one valid email address in the bulk list." })
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          specificEmail: target === "specific" ? specificEmail.trim() : undefined,
          role: target === "role" ? selectedRole : undefined,
          bulkEmails: target === "bulk" ? bulkEmails : undefined,
          title: title.trim(),
          message: message.trim(),
          priority,
          channels,
          actionUrl: actionUrl.trim() || undefined,
          actionText: actionText.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch notification.")
      }

      setFeedback({
        type: "success",
        text: `Broadcast sent successfully to ${data.stats?.recipientsCount || estimatedCount} recipients!`,
      })

      // Refresh broadcast history
      loadData()
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "An unexpected error occurred." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Load an existing broadcast into composer
  const handleReuseBroadcast = (b: BroadcastItem) => {
    setTitle(b.title)
    setMessage(b.message)
    setPriority(b.priority)
    setChannels(b.channels)
    if (b.actionUrl) setActionUrl(b.actionUrl)
    if (b.actionText) setActionText(b.actionText)
    setFeedback({ type: "success", text: `Loaded "${b.title}" into the composer.` })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Priority styling helpers
  const priorityConfig = {
    info: {
      color: "#2563eb",
      bg: "rgba(37, 99, 235, 0.1)",
      border: "#3b82f6",
      label: "Information",
      icon: Info,
    },
    announcement: {
      color: "#0d9488",
      bg: "rgba(13, 148, 136, 0.1)",
      border: "#14b8a6",
      label: "Announcement",
      icon: Sparkles,
    },
    security: {
      color: "#d97706",
      bg: "rgba(217, 119, 6, 0.1)",
      border: "#f59e0b",
      label: "Security Alert",
      icon: ShieldAlert,
    },
    urgent: {
      color: "#dc2626",
      bg: "rgba(220, 38, 38, 0.1)",
      border: "#ef4444",
      label: "Urgent",
      icon: AlertTriangle,
    },
  }[priority]

  return (
    <CustomAdminViewWrapper
      title="Notification Broadcast"
      description="Compose and dispatch system notices, feature announcements, and security alerts to specific users, role groups, or broadcast to everyone."
      badge="Broadcast Center"
    >
      {/* 1. Statistics Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "10px",
            border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
            backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)", marginBottom: "4px" }}>
            Total Registered Users
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
            <Users size={20} style={{ color: "#0d9488" }} />
            <span>{stats.totalUsers.toLocaleString()}</span>
          </div>
        </div>

        <div
          style={{
            padding: "16px 20px",
            borderRadius: "10px",
            border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
            backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)", marginBottom: "4px" }}>
            System Administrators
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={20} style={{ color: "#3b82f6" }} />
            <span>{stats.adminCount}</span>
          </div>
        </div>

        <div
          style={{
            padding: "16px 20px",
            borderRadius: "10px",
            border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
            backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)", marginBottom: "4px" }}>
            Broadcasts Dispatched
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
            <Bell size={20} style={{ color: "#f59e0b" }} />
            <span>{broadcasts.length}</span>
          </div>
        </div>

        <div
          style={{
            padding: "16px 20px",
            borderRadius: "10px",
            border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
            backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)", marginBottom: "4px" }}>
            Hostinger SMTP Status
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#10b981", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
            <span>Relay Connected</span>
          </div>
        </div>
      </div>

      {/* Main Composer & Preview Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "28px",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: Composer Form */}
        <div>
          <form onSubmit={handleSend}>
            {/* Step 1: Audience Selection */}
            <div
              style={{
                padding: "24px",
                borderRadius: "10px",
                border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
                backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>1. Target Audience</h3>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0d9488",
                    backgroundColor: "rgba(13, 148, 136, 0.1)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  ~{estimatedCount} Recipient{estimatedCount !== 1 ? "s" : ""}
                </span>
              </div>

              {/* 4 Audience Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                {[
                  { id: "all" as TargetType, label: "Everyone", sub: "All registered users", icon: Globe },
                  { id: "specific" as TargetType, label: "Specific User", sub: "Individual recipient", icon: User },
                  { id: "role" as TargetType, label: "User Role", sub: "Filter by Admin or User", icon: Users },
                  { id: "bulk" as TargetType, label: "Bulk Email List", sub: "Custom list of emails", icon: ListPlus },
                ].map((item) => {
                  const Icon = item.icon
                  const active = target === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTarget(item.id)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "8px",
                        textAlign: "left",
                        cursor: "pointer",
                        border: active ? "2px solid #0d9488" : "1px solid var(--theme-elevation-200, rgba(0,0,0,0.1))",
                        backgroundColor: active ? "rgba(13, 148, 136, 0.08)" : "var(--theme-elevation-100, #fff)",
                        color: "inherit",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          marginTop: "2px",
                          color: active ? "#0d9488" : "var(--theme-elevation-500, #777)",
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "14px", color: active ? "#0d9488" : "inherit" }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)" }}>
                          {item.sub}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Conditional Target Inputs: Specific User Dropdown */}
              {target === "specific" && (
                <div style={{ marginTop: "14px" }} ref={userDropdownRef}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600 }}>
                      Select Recipient User
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsManualEmail(!isManualEmail)
                        setIsUserDropdownOpen(false)
                      }}
                      style={{
                        fontSize: "11px",
                        color: "#0d9488",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      {isManualEmail ? "Choose from users dropdown" : "Or enter custom email manually"}
                    </button>
                  </div>

                  {isManualEmail ? (
                    <div>
                      <input
                        type="email"
                        value={specificEmail}
                        onChange={(e) => setSpecificEmail(e.target.value)}
                        placeholder="external.user@example.com"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "6px",
                          border: "1px solid var(--theme-elevation-250, #ccc)",
                          backgroundColor: "var(--theme-elevation-100, #fff)",
                          fontSize: "13px",
                          color: "inherit",
                          boxSizing: "border-box",
                        }}
                      />
                      <p style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)", margin: "4px 0 0 0" }}>
                        Enter any valid email address to send directly.
                      </p>
                    </div>
                  ) : (
                    <div style={{ position: "relative" }}>
                      {/* Dropdown Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "6px",
                          border: isUserDropdownOpen
                            ? "2px solid #0d9488"
                            : "1px solid var(--theme-elevation-250, #ccc)",
                          backgroundColor: "var(--theme-elevation-100, #fff)",
                          fontSize: "13px",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          textAlign: "left",
                          boxSizing: "border-box",
                        }}
                      >
                        {selectedUser ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: selectedUser.role === "admin" ? "#3b82f620" : "#0d948820",
                                color: selectedUser.role === "admin" ? "#3b82f6" : "#0d9488",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "12px",
                              }}
                            >
                              {selectedUser.name
                                ? selectedUser.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()
                                : selectedUser.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "13px" }}>{selectedUser.name}</div>
                              <div style={{ fontSize: "11px", color: "var(--theme-elevation-500, #777)" }}>
                                {selectedUser.email}
                              </div>
                            </div>
                            <span
                              style={{
                                marginLeft: "8px",
                                fontSize: "10px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                backgroundColor: selectedUser.role === "admin" ? "rgba(59, 130, 246, 0.1)" : "rgba(13, 148, 136, 0.1)",
                                color: selectedUser.role === "admin" ? "#3b82f6" : "#0d9488",
                              }}
                            >
                              {selectedUser.role}
                            </span>
                          </div>
                        ) : specificEmail ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <User size={16} style={{ color: "#0d9488" }} />
                            <span>{specificEmail}</span>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--theme-elevation-500, #777)" }}>
                            <User size={16} />
                            <span>Select a registered user from dropdown...</span>
                          </div>
                        )}
                        <ChevronDown size={16} style={{ color: "var(--theme-elevation-500, #777)", transform: isUserDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </button>

                      {/* Dropdown Menu */}
                      {isUserDropdownOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            right: 0,
                            borderRadius: "8px",
                            border: "1px solid var(--theme-elevation-250, #ccc)",
                            backgroundColor: "var(--theme-elevation-50, #fff)",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            zIndex: 100,
                            overflow: "hidden",
                            maxHeight: "280px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {/* Search Input */}
                          <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--theme-elevation-150, #eee)", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Search size={14} style={{ color: "var(--theme-elevation-400, #999)" }} />
                            <input
                              type="text"
                              value={userSearchQuery}
                              onChange={(e) => setUserSearchQuery(e.target.value)}
                              placeholder="Search by name, email, or role..."
                              autoFocus
                              style={{
                                width: "100%",
                                border: "none",
                                outline: "none",
                                background: "transparent",
                                fontSize: "12px",
                                color: "inherit",
                              }}
                            />
                          </div>

                          {/* Users List */}
                          <div style={{ overflowY: "auto", flex: 1 }}>
                            {filteredUsers.length === 0 ? (
                              <div style={{ padding: "16px", textAlign: "center", fontSize: "12px", color: "var(--theme-elevation-500, #777)" }}>
                                No users found matching &quot;{userSearchQuery}&quot;
                              </div>
                            ) : (
                              filteredUsers.map((u) => {
                                const isSelected = specificEmail.toLowerCase() === u.email.toLowerCase()
                                return (
                                  <div
                                    key={u.id}
                                    onClick={() => {
                                      setSpecificEmail(u.email)
                                      setIsUserDropdownOpen(false)
                                    }}
                                    style={{
                                      padding: "10px 14px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      cursor: "pointer",
                                      backgroundColor: isSelected ? "rgba(13, 148, 136, 0.08)" : "transparent",
                                      borderBottom: "1px solid var(--theme-elevation-100, #f5f5f5)",
                                      transition: "background-color 0.15s",
                                    }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                      <div
                                        style={{
                                          width: "28px",
                                          height: "28px",
                                          borderRadius: "50%",
                                          backgroundColor: u.role === "admin" ? "#3b82f620" : "#0d948820",
                                          color: u.role === "admin" ? "#3b82f6" : "#0d9488",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontWeight: 700,
                                          fontSize: "11px",
                                        }}
                                      >
                                        {u.name
                                          ? u.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .slice(0, 2)
                                              .join("")
                                              .toUpperCase()
                                          : u.email[0].toUpperCase()}
                                      </div>
                                      <div>
                                        <div style={{ fontWeight: 600, fontSize: "13px" }}>{u.name}</div>
                                        <div style={{ fontSize: "11px", color: "var(--theme-elevation-500, #777)" }}>
                                          {u.email}
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          fontWeight: 700,
                                          textTransform: "uppercase",
                                          padding: "2px 6px",
                                          borderRadius: "4px",
                                          backgroundColor: u.role === "admin" ? "rgba(59, 130, 246, 0.1)" : "rgba(13, 148, 136, 0.1)",
                                          color: u.role === "admin" ? "#3b82f6" : "#0d9488",
                                        }}
                                      >
                                        {u.role}
                                      </span>
                                      {isSelected && <Check size={14} style={{ color: "#0d9488" }} />}
                                    </div>
                                  </div>
                                )
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {target === "role" && (
                <div style={{ marginTop: "12px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Select Target Role
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {(["user", "admin"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRole(r)}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer",
                          border: selectedRole === r ? "2px solid #0d9488" : "1px solid var(--theme-elevation-250, #ccc)",
                          backgroundColor: selectedRole === r ? "rgba(13, 148, 136, 0.08)" : "var(--theme-elevation-100, #fff)",
                          color: selectedRole === r ? "#0d9488" : "inherit",
                        }}
                      >
                        {r === "admin" ? `Administrators (${stats.adminCount})` : `Standard Users (${stats.regularCount})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {target === "bulk" && (
                <div style={{ marginTop: "12px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Email Addresses (Comma, Semicolon, or Newline Separated)
                  </label>
                  <textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    rows={4}
                    placeholder="sarah@example.com, alex@company.org&#10;john.doe@test.com"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid var(--theme-elevation-250, #ccc)",
                      backgroundColor: "var(--theme-elevation-100, #fff)",
                      fontSize: "13px",
                      color: "inherit",
                      fontFamily: "monospace",
                      boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)", margin: "4px 0 0 0" }}>
                    Detected {estimatedCount} valid unique email{estimatedCount !== 1 ? "s" : ""}.
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Notification Content */}
            <div
              style={{
                padding: "24px",
                borderRadius: "10px",
                border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
                backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
                marginBottom: "24px",
              }}
            >
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 600 }}>2. Message Content</h3>

              {/* Priority Selector */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                  Notification Priority & Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {(["info", "announcement", "security", "urgent"] as PriorityType[]).map((p) => {
                    const cfg = {
                      info: { label: "Info", color: "#2563eb", icon: Info },
                      announcement: { label: "Announcement", color: "#0d9488", icon: Sparkles },
                      security: { label: "Security", color: "#d97706", icon: ShieldAlert },
                      urgent: { label: "Urgent", color: "#dc2626", icon: AlertTriangle },
                    }[p]
                    const Icon = cfg.icon
                    const isSelected = priority === p

                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          border: isSelected ? `2px solid ${cfg.color}` : "1px solid var(--theme-elevation-200, rgba(0,0,0,0.1))",
                          backgroundColor: isSelected ? `${cfg.color}15` : "var(--theme-elevation-100, #fff)",
                          color: isSelected ? cfg.color : "inherit",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Icon size={14} />
                        <span>{cfg.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Notification Title / Subject
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled Infrastructure Upgrade & Cloudinary Optimization"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--theme-elevation-250, #ccc)",
                    backgroundColor: "var(--theme-elevation-100, #fff)",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "inherit",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              {/* Message Body */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Message Body
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Write the notification message here... (Double line breaks create paragraphs in emails)"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--theme-elevation-250, #ccc)",
                    backgroundColor: "var(--theme-elevation-100, #fff)",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: "inherit",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              {/* Action Link (Optional) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Action Button Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={actionText}
                    onChange={(e) => setActionText(e.target.value)}
                    placeholder="e.g. View Details, Update Settings"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--theme-elevation-250, #ccc)",
                      backgroundColor: "var(--theme-elevation-100, #fff)",
                      fontSize: "13px",
                      color: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Action URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    placeholder="e.g. /dashboard/settings or https://..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--theme-elevation-250, #ccc)",
                      backgroundColor: "var(--theme-elevation-100, #fff)",
                      fontSize: "13px",
                      color: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Delivery Channels */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                  Delivery Channels
                </label>
                <div style={{ display: "flex", gap: "16px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={channels.includes("in_app")}
                      onChange={() => handleToggleChannel("in_app")}
                      style={{ cursor: "pointer" }}
                    />
                    <Smartphone size={16} style={{ color: "#0d9488" }} />
                    <span>In-App Notification</span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={channels.includes("email")}
                      onChange={() => handleToggleChannel("email")}
                      style={{ cursor: "pointer" }}
                    />
                    <Mail size={16} style={{ color: "#3b82f6" }} />
                    <span>Email Notification (Hostinger SMTP)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: feedback.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${feedback.type === "success" ? "#10b981" : "#ef4444"}`,
                  color: feedback.type === "success" ? "#065f46" : "#991b1b",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {feedback.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Send Button Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderRadius: "10px",
                border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
                backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
              }}
            >
              <div style={{ fontSize: "13px", color: "var(--theme-elevation-600, #666)" }}>
                Ready to send to <strong>{estimatedCount}</strong> recipient{estimatedCount !== 1 ? "s" : ""} via{" "}
                <strong>{channels.map((c) => (c === "in_app" ? "In-App" : "Email")).join(" & ")}</strong>.
              </div>

              <button
                type="submit"
                disabled={isSubmitting || estimatedCount === 0}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: isSubmitting || estimatedCount === 0 ? "not-allowed" : "pointer",
                  backgroundColor: isSubmitting || estimatedCount === 0 ? "var(--theme-elevation-250, #ccc)" : "#0d9488",
                  color: "#fff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 6px rgba(13, 148, 136, 0.25)",
                  transition: "background-color 0.2s",
                }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Dispatching Broadcast...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Live Interactive Preview */}
        <div>
          <div
            style={{
              padding: "24px",
              borderRadius: "10px",
              border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
              backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
              position: "sticky",
              top: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={16} style={{ color: "#0d9488" }} />
                <span>Live Interactive Preview</span>
              </h3>

              {/* Toggle Buttons */}
              <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--theme-elevation-150, #eee)", padding: "2px", borderRadius: "6px" }}>
                <button
                  type="button"
                  onClick={() => setPreviewMode("in_app")}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: previewMode === "in_app" ? "var(--theme-elevation-0, #fff)" : "transparent",
                    color: previewMode === "in_app" ? "#0d9488" : "inherit",
                    boxShadow: previewMode === "in_app" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  In-App
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("email")}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: previewMode === "email" ? "var(--theme-elevation-0, #fff)" : "transparent",
                    color: previewMode === "email" ? "#0d9488" : "inherit",
                    boxShadow: previewMode === "email" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  Email
                </button>
              </div>
            </div>

            {/* PREVIEW: IN-APP VIEW */}
            {previewMode === "in_app" && (
              <div>
                <div style={{ fontSize: "11px", color: "var(--theme-elevation-500, #777)", marginBottom: "8px" }}>
                  Dashboard Notification Card Mockup:
                </div>
                <div
                  style={{
                    borderRadius: "10px",
                    border: `1px solid ${priorityConfig.border}40`,
                    backgroundColor: "var(--theme-elevation-100, #fff)",
                    padding: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          color: priorityConfig.color,
                          backgroundColor: priorityConfig.bg,
                          border: `1px solid ${priorityConfig.border}`,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <priorityConfig.icon size={11} />
                        {priorityConfig.label}
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--theme-elevation-400, #999)" }}>Just now</span>
                  </div>

                  <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 600, color: "var(--theme-elevation-900, #111)" }}>
                    {title || "Untitled Notification"}
                  </h4>

                  <p
                    style={{
                      margin: "0 0 14px 0",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      color: "var(--theme-elevation-600, #555)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message || "Your notification message will appear here in real-time as you type."}
                  </p>

                  {actionUrl && (
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#0d9488",
                          textDecoration: "none",
                        }}
                      >
                        <span>{actionText || "View Details"}</span>
                        <ExternalLink size={12} />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PREVIEW: EMAIL CLIENT VIEW */}
            {previewMode === "email" && (
              <div>
                <div style={{ fontSize: "11px", color: "var(--theme-elevation-500, #777)", marginBottom: "8px" }}>
                  Mail Client Mockup:
                </div>
                <div
                  style={{
                    borderRadius: "10px",
                    border: "1px solid var(--theme-elevation-200, #ccc)",
                    backgroundColor: "#f8fafc",
                    overflow: "hidden",
                    fontSize: "12px",
                  }}
                >
                  {/* Mock Mail Header */}
                  <div style={{ padding: "10px 14px", backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                    <div style={{ color: "#64748b", marginBottom: "2px" }}>
                      <strong>From:</strong> {SiteConfig.site.name} &lt;support@mrtripy.com&gt;
                    </div>
                    <div style={{ color: "#64748b", marginBottom: "2px" }}>
                      <strong>To:</strong>{" "}
                      {target === "specific" && specificEmail
                        ? specificEmail
                        : target === "all"
                        ? "All Platform Users (1,284)"
                        : target === "role"
                        ? `Role: ${selectedRole}`
                        : `Bulk List (${estimatedCount})`}
                    </div>
                    <div style={{ color: "#0f172a", fontWeight: 600 }}>
                      <strong>Subject:</strong> [{SiteConfig.site.name}] {title || "Untitled Notification"}
                    </div>
                  </div>

                  {/* Mock Mail Body Card */}
                  <div style={{ padding: "16px", backgroundColor: "#fff", margin: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ borderBottom: "2px solid #0d9488", paddingBottom: "8px", marginBottom: "12px" }}>
                      <h4 style={{ margin: 0, fontSize: "15px", color: "#0f172a" }}>{SiteConfig.site.name}</h4>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: priorityConfig.color,
                          backgroundColor: priorityConfig.bg,
                          border: `1px solid ${priorityConfig.border}`,
                        }}
                      >
                        {priorityConfig.label}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
                      {title || "Untitled Notification"}
                    </h3>

                    <div style={{ color: "#334155", fontSize: "12px", lineHeight: "1.6", whiteSpace: "pre-wrap", marginBottom: "16px" }}>
                      {message || "Your notification body will be formatted and rendered beautifully here."}
                    </div>

                    {actionUrl && (
                      <div style={{ textAlign: "center", margin: "16px 0" }}>
                        <div
                          style={{
                            display: "inline-block",
                            padding: "8px 18px",
                            backgroundColor: "#0f172a",
                            color: "#fff",
                            borderRadius: "6px",
                            fontWeight: 600,
                            fontSize: "12px",
                          }}
                        >
                          {actionText || "View Details"} &rarr;
                        </div>
                      </div>
                    )}

                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "8px", marginTop: "16px", fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>
                      &copy; {new Date().getFullYear()} {SiteConfig.site.name}. All rights reserved.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Broadcast History & Audit Log Section */}
      <div style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <History size={18} style={{ color: "#0d9488" }} />
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Sent Broadcast History</h3>
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={isLoadingData}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid var(--theme-elevation-250, #ccc)",
              backgroundColor: "var(--theme-elevation-100, #fff)",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <RefreshCw size={13} style={{ animation: isLoadingData ? "spin 1s linear infinite" : "none" }} />
            <span>Refresh</span>
          </button>
        </div>

        <div
          style={{
            borderRadius: "10px",
            border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 1fr 1fr",
              padding: "12px 16px",
              backgroundColor: "var(--theme-elevation-100, rgba(0,0,0,0.04))",
              fontWeight: 600,
              fontSize: "12px",
              color: "var(--theme-elevation-600, #666)",
              borderBottom: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
            }}
          >
            <div>Subject & Message</div>
            <div>Audience / Target</div>
            <div>Priority</div>
            <div>Channels</div>
            <div>Status</div>
            <div style={{ textAlign: "right" }}>Actions</div>
          </div>

          {broadcasts.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--theme-elevation-500, #777)", fontSize: "13px" }}>
              No broadcast notifications dispatched yet. Use the composer above to send your first broadcast!
            </div>
          ) : (
            broadcasts.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 1fr 1fr",
                  padding: "14px 16px",
                  fontSize: "13px",
                  borderBottom: "1px solid var(--theme-elevation-100, rgba(0,0,0,0.04))",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "var(--theme-elevation-900, #111)" }}>{b.title}</div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--theme-elevation-500, #777)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "340px",
                      marginTop: "2px",
                    }}
                  >
                    {b.message}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 500, fontSize: "12px" }}>{b.targetValue || b.target}</div>
                  <div style={{ fontSize: "11px", color: "var(--theme-elevation-400, #888)" }}>
                    {b.recipientCount} recipient{b.recipientCount !== 1 ? "s" : ""}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      textTransform: "capitalize",
                      backgroundColor:
                        b.priority === "urgent"
                          ? "rgba(239, 68, 68, 0.1)"
                          : b.priority === "security"
                          ? "rgba(245, 158, 11, 0.1)"
                          : b.priority === "announcement"
                          ? "rgba(13, 148, 136, 0.1)"
                          : "rgba(59, 130, 246, 0.1)",
                      color:
                        b.priority === "urgent"
                          ? "#ef4444"
                          : b.priority === "security"
                          ? "#f59e0b"
                          : b.priority === "announcement"
                          ? "#0d9488"
                          : "#3b82f6",
                    }}
                  >
                    {b.priority}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  {b.channels?.includes("in_app") && (
                    <span title="In-App">
                      <Smartphone size={15} style={{ color: "#0d9488" }} />
                    </span>
                  )}
                  {b.channels?.includes("email") && (
                    <span title="Email">
                      <Mail size={15} style={{ color: "#3b82f6" }} />
                    </span>
                  )}
                </div>

                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: b.status === "delivered" ? "#10b981" : b.status === "partial" ? "#f59e0b" : "#ef4444",
                      backgroundColor:
                        b.status === "delivered"
                          ? "rgba(16, 185, 129, 0.1)"
                          : b.status === "partial"
                          ? "rgba(245, 158, 11, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                      padding: "2px 7px",
                      borderRadius: "4px",
                      textTransform: "capitalize",
                    }}
                  >
                    {b.status}
                  </span>
                </div>

                <div style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => handleReuseBroadcast(b)}
                    title="Load into Composer to Re-send"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid var(--theme-elevation-200, #ccc)",
                      backgroundColor: "var(--theme-elevation-50, #fff)",
                      color: "inherit",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <RotateCcw size={11} />
                    <span>Re-use</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CustomAdminViewWrapper>
  )
}

export default NotificationBroadcastView
