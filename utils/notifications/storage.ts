import fs from "fs"
import path from "path"

export interface BroadcastRecord {
  id: string
  title: string
  message: string
  priority: "info" | "announcement" | "security" | "urgent"
  target: "all" | "specific" | "role" | "bulk"
  targetValue?: string
  channels: ("in_app" | "email")[]
  recipientCount: number
  status: "delivered" | "partial" | "failed"
  actionUrl?: string
  actionText?: string
  sentAt: string
  recipientEmails?: string[]
  readBy?: string[]
}

const DATA_DIR = path.join(process.cwd(), "data", "notifications")
const BROADCAST_FILE = path.join(DATA_DIR, "broadcasts.json")

// In-memory fallback if fs fails
let memoryBroadcasts: BroadcastRecord[] = [
  {
    id: "bc-init-1",
    title: "Welcome to NextLoad 2.0",
    message: "We're excited to announce our major platform update with faster Cloudinary CDN sync, enhanced Better Auth security, and upgraded Payload CMS admin tools.",
    priority: "announcement",
    target: "all",
    targetValue: "All Users",
    channels: ["in_app", "email"],
    recipientCount: 1284,
    status: "delivered",
    actionUrl: "/dashboard",
    actionText: "Explore Features",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    readBy: [],
  },
  {
    id: "bc-init-2",
    title: "Scheduled Maintenance Notification",
    message: "NextLoad will undergo scheduled infrastructure upgrades this Sunday from 02:00 UTC to 03:00 UTC. Temporary service degradation may occur.",
    priority: "urgent",
    target: "all",
    targetValue: "All Users",
    channels: ["in_app", "email"],
    recipientCount: 1284,
    status: "delivered",
    actionUrl: "/dashboard",
    actionText: "Check Status",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    readBy: [],
  },
  {
    id: "bc-init-3",
    title: "Security Notice: Verify Your Recovery Email",
    message: "Please ensure your account recovery email and credentials are up to date in your dashboard settings.",
    priority: "security",
    target: "role",
    targetValue: "Admin Role",
    channels: ["email", "in_app"],
    recipientCount: 4,
    status: "delivered",
    actionUrl: "/dashboard/settings",
    actionText: "Review Security",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    readBy: [],
  },
]

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch (error) {
    console.error("Failed to create notifications data directory:", error)
  }
}

export function getBroadcastHistory(): BroadcastRecord[] {
  try {
    ensureDataDir()
    if (fs.existsSync(BROADCAST_FILE)) {
      const content = fs.readFileSync(BROADCAST_FILE, "utf-8")
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error("Failed to read broadcast history from file, using fallback:", error)
  }
  return memoryBroadcasts
}

export function saveBroadcastRecord(record: BroadcastRecord): void {
  try {
    ensureDataDir()
    const history = getBroadcastHistory()
    const updated = [record, ...history.filter((b) => b.id !== record.id)].slice(0, 100) // keep last 100
    fs.writeFileSync(BROADCAST_FILE, JSON.stringify(updated, null, 2), "utf-8")
    memoryBroadcasts = updated
  } catch (error) {
    console.error("Failed to write broadcast history to file, saving in memory:", error)
    memoryBroadcasts = [record, ...memoryBroadcasts.filter((b) => b.id !== record.id)].slice(0, 100)
  }
}

export function markNotificationAsRead(id: string, userEmail: string): boolean {
  try {
    const history = getBroadcastHistory()
    const emailLower = userEmail.toLowerCase()
    let found = false

    const updated = history.map((item) => {
      if (item.id === id) {
        found = true
        const readBy = item.readBy || []
        if (!readBy.includes(emailLower)) {
          return { ...item, readBy: [...readBy, emailLower] }
        }
      }
      return item
    })

    if (found) {
      ensureDataDir()
      fs.writeFileSync(BROADCAST_FILE, JSON.stringify(updated, null, 2), "utf-8")
      memoryBroadcasts = updated
      return true
    }
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
  }
  return false
}

export function markAllNotificationsAsRead(userEmail: string): boolean {
  try {
    const history = getBroadcastHistory()
    const emailLower = userEmail.toLowerCase()

    const updated = history.map((item) => {
      const readBy = item.readBy || []
      if (!readBy.includes(emailLower)) {
        return { ...item, readBy: [...readBy, emailLower] }
      }
      return item
    })

    ensureDataDir()
    fs.writeFileSync(BROADCAST_FILE, JSON.stringify(updated, null, 2), "utf-8")
    memoryBroadcasts = updated
    return true
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error)
  }
  return false
}
