import { useState, useEffect, useCallback } from "react"
import { Activity, ActivityStats, CreateActivityInput } from "./types"

const STORAGE_KEY = "nextload_activities_log"
const ACTIVITY_EVENT = "nextload:activity_updated"

// Get all authentic activities from localStorage
export function getActivities(isAdmin = false): Activity[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let userActivities: Activity[] = []
    if (stored) {
      const parsed: Activity[] = JSON.parse(stored)
      // Filter out any legacy fake/seed activities
      userActivities = parsed.filter(
        (a) => a && a.id && !a.id.startsWith("act-init-") && !a.id.startsWith("act-seed-")
      )
    }

    // Sort descending by timestamp
    userActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return userActivities.filter((a) => !a.adminOnly || isAdmin)
  } catch {
    return []
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

// Convenient helper to create an activity with sensible defaults
export function createActivity(input: CreateActivityInput): Activity {
  return logActivity({
    title: input.title,
    description: input.description,
    category: input.category || "System",
    type: input.type || "system_event",
    status: input.status || "info",
    ipAddress: input.ipAddress,
    device: input.device,
    adminOnly: input.adminOnly,
    metadata: input.metadata,
    timestamp: input.timestamp,
  })
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
    create: createActivity,
    clear: clearActivities,
  }
}

/**
 * React hook to easily add/log an activity from any client-side component.
 *
 * @example
 * ```tsx
 * const { createActivity } = useActivityCreator()
 *
 * createActivity({
 *   title: "Item Added",
 *   description: "Product was added to cart",
 *   category: "Account",
 *   status: "success",
 * })
 * ```
 */
export function useActivityCreator() {
  const add = useCallback((input: CreateActivityInput) => {
    return createActivity(input)
  }, [])

  return {
    createActivity: add,
    logActivity: add,
  }
}

// Alias for convenience
export const useLogActivity = useActivityCreator
