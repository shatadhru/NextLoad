"use client"

import React from "react"
import { ActivityCategory, ActivityStatus } from "@/lib/activity/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Filter } from "lucide-react"

interface ActivityFiltersProps {
  search: string
  onSearchChange: (val: string) => void
  category: ActivityCategory
  onCategoryChange: (cat: ActivityCategory) => void
  status: ActivityStatus | "All"
  onStatusChange: (status: ActivityStatus | "All") => void
  categoryCounts: Record<ActivityCategory, number>
  onReset: () => void
  isAdmin?: boolean
}

export function ActivityFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  categoryCounts,
  onReset,
  isAdmin = false,
}: ActivityFiltersProps) {
  const categories: ActivityCategory[] = [
    "All",
    "Security",
    "Files",
    "Account",
    "Settings",
    ...(isAdmin ? (["Admin"] as ActivityCategory[]) : []),
  ]

  const statuses: (ActivityStatus | "All")[] = ["All", "success", "info", "warning", "error"]

  const hasActiveFilters = search !== "" || category !== "All" || status !== "All"

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search activities by title, device, or keywords..."
            className="pl-9 pr-9 h-9 text-xs sm:text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="size-3" /> Status:
          </span>
          {statuses.map((st) => (
            <Button
              key={st}
              type="button"
              variant={status === st ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange(st)}
              className="h-8 text-xs capitalize px-2.5"
            >
              {st}
            </Button>
          ))}

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 text-xs text-muted-foreground hover:text-foreground ml-1"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const count = categoryCounts[cat] || 0
          const isActive = category === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted border-border"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ActivityFilters
