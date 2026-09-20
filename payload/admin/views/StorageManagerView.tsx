"use client"

import React from "react"
import { CustomAdminViewWrapper } from "../components/CustomAdminViewWrapper"
import { HardDrive, Cloud, Folder, ExternalLink, Image as ImageIcon, ShieldCheck } from "lucide-react"

export function StorageManagerView() {
  const folders = [
    { name: "nextload/avatars", description: "User profile pictures with smart face crop", count: "124 assets", size: "48 MB" },
    { name: "payload-media", description: "Payload CMS uploads and document attachments", count: "842 assets", size: "4.2 GB" },
    { name: "system-cache", description: "Transformed and optimized WebP/AVIF cache", count: "3,100 assets", size: "1.8 GB" },
  ]

  return (
    <CustomAdminViewWrapper
      title="Cloudinary Storage Manager"
      description="Inspect Cloudinary asset distribution, folder buckets, and CDN delivery settings."
      badge="Cloudinary CDN"
    >
      {/* Cloud Status Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          padding: "20px 24px",
          borderRadius: "10px",
          border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
          backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "rgba(13, 148, 136, 0.12)",
              color: "var(--theme-success-500, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Cloud size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Cloud Name: dccbp4dpb</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "1px 6px", borderRadius: "4px" }}>
                ACTIVE CDN
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)", marginTop: "2px" }}>
              Encrypted API Key: 433195912561124 • Automatic format &amp; quality transformations enabled
            </div>
          </div>
        </div>

        <a
          href="https://cloudinary.com/console"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid var(--theme-elevation-250, #ccc)",
            backgroundColor: "var(--theme-elevation-100, #fff)",
            color: "var(--theme-elevation-800, #333)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>Cloudinary Console</span>
          <ExternalLink size={12} opacity={0.6} />
        </a>
      </div>

      {/* Folders List */}
      <h3 style={{ margin: "0 0 14px 0", fontSize: "16px", fontWeight: 600 }}>Media Buckets &amp; Folders</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {folders.map((f) => (
          <div
            key={f.name}
            style={{
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
              backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Folder size={18} style={{ color: "var(--theme-success-500, #0d9488)" }} />
              <span style={{ fontWeight: 600, fontSize: "14px", fontFamily: "monospace" }}>{f.name}</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--theme-elevation-600, #666)", margin: "0 0 12px 0" }}>
              {f.description}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--theme-elevation-700, #555)",
                paddingTop: "8px",
                borderTop: "1px solid var(--theme-elevation-100, rgba(0,0,0,0.05))",
              }}
            >
              <span>{f.count}</span>
              <span>{f.size}</span>
            </div>
          </div>
        ))}
      </div>
    </CustomAdminViewWrapper>
  )
}

export default StorageManagerView
