"use client"

import React from "react"
import { ActivityStats } from "@/lib/activity/types"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, ShieldCheck, FileCheck, CheckCircle } from "lucide-react"

interface ActivityStatsSummaryProps {
  stats: ActivityStats
}

export function ActivityStatsSummary({ stats }: ActivityStatsSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Activities */}
      <Card className="bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Events</p>
            <p className="text-xl sm:text-2xl font-bold mt-0.5">{stats.total}</p>
          </div>
          <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Activity className="size-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card className="bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Security Audits</p>
            <p className="text-xl sm:text-2xl font-bold mt-0.5">{stats.securityCount}</p>
          </div>
          <div className="size-9 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <ShieldCheck className="size-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* File Operations */}
      <Card className="bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">File Actions</p>
            <p className="text-xl sm:text-2xl font-bold mt-0.5">{stats.filesCount}</p>
          </div>
          <div className="size-9 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <FileCheck className="size-4.5" />
          </div>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card className="bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Success Rate</p>
            <p className="text-xl sm:text-2xl font-bold mt-0.5">{stats.successRate}%</p>
          </div>
          <div className="size-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="size-4.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityStatsSummary
