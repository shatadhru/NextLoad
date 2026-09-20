"use client"

import React from "react"
import { CustomAdminViewWrapper } from "../components/CustomAdminViewWrapper"
import { FileText, BookOpen, CheckCircle, Code, Shield, HardDrive, Terminal } from "lucide-react"

export function ReadMeViewBro() {
  return (
    <CustomAdminViewWrapper
      title="Documentation & ReadMe"
      description="NextLoad platform architectural documentation, API references, and admin guide."
      badge="Docs"
    >
      {/* Overview Card */}
      <div
        style={{
          padding: "24px",
          borderRadius: "10px",
          border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
          backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <BookOpen size={22} style={{ color: "var(--theme-success-500, #0d9488)" }} />
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>NextLoad Platform Architecture</h2>
        </div>
        <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--theme-elevation-700, #555)", margin: 0 }}>
          NextLoad is an enterprise-grade full-stack platform built with <strong>Next.js 16 (App Router)</strong>, 
          <strong> Payload CMS 3.0</strong>, <strong>Better Auth</strong>, and <strong>Cloudinary CDN</strong>.
        </p>
      </div>

      {/* Guide Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {/* Card 1 */}
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
            backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Shield size={18} style={{ color: "var(--theme-success-500, #0d9488)" }} />
            <span style={{ fontWeight: 600, fontSize: "14px" }}>Authentication System</span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--theme-elevation-600, #666)", lineHeight: "1.5" }}>
            Powered by Better Auth with MongoDB adapter via Payload. Supports email/password, Google OAuth, and secure session management.
          </p>
        </div>

        {/* Card 2 */}
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
            backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <HardDrive size={18} style={{ color: "var(--theme-success-500, #0d9488)" }} />
            <span style={{ fontWeight: 600, fontSize: "14px" }}>Cloudinary Storage</span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--theme-elevation-600, #666)", lineHeight: "1.5" }}>
            Avatars and media uploads are processed through signed Cloudinary endpoints with automatic face-detection crop and format optimization.
          </p>
        </div>

        {/* Card 3 */}
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
            backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Code size={18} style={{ color: "var(--theme-success-500, #0d9488)" }} />
            <span style={{ fontWeight: 600, fontSize: "14px" }}>Custom Admin Views</span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--theme-elevation-600, #666)", lineHeight: "1.5" }}>
            Add new tools easily by updating <code>config/adminCustomComponents.ts</code> and running <code>pnpm generate:importmap</code>.
          </p>
        </div>
      </div>
    </CustomAdminViewWrapper>
  )
}

export default ReadMeViewBro
