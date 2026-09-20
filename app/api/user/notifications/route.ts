import { NextRequest, NextResponse } from "next/server"
import {
  getBroadcastHistory,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/utils/notifications/storage"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")?.toLowerCase() || ""
    const role = searchParams.get("role")?.toLowerCase() || "user"

    const allBroadcasts = getBroadcastHistory()

    // Filter only in_app notifications
    const inAppBroadcasts = allBroadcasts.filter((b) => b.channels?.includes("in_app"))

    // If email is provided, filter specifically for this user; otherwise return public/all broadcasts
    const userNotifications = inAppBroadcasts
      .filter((b) => {
        if (!email) return b.target === "all"

        if (b.target === "all") return true
        if (b.target === "role") {
          return b.targetValue?.toLowerCase().includes(role) || false
        }
        if (b.target === "specific") {
          return (
            b.targetValue?.toLowerCase() === email ||
            b.recipientEmails?.includes(email) ||
            false
          )
        }
        if (b.target === "bulk") {
          return b.recipientEmails?.includes(email) || false
        }
        return false
      })
      .map((b) => ({
        id: b.id,
        title: b.title,
        message: b.message,
        priority: b.priority,
        actionUrl: b.actionUrl,
        actionText: b.actionText,
        sentAt: b.sentAt,
        isRead: email ? b.readBy?.includes(email) ?? false : false,
      }))

    const unreadCount = userNotifications.filter((n) => !n.isRead).length

    return NextResponse.json({
      success: true,
      notifications: userNotifications,
      unreadCount,
    })
  } catch (error: any) {
    console.error("GET /api/user/notifications error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch user notifications" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, id, email } = body

    if (!email) {
      return NextResponse.json({ error: "User email is required." }, { status: 400 })
    }

    if (action === "mark_read" && id) {
      markNotificationAsRead(id, email)
      return NextResponse.json({ success: true, message: "Marked notification as read" })
    }

    if (action === "mark_all_read") {
      markAllNotificationsAsRead(email)
      return NextResponse.json({ success: true, message: "Marked all notifications as read" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("POST /api/user/notifications error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update notification status" },
      { status: 500 }
    )
  }
}
