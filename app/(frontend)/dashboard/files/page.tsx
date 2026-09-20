"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Files,
  UploadCloud,
  HardDrive,
  ExternalLink,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Database,
  Search,
  Filter,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { authClient } from "@/payload/auth/client"
import { SafeCldImage } from "@/components/ui/SafeCldImage"

export default function FilesPage() {
  const { data: session } = authClient.useSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin"
  const [searchQuery, setSearchQuery] = useState("")

  // Initial demo assets
  const mediaAssets = [
    {
      id: "media-1",
      name: "hero-dashboard-preview.webp",
      type: "image/webp",
      size: "248 KB",
      dimensions: "1920x1080",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      uploadedAt: "Yesterday",
    },
    {
      id: "media-2",
      name: "avatar-shatadhru.jpg",
      type: "image/jpeg",
      size: "84 KB",
      dimensions: "500x500",
      url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
      uploadedAt: "2 days ago",
    },
    {
      id: "media-3",
      name: "nextload-logo-light.svg",
      type: "image/svg+xml",
      size: "12 KB",
      dimensions: "Vector",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      uploadedAt: "Last week",
    },
    {
      id: "media-4",
      name: "system-architecture-diagram.png",
      type: "image/png",
      size: "412 KB",
      dimensions: "1600x900",
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      uploadedAt: "2 weeks ago",
    },
  ]

  const filteredAssets = mediaAssets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <Files className="size-6 text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl font-bold tracking-tight">Files & Media Assets</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Cloudinary-backed storage with automatic optimization, resizing, and global CDN delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Link
              href="/admin/storage-manager"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-1.5 text-xs")}
            >
              <HardDrive className="size-3.5 text-teal-600" />
              <span>Cloudinary Manager</span>
              <ExternalLink className="size-3 opacity-60" />
            </Link>
          ) : null}

          {isAdmin ? (
            <Link
              href="/admin/collections/media"
              className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5 text-xs")}
            >
              <Plus className="size-3.5" />
              <span>Upload New Asset</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/profile"
              className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5 text-xs")}
            >
              <UploadCloud className="size-3.5" />
              <span>Change Avatar</span>
            </Link>
          )}
        </div>
      </div>

      {/* Storage Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 space-y-1 shadow-xs">
          <div className="text-xs text-muted-foreground">Storage Service</div>
          <div className="text-lg font-bold flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 inline-block" />
            <span>Cloudinary CDN</span>
          </div>
          <div className="text-xs text-muted-foreground">Auto-format (f_auto) & auto-quality (q_auto)</div>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-1 shadow-xs">
          <div className="text-xs text-muted-foreground">Media Uploads</div>
          <div className="text-lg font-bold">8,920 Assets</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+142 this week</div>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-1 shadow-xs">
          <div className="text-xs text-muted-foreground">Storage Consumed</div>
          <div className="text-lg font-bold">48.6 GB / 100 GB</div>
          <div className="text-xs text-muted-foreground">48.6% quota used</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media files by name..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm outline-hidden focus:border-primary"
          />
        </div>

        <span className="text-xs text-muted-foreground">
          Showing {filteredAssets.length} asset{filteredAssets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-xl border bg-card overflow-hidden shadow-xs hover:border-primary/50 transition-colors group flex flex-col"
          >
            <div className="relative aspect-video bg-muted/50 overflow-hidden">
              <SafeCldImage
                width={960}
                height={600}
                src={asset.url}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                alt={asset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-xs truncate text-foreground" title={asset.name}>
                  {asset.name}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                  <span>{asset.size}</span>
                  <span>{asset.dimensions}</span>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{asset.uploadedAt}</span>
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-600 dark:text-teal-400 font-semibold hover:underline inline-flex items-center gap-0.5"
                >
                  <span>View</span>
                  <ExternalLink className="size-2.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
