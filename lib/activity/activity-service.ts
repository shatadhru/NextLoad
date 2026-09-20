import { useState, useEffect, useCallback } from "react"
import { Activity, ActivityStats } from "./types"

const STORAGE_KEY = "nextload_activities_log"
const ACTIVITY_EVENT = "nextload:activity_updated"

// Initial seed activities matching platform events
const SEED_ACTIVITIES: Activity[] = [
  {
    id: "act-init-1",
    title: "Avatar updated",
    description: "High-definition profile picture processed and optimized with auto face-detection.",
    category: "Account",
    type: "avatar_update",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    device: "Chrome / Windows",
    metadata: {
      provider: "Cloudinary CDN",
      format: "auto (WebP)",
    },
  },
  {
    id: "act-init-2",
    title: "Appearance theme switched",
    description: "System interface theme preference updated in Settings.",
    category: "Settings",
    type: "settings_update",
    status: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    device: "Desktop Browser",
  },
  {
    id: "act-init-3",
    title: "Session authenticated via Better Auth",
    description: "Secure login validated with 30-day session lifetime.",
    category: "Security",
    type: "login",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    ipAddress: "127.0.0.1",
    device: "Chrome on Windows 11",
  },
  {
    id: "act-init-4",
    title: "File 'invoice_march_2026.pdf' uploaded",
    description: "Stored in cloud workspace with encrypted file metadata.",
    category: "Files",
    type: "file_upload",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    metadata: {
      filename: "invoice_march_2026.pdf",
      size: "2.4 MB",
      access: "Private",
    },
  },
  {
    id: "act-init-5",
    title: "Security credential check passed",
    description: "Password strength and active session tokens validated.",
    category: "Security",
    type: "system_event",
    status: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
  },
  {
    id: "act-init-6",
    title: "Payload CMS collection 'Media' updated",
    description: "Schema validation and database indices synchronized.",
    category: "Admin",
    type: "admin_action",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    adminOnly: true,
  },
  {
    id: "act-init-7",
    title: "Password changed successfully",
    description: "Account credentials updated and other active sessions notified.",
    category: "Security",
    type: "password_change",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    device: "Desktop Browser",
  },
  {
    id: "act-init-8",
    title: "Project documentation exported",
    description: "Archive bundle generated and downloaded to local machine.",
    category: "Files",
    type: "file_download",
    status: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    metadata: {
      filesCount: 14,
    },
  },
]

// Get all activities from localStorage merged with seeds
export function getActivities(isAdmin = false): Activity[] {
  if (typeof window === "undefined") {
    return SEED_ACTIVITIES.filter((a) => !a.adminOnly || isAdmin)
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let userActivities: Activity[] = []
    if (stored) {
      userActivities = JSON.parse(stored)
    }

    // Merge custom activities with seeds (avoiding duplicate IDs)
    const existingIds = new Set(userActivities.map((a) => a.id))
    const merged = [
      ...userActivities,
      ...SEED_ACTIVITIES.filter((seed) => !existingIds.has(seed.id)),
    ]

    // Sort descending by timestamp
    merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return merged.filter((a) => !a.adminOnly || isAdmin)
  } catch {
    return SEED_ACTIVITIES.filter((a) => !a.adminOnly || isAdmin)
  }
}

// Log a new activity into the system
export function logActivity(activity: Omit<Activity, "id" | "timestamp"> & { timestamp?: string }): Activity {
  const newActivity: Activity = {
    ...activity,
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: activity.timestamp || new Date().toISOString(),
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const list: Activity[] = stored ? JSON.parse(stored) : []
      list.unshift(newActivity)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 100))) // Keep latest 100
      window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT, { detail: newActivity }))
    } catch (e) {
      console.error("[ActivityService] Failed to persist activity:", e)
    }
  }

  return newActivity
}

// Clear all logged activities and restore seeds
export function clearActivities(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT))
  }
}

// Calculate statistics from activities
export function calculateActivityStats(activities: Activity[]): ActivityStats {
  const total = activities.length
  const securityCount = activities.filter((a) => a.category === "Security").length
  const filesCount = activities.filter((a) => a.category === "Files").length
  const successCount = activities.filter((a) => a.status === "success").length
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 100

  return {
    total,
    securityCount,
    filesCount,
    successRate,
    latestTimestamp: activities[0]?.timestamp,
  }
}

// Export activities as JSON
export function exportActivitiesAsJson(activities: Activity[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities, null, 2))
  const downloadAnchor = document.createElement("a")
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", `nextload-activity-${new Date().toISOString().slice(0, 10)}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}

// Export activities as CSV
export function exportActivitiesAsCsv(activities: Activity[]): void {
  const headers = ["ID", "Title", "Category", "Status", "Timestamp", "Device", "IP Address", "Description"]
  const rows = activities.map((a) => [
    `"${a.id}"`,
    `"${a.title.replace(/"/g, '""')}"`,
    `"${a.category}"`,
    `"${a.status}"`,
    `"${a.timestamp}"`,
    `"${(a.device || "").replace(/"/g, '""')}"`,
    `"${a.ipAddress || ""}"`,
    `"${(a.description || "").replace(/"/g, '""')}"`,
  ])

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
  const downloadAnchor = document.createElement("a")
  downloadAnchor.setAttribute("href", encodeURI(csvContent))
  downloadAnchor.setAttribute("download", `nextload-activity-${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}

// Custom React Hook for live activities
export function useActivities(isAdmin = false) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    setActivities(getActivities(isAdmin))
    setIsLoading(false)
  }, [isAdmin])

  useEffect(() => {
    refresh()

    const handleUpdate = () => {
      refresh()
    }

    window.addEventListener(ACTIVITY_EVENT, handleUpdate)
    window.addEventListener("storage", handleUpdate)

    return () => {
      window.removeEventListener(ACTIVITY_EVENT, handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [refresh])

  const stats = calculateActivityStats(activities)

  return {
    activities,
    isLoading,
    stats,
    refresh,
    log: logActivity,
    clear: clearActivities,
  }
}
