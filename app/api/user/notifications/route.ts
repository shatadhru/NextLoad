import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { getServerSession } from "@delmaredigital/payload-better-auth"
import {
  getBroadcastHistory,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  dismissNotificationForUser,
  dismissAllNotificationsForUser,
} from "@/utils/notifications/storage"

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, req.headers)

    // Strictly authenticate the user from server session — do not trust client query params
    const email = session?.user?.email?.toLowerCase() || ""
    const role = ((session?.user as { role?: string })?.role || "user").toLowerCase()

    const allBroadcasts = getBroadcastHistory()

    // Filter only in_app notifications and exclude those deleted/dismissed by this user
    const inAppBroadcasts = allBroadcasts.filter(
      (b) => b.channels?.includes("in_app") && (!email || !b.deletedBy?.includes(email))
    )

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
        imageUrl: b.imageUrl,
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
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, req.headers)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. You must be signed in to modify notification status." },
        { status: 401 }
      )
    }

    // Always enforce the authenticated user's session email to eliminate IDOR vulnerabilities
    const email = session.user.email.toLowerCase()
    const body = await req.json()
    const { action, id } = body

    if (action === "mark_read" && id) {
      markNotificationAsRead(id, email)
      return NextResponse.json({ success: true, message: "Marked notification as read" })
    }

    if (action === "mark_all_read") {
      markAllNotificationsAsRead(email)
      return NextResponse.json({ success: true, message: "Marked all notifications as read" })
    }

    if ((action === "delete" || action === "dismiss") && id) {
      dismissNotificationForUser(id, email)
      return NextResponse.json({ success: true, message: "Notification removed" })
    }

    if (action === "delete_all" || action === "clear_all") {
      dismissAllNotificationsForUser(email)
      return NextResponse.json({ success: true, message: "All notifications cleared" })
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

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, req.headers)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. You must be signed in to delete notifications." },
        { status: 401 }
      )
    }

    // Always enforce the authenticated user's session email
    const email = session.user.email.toLowerCase()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (id) {
      dismissNotificationForUser(id, email)
      return NextResponse.json({ success: true, message: "Notification deleted successfully." })
    }

    dismissAllNotificationsForUser(email)
    return NextResponse.json({ success: true, message: "All notifications cleared successfully." })
  } catch (error: any) {
    console.error("DELETE /api/user/notifications error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to delete notification" },
      { status: 500 }
    )
  }
}

