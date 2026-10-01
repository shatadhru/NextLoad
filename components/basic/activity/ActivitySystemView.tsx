"use client"

import React, { useState, useMemo } from "react"
import { useActivities, exportActivitiesAsCsv, exportActivitiesAsJson } from "@/lib/activity/activity-service"
import { ActivityCategory, ActivityStatus } from "@/lib/activity/types"
import { authClient } from "@/payload/auth/client"
import { ActivityStatsSummary } from "./ActivityStatsSummary"
import { ActivityFilters } from "./ActivityFilters"
import { ActivityTimeline } from "./ActivityTimeline"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { Download, RefreshCw, Trash2, Clock } from "lucide-react"

export function ActivitySystemView() {
  const { data: session } = authClient.useSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin"

  const { activities, isLoading, stats, refresh, clear } = useActivities(isAdmin)

  // Filter states
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<ActivityCategory>("All")
  const [status, setStatus] = useState<ActivityStatus | "All">("All")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ActivityCategory, number> = {
      All: activities.length,
      Security: 0,
      Files: 0,
      Account: 0,
      Settings: 0,
      System: 0,
      Admin: 0,
    }

    activities.forEach((act) => {
      if (counts[act.category] !== undefined) {
        counts[act.category]++
      }
    })

    return counts
  }, [activities])

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Search match
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchesTitle = act.title.toLowerCase().includes(query)
        const matchesDesc = act.description?.toLowerCase().includes(query) ?? false
        const matchesDevice = act.device?.toLowerCase().includes(query) ?? false
        const matchesCategory = act.category.toLowerCase().includes(query)
        if (!matchesTitle && !matchesDesc && !matchesDevice && !matchesCategory) {
          return false
        }
      }

      // Category match
      if (category !== "All" && act.category !== category) {
        return false
      }

      // Status match
      if (status !== "All" && act.status !== status) {
        return false
      }

      return true
    })
  }, [activities, search, category, status])

  // Manual refresh with visual feedback
  const handleRefresh = () => {
    setIsRefreshing(true)
    refresh()
    setTimeout(() => {
      setIsRefreshing(false)
      toast.add({
        title: "Activities Refreshed",
        description: "Activity feed is up to date.",
        type: "info",
      })
    }, 300)
  }

  // Clear activities
  const handleClear = () => {
    if (confirm("Are you sure you want to clear your local activity history?")) {
      clear()
      toast.add({
        title: "Activity Log Cleared",
        description: "Activity records have been reset.",
        type: "success",
      })
    }
  }

  const handleResetFilters = () => {
    setSearch("")
    setCategory("All")
    setStatus("All")
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Activity System</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Audit Log
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time chronological ledger of authentication, uploads, and account changes.
          </p>
        </div>

        {/* Action Controls: Refresh, Export, Clear */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-xs h-9"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="text-xs h-9">
                  <Download className="size-3.5 mr-1.5" />
                  Export
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => {
                  exportActivitiesAsCsv(filteredActivities)
                  toast.add({
                    title: "CSV Exported",
                    description: "Activity log downloaded as CSV.",
                    type: "success",
                  })
                }}
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  exportActivitiesAsJson(filteredActivities)
                  toast.add({
                    title: "JSON Exported",
                    description: "Activity log downloaded as JSON.",
                    type: "success",
                  })
                }}
              >
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Log */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Clear activity log"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <ActivityStatsSummary stats={stats} />

      {/* Filter Controls */}
      <div className="p-4 rounded-xl border bg-card/60 space-y-3">
        <ActivityFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
          categoryCounts={categoryCounts}
          onReset={handleResetFilters}
          isAdmin={isAdmin}
        />
      </div>

      {/* Activities Timeline Feed */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : (
        <div className="p-4 sm:p-6 rounded-xl border bg-card/40">
          <div className="flex items-center justify-between pb-4 mb-6 border-b">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Activity Timeline</h2>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Showing {filteredActivities.length} of {activities.length} events
            </span>
          </div>

          <ActivityTimeline
            activities={filteredActivities}
            emptyMessage={
              search || category !== "All" || status !== "All"
                ? "No activities found matching your active filters."
                : "No activities logged yet."
            }
          />
        </div>
      )}
    </div>
  )
}

export default ActivitySystemView
