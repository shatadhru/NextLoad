"use client"

import React, { useMemo } from "react"
import { isToday, isYesterday, isThisWeek } from "date-fns"
import { Activity } from "@/lib/activity/types"
import { ActivityItem } from "./ActivityItem"
import { Clock, Inbox } from "lucide-react"

interface ActivityTimelineProps {
  activities: Activity[]
  compact?: boolean
  emptyMessage?: string
}

export function ActivityTimeline({
  activities,
  compact = false,
  emptyMessage = "No activity records found.",
}: ActivityTimelineProps) {
  // Group activities chronologically
  const groupedActivities = useMemo(() => {
    const groups: {
      label: string
      items: Activity[]
    }[] = [
      { label: "Today", items: [] },
      { label: "Yesterday", items: [] },
      { label: "Earlier this week", items: [] },
      { label: "Older", items: [] },
    ]

    activities.forEach((act) => {
      try {
        const d = new Date(act.timestamp)
        if (isToday(d)) {
          groups[0].items.push(act)
        } else if (isYesterday(d)) {
          groups[1].items.push(act)
        } else if (isThisWeek(d)) {
          groups[2].items.push(act)
        } else {
          groups[3].items.push(act)
        }
      } catch {
        groups[3].items.push(act)
      }
    })

    return groups.filter((g) => g.items.length > 0)
  }, [activities])

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed text-center bg-muted/10">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
          <Inbox className="size-6" />
        </div>
        <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        <p className="text-xs text-muted-foreground mt-1">
          New operations and account events will appear here automatically.
        </p>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="divide-y divide-border/60">
        {activities.map((act) => (
          <ActivityItem key={act.id} activity={act} compact />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {groupedActivities.map((group) => (
        <div key={group.label} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border">
              <Clock className="size-3" />
              {group.label}
            </span>
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground">
              {group.items.length} {group.items.length === 1 ? "event" : "events"}
            </span>
          </div>

          <div className="pl-2 sm:pl-4">
            {group.items.map((act) => (
              <ActivityItem key={act.id} activity={act} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityTimeline
