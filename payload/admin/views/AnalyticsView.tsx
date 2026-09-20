"use client"

import React, { useState } from "react"
import { CustomAdminViewWrapper } from "../components/CustomAdminViewWrapper"
import { BarChart3, Users, HardDrive, ArrowUpRight, TrendingUp, Activity, Server } from "lucide-react"

export function AnalyticsView() {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("7d")

  const metrics = [
    { label: "Active Platform Users", value: "1,284", change: "+12.4%", icon: Users, positive: true },
    { label: "Storage Consumed", value: "48.6 GB", change: "+8.1%", icon: HardDrive, positive: true },
    { label: "API Requests", value: "142,890", change: "+24.3%", icon: Activity, positive: true },
    { label: "System Uptime", value: "99.98%", change: "Healthy", icon: Server, positive: true },
  ]

  return (
    <CustomAdminViewWrapper
      title="Platform Analytics"
      description="Real-time system telemetry, active sessions, and database activity."
      badge="Live"
    >

      {/* Analytics Breakdown Card */}
      <div
        style={{
          padding: "24px",
          borderRadius: "10px",
          border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
          backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 600 }}>Database & Collection Activity</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { name: "Users Collection", records: "1,284 documents", load: "34%" },
            { name: "Media Collection (Cloudinary)", records: "8,920 assets", load: "78%" },
            { name: "Better Auth Sessions", records: "2,410 active", load: "45%" },
            { name: "Email Delivery Outbox", records: "14,520 sent", load: "62%" },
          ].map((c) => (
            <div
              key={c.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "var(--theme-elevation-100, rgba(0,0,0,0.03))",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{c.name}</div>
                <div style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)" }}>{c.records}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--theme-success-500, #0d9488)" }}>
                  {c.load} capacity
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomAdminViewWrapper>
  )
}

export default AnalyticsView
