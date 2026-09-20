import React from "react"
import { Metadata } from "next"
import { getPageTitle } from "@/config/site"
import { ActivitySystemView } from "@/components/activity/ActivitySystemView"

export const metadata: Metadata = {
  title: getPageTitle("activity"),
  description: "View real-time chronological audit events, security checks, file operations, and account changes.",
}

export default function ActivityPage() {
  return <ActivitySystemView />
}
