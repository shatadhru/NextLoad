"use client"

import React from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DatabaseIcon,
  Code2Icon,
  MailIcon,
  ShieldCheckIcon,
  ArrowUpRightIcon,
  CircleCheckIcon,
  InfoIcon,
  AlertTriangleIcon,
  ServerIcon,
  FilesIcon,
  HardDriveIcon,
  LifeBuoyIcon,
  SettingsIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react"
import { sidebarConfig } from "@/config/sidebar"
import { authClient } from "@/payload/auth/client"
import { useActivities } from "@/lib/activity/activity-service"
import { ActivityTimeline } from "@/components/activity/ActivityTimeline"

export default function DashboardPage() {
  const { data: session } = authClient.useSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin"
  const { activities } = useActivities(isAdmin)

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border bg-gradient-to-r from-primary/5 via-background to-primary/10 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {session?.user?.name || "there"} 👋
            </h1>
            {isAdmin ? (
              <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-600 border border-teal-500/20">
                Administrator
              </span>
            ) : null}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin
              ? "Administrator access active with Payload CMS, API and system controls."
              : "Manage your files, profile settings, and account details in one place."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/files"
            className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5")}
          >
            <PlusIcon className="size-3.5" />
            <span>Upload File</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-1.5")}
          >
            <SettingsIcon className="size-3.5" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sidebarConfig.userStats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                {stat.label}
              </CardDescription>
              {stat.id === "storage" ? (
                <HardDriveIcon className="size-4 text-muted-foreground opacity-60" />
              ) : (
                <FilesIcon className="size-4 text-muted-foreground opacity-60" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change ? (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium text-foreground/80">{stat.change}</span>
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ADMIN STATS SECTION - Only rendered if user is Admin */}
      {isAdmin ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="size-4 text-teal-600" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-teal-600">
              Admin Platform Insights
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sidebarConfig.adminStats.map((stat) => (
              <Card key={stat.id} className="border-teal-500/20 bg-teal-500/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription className="text-sm font-medium text-teal-900 dark:text-teal-200">
                    {stat.label}
                  </CardDescription>
                  <ServerIcon className="size-4 text-teal-600 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-950 dark:text-teal-50">
                    {stat.value}
                  </div>
                  {stat.change ? (
                    <p className="text-xs text-teal-700 dark:text-teal-300 mt-1 font-medium">
                      {stat.change}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {/* Main Content Sections */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Activities */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>
                Latest operations, updates, and account events
              </CardDescription>
            </div>
            <Link
              href="/dashboard/activity"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs gap-1")}
            >
              <span>View All</span>
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities.slice(0, 5)} compact />
          </CardContent>
        </Card>

        {/* Quick Launch Cards */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Shortcuts</CardTitle>
              <CardDescription>
                Frequent actions and tools
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link
                href="/dashboard/files"
                className="group flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FilesIcon className="size-4 text-blue-500" />
                  <div className="text-sm">
                    <div className="font-medium group-hover:text-primary">My Files</div>
                    <div className="text-xs text-muted-foreground">Browse your documents</div>
                  </div>
                </div>
                <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/dashboard/settings"
                className="group flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <SettingsIcon className="size-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium group-hover:text-primary">Profile & Security</div>
                    <div className="text-xs text-muted-foreground">Manage your credentials</div>
                  </div>
                </div>
                <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/dashboard/support"
                className="group flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <LifeBuoyIcon className="size-4 text-emerald-500" />
                  <div className="text-sm">
                    <div className="font-medium group-hover:text-primary">Help Center</div>
                    <div className="text-xs text-muted-foreground">Guides and customer support</div>
                  </div>
                </div>
                <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* ADMIN ONLY SHORTCUTS */}
              {isAdmin ? (
                <>
                  <div className="pt-2">
                    <p className="text-[11px] font-semibold uppercase text-teal-600 tracking-wider mb-2">
                      Admin Quick Links
                    </p>
                  </div>

                  <Link
                    href="/admin"
                    target="_blank"
                    className="group flex items-center justify-between p-3 rounded-lg border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <DatabaseIcon className="size-4 text-teal-600" />
                      <div className="text-sm">
                        <div className="font-medium group-hover:text-primary text-teal-950 dark:text-teal-100">
                          Payload CMS Studio
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Manage collections & media
                        </div>
                      </div>
                    </div>
                    <ArrowUpRightIcon className="size-4 text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>

                  <Link
                    href="/dashboard/users"
                    className="group flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <UsersIcon className="size-4 text-teal-600" />
                      <div className="text-sm">
                        <div className="font-medium group-hover:text-primary">User Management</div>
                        <div className="text-xs text-muted-foreground">Manage user accounts & roles</div>
                      </div>
                    </div>
                    <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <Link
                    href="/api/graphql-playground"
                    target="_blank"
                    className="group flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Code2Icon className="size-4 text-indigo-500" />
                      <div className="text-sm">
                        <div className="font-medium group-hover:text-primary">GraphQL Explorer</div>
                        <div className="text-xs text-muted-foreground">Schema and queries</div>
                      </div>
                    </div>
                    <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <Link
                    href="/dashboard/emails"
                    className="group flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MailIcon className="size-4 text-amber-500" />
                      <div className="text-sm">
                        <div className="font-medium group-hover:text-primary">Email Delivery Logs</div>
                        <div className="text-xs text-muted-foreground">SMTP transmission history</div>
                      </div>
                    </div>
                    <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}