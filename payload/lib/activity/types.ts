export type ActivityCategory =
  | "All"
  | "Security"
  | "Files"
  | "Account"
  | "Settings"
  | "System"
  | "Admin"

export type ActivityStatus = "success" | "warning" | "error" | "info"

export type ActivityType =
  | "login"
  | "logout"
  | "password_change"
  | "profile_update"
  | "avatar_update"
  | "file_upload"
  | "file_delete"
  | "file_download"
  | "settings_update"
  | "session_revoke"
  | "system_event"
  | "admin_action"

export interface Activity {
  id: string
  title: string
  description?: string
  category: "Security" | "Files" | "Account" | "Settings" | "System" | "Admin"
  type: ActivityType
  status: ActivityStatus
  timestamp: string // ISO string or parsable date
  ipAddress?: string
  device?: string
  adminOnly?: boolean
  metadata?: Record<string, string | number | boolean>
}

export interface ActivityFilterState {
  search: string
  category: ActivityCategory
  status: ActivityStatus | "All"
  dateRange?: "all" | "today" | "week" | "month"
}

export interface ActivityStats {
  total: number
  securityCount: number
  filesCount: number
  successRate: number
  latestTimestamp?: string
}

export interface CreateActivityInput {
  title: string
  description?: string
  category?: "Security" | "Files" | "Account" | "Settings" | "System" | "Admin"
  type?: ActivityType
  status?: ActivityStatus
  timestamp?: string
  ipAddress?: string
  device?: string
  adminOnly?: boolean
  metadata?: Record<string, string | number | boolean>
}
