import React from "react"
import { Metadata } from "next"
import { getPageTitle, SiteConfig } from "@/config/site"
import { ProfileSettingsView } from "@/components/dashboard/profile/ProfileSettingsView"

export const metadata: Metadata = {
  title: getPageTitle("profile"),
  description: `Manage your ${SiteConfig.site.name} account profile, credentials, and settings.`,
}

export default function ProfilePage() {
  return <ProfileSettingsView />
}
