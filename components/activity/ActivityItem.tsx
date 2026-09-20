"use client"

import React, { useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { Activity } from "@/lib/activity/types"
import {
  CircleCheck,
  AlertTriangle,
  Info,
  OctagonX,
  FileText,
  KeyRound,
  User,
  Sliders,
  Server,
  Shield,
  ChevronDown,
  ChevronUp,
  Laptop,
  Globe,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItemProps {
  activity: Activity
  compact?: boolean
  showTimelineConnector?: boolean
}

export function ActivityItem({
  activity,
  compact = false,
  showTimelineConnector = true,
}: ActivityItemProps) {
  const [expanded, setExpanded] = useState(false)

  // Status-based styling
  const statusConfig = {
    success: {
      icon: CircleCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    error: {
      icon: OctagonX,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    info: {
      icon: Info,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    },
  }[activity.status] || {
    icon: Info,
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
  }

  // Category-based icon
  const CategoryIcon = {
    Files: FileText,
    Security: KeyRound,
    Account: User,
    Settings: Sliders,
    Admin: Shield,
    System: Server,
  }[activity.category] || Info

  const StatusIcon = statusConfig.icon

  // Formatted date and relative time
  let timeAgo = ""
  let fullDate = ""
  try {
    const d = new Date(activity.timestamp)
    timeAgo = formatDistanceToNow(d, { addSuffix: true })
    fullDate = format(d, "MMM d, yyyy 'at' h:mm a")
  } catch {
    timeAgo = activity.timestamp
    fullDate = activity.timestamp
  }

  const hasExtraDetails =
    Boolean(activity.description) ||
    Boolean(activity.device) ||
    Boolean(activity.ipAddress) ||
    Boolean(activity.metadata && Object.keys(activity.metadata).length > 0)

  if (compact) {
    return (
      <div className="flex items-start gap-3 py-2.5 group">
        <div
          className={cn(
            "size-8 shrink-0 rounded-full flex items-center justify-center border mt-0.5",
            statusConfig.bg,
            statusConfig.border
          )}
        >
          <StatusIcon className={cn("size-4", statusConfig.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium truncate text-foreground">
              {activity.title}
            </p>
            <span className="text-[11px] text-muted-foreground shrink-0">
              {timeAgo}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CategoryIcon className="size-3 text-muted-foreground" />
              {activity.category}
            </span>
            {activity.device && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-xs text-muted-foreground truncate">
                  {activity.device}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex gap-4 group">
      {/* Timeline connector line */}
      {showTimelineConnector && (
        <div
          className="absolute left-4 top-10 bottom-0 w-px bg-border group-last:hidden"
          aria-hidden="true"
        />
      )}

      {/* Status Icon Node */}
      <div
        className={cn(
          "relative z-10 size-8 shrink-0 rounded-full flex items-center justify-center border shadow-2xs transition-transform group-hover:scale-110",
          statusConfig.bg,
          statusConfig.border
        )}
      >
        <StatusIcon className={cn("size-4", statusConfig.color)} />
      </div>

      {/* Activity Card Body */}
      <div className="flex-1 pb-6 min-w-0">
        <div
          className={cn(
            "p-4 rounded-xl border bg-card/60 transition-all hover:border-border hover:bg-card hover:shadow-xs",
            expanded && "border-primary/30 shadow-xs"
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {activity.title}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border",
                  activity.category === "Security" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                  activity.category === "Files" && "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                  activity.category === "Account" && "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                  activity.category === "Settings" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                  activity.category === "Admin" && "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
                  activity.category === "System" && "bg-muted text-muted-foreground border-border"
                )}
              >
                <CategoryIcon className="size-3" />
                {activity.category}
              </span>

              {activity.adminOnly && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-600 border border-teal-500/20">
                  Admin
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
              <span title={fullDate}>{timeAgo}</span>
              {hasExtraDetails && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={expanded ? "Collapse details" : "Expand details"}
                >
                  {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          {activity.description && (
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {activity.description}
            </p>
          )}

          {/* Expandable Details Drawer */}
          {expanded && hasExtraDetails && (
            <div className="mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground animate-in fade-in duration-200">
              {activity.device && (
                <div className="flex items-center gap-2">
                  <Laptop className="size-3.5 text-muted-foreground shrink-0" />
                  <span>Device: <span className="font-medium text-foreground">{activity.device}</span></span>
                </div>
              )}
              {activity.ipAddress && (
                <div className="flex items-center gap-2">
                  <Globe className="size-3.5 text-muted-foreground shrink-0" />
                  <span>IP: <span className="font-medium text-foreground font-mono">{activity.ipAddress}</span></span>
                </div>
              )}
              {activity.metadata &&
                Object.entries(activity.metadata).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Tag className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="capitalize">{key}: <span className="font-medium text-foreground">{String(val)}</span></span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityItem
