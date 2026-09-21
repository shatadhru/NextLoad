"use client"

import React, { ReactNode } from "react"
import Link from "next/link"
import { ChevronRight, ArrowLeft } from "lucide-react"

interface CustomAdminViewWrapperProps {
  title: string
  description?: string
  badge?: string
  children: ReactNode
}

export function CustomAdminViewWrapper({
  title,
  description,
  badge,
  children,
}: CustomAdminViewWrapperProps) {
  return (
    <div
      style={{
        padding: "clamp(16px, 3vw, 32px) clamp(12px, 3vw, 36px)",
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
        color: "var(--theme-elevation-900, #111)",
      }}
    >
      {/* Breadcrumb Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: "var(--theme-elevation-500, #777)",
          marginBottom: "16px",
        }}
      >
        <Link
          href="/admin"
          style={{
            color: "inherit",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <ArrowLeft size={13} />
          <span>Dashboard</span>
        </Link>
        <ChevronRight size={12} opacity={0.5} />
        <span style={{ fontWeight: 600, color: "var(--theme-elevation-800, #333)" }}>{title}</span>
      </div>

      {/* Page Title & Description */}
      <div
        style={{
          marginBottom: "28px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {title}
            </h1>
            {badge && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  backgroundColor: "var(--theme-success-500, #0d9488)",
                  color: "#fff",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p
              style={{
                fontSize: "14px",
                color: "var(--theme-elevation-600, #666)",
                margin: "6px 0 0 0",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div>{children}</div>
    </div>
  )
}

export default CustomAdminViewWrapper
