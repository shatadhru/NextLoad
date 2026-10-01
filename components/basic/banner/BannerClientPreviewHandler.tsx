"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { NoticeBanner, BannerData } from "./NoticeBanner"

interface Props {
  initialBanner: BannerData | null
  children: React.ReactNode
}

function BannerClientPreviewContent({ initialBanner, children }: Props) {
  const searchParams = useSearchParams()
  const previewId = searchParams.get("previewBanner")
  const [previewBanner, setPreviewBanner] = useState<BannerData | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false)

  useEffect(() => {
    if (!previewId) {
      setPreviewBanner(null)
      return
    }

    setIsLoadingPreview(true)
    fetch(`/api/banners/active?id=${encodeURIComponent(previewId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.banner) {
          setPreviewBanner(data.banner)
        }
      })
      .catch((err) => {
        console.error("Failed to load banner preview:", err)
      })
      .finally(() => {
        setIsLoadingPreview(false)
      })
  }, [previewId])

  if (previewId && previewBanner) {
    return (
      <>
        {/* Visual indicator that this is a live admin preview */}
        <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-900 dark:text-amber-200 text-[11px] px-3 py-1 flex items-center justify-between z-50">
          <span>
            ⚠️ <strong>Admin Preview Mode:</strong> Viewing banner <em>&quot;{previewBanner.title}&quot;</em>
          </span>
          <button
            type="button"
            onClick={() => {
              const url = new URL(window.location.href)
              url.searchParams.delete("previewBanner")
              window.location.href = url.pathname + (url.search ? url.search : "")
            }}
            className="underline font-semibold hover:opacity-80 cursor-pointer"
          >
            Exit Preview
          </button>
        </div>
        <NoticeBanner banner={previewBanner} />
      </>
    )
  }

  return <>{children}</>
}

export function BannerClientPreviewHandler(props: Props) {
  return (
    <Suspense fallback={<>{props.children}</>}>
      <BannerClientPreviewContent {...props} />
    </Suspense>
  )
}

export default BannerClientPreviewHandler
