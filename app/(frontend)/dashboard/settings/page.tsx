import React from "react"
import { Metadata } from "next"
import { getPageTitle, SiteConfig } from "@/config/site"
import { SettingsView } from "@/components/dashboard/settings/SettingsView"

export const metadata: Metadata = {
  title: getPageTitle("settings"),
  description: `Configure your ${SiteConfig.site.name} interface theme, credentials, notifications, and storage preferences.`,
}

export default function SettingsPage() {
  return <SettingsView />
}
