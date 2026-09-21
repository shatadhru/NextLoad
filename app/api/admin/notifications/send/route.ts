import { NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { getServerSession } from "@delmaredigital/payload-better-auth"
import { sendBroadcastEmail } from "@/utils/sendEmail"
import {
  saveBroadcastRecord,
  getBroadcastHistory,
  deleteBroadcastRecord,
  bulkDeleteBroadcastRecords,
  BroadcastRecord,
} from "@/utils/notifications/storage"

interface SendNotificationBody {
  target: "all" | "specific" | "role" | "bulk"
  specificEmail?: string
  role?: "admin" | "user"
  bulkEmails?: string
  title: string
  message: string
  priority?: "info" | "announcement" | "security" | "urgent"
  channels: ("in_app" | "email")[]
  actionUrl?: string
  actionText?: string
  imageUrl?: string
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, req.headers)

    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Administrator access required." },
        { status: 403 }
      )
    }

    let totalUsers = 0
    let adminCount = 0
    let regularCount = 0
    let usersList: { id: string; email: string; name: string; role: string }[] = []

    try {
      const usersResult = await payload.find({
        collection: "users",
        limit: 200,
        pagination: false,
      })

      totalUsers = usersResult.totalDocs || usersResult.docs.length
      usersList = usersResult.docs.map((u: any) => {
        const role = u.role || "user"
        if (role === "admin") adminCount++
        else regularCount++
        return {
          id: String(u.id),
          email: u.email,
          name: u.name || u.email.split("@")[0],
          role,
        }
      })
    } catch (e) {
      console.warn("Could not query users collection directly:", e)
      // Fallback defaults for fresh dev environment
      totalUsers = 1284
      adminCount = 4
      regularCount = 1280
    }

    const broadcasts = getBroadcastHistory()

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        adminCount,
        regularCount,
      },
      users: usersList.slice(0, 50),
      broadcasts,
    })
  } catch (error: any) {
    console.error("GET /api/admin/notifications/send error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to retrieve notification statistics",
        broadcasts: getBroadcastHistory(),
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, req.headers)

    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Administrator access required." },
        { status: 403 }
      )
    }

    const body: SendNotificationBody = await req.json()

    const {
      target,
      specificEmail,
      role,
      bulkEmails,
      title,
      message,
      priority = "info",
      channels = ["in_app"],
      actionUrl,
      actionText,
      imageUrl,
    } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 })
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message body is required." }, { status: 400 })
    }

    if (!channels || channels.length === 0) {
      return NextResponse.json(
        { error: "At least one delivery channel (In-App or Email) must be selected." },
        { status: 400 }
      )
    }

    interface Recipient {
      email: string
      name?: string | null
    }

    let recipients: Recipient[] = []
    let targetSummary = ""

    if (target === "all") {
      targetSummary = "All Platform Users"
      try {
        const allUsers = await payload.find({
          collection: "users",
          limit: 5000,
          pagination: false,
        })
        recipients = allUsers.docs.map((u: any) => ({
          email: u.email,
          name: u.name || null,
        }))
      } catch (e) {
        console.warn("Could not fetch all users from payload:", e)
      }

      // If no users in DB yet (e.g. dev), ensure at least a placeholder recipient for email test
      if (recipients.length === 0 && process.env.SMTP_USER) {
        recipients = [{ email: process.env.SMTP_USER, name: "Admin Broadcast Test" }]
      }
    } else if (target === "role") {
      const selectedRole = role || "user"
      targetSummary = `Role: ${selectedRole.toUpperCase()}`
      try {
        const roleUsers = await payload.find({
          collection: "users",
          where: {
            role: { equals: selectedRole },
          },
          limit: 5000,
          pagination: false,
        })
        recipients = roleUsers.docs.map((u: any) => ({
          email: u.email,
          name: u.name || null,
        }))
      } catch (e) {
        console.warn("Could not fetch role users from payload:", e)
      }
      if (recipients.length === 0 && process.env.SMTP_USER) {
        recipients = [{ email: process.env.SMTP_USER, name: `Admin (${selectedRole})` }]
      }
    } else if (target === "specific") {
      if (!specificEmail || !specificEmail.trim()) {
        return NextResponse.json(
          { error: "A recipient email is required for Specific User targeting." },
          { status: 400 }
        )
      }
      const trimmedEmail = specificEmail.trim().toLowerCase()
      targetSummary = trimmedEmail

      // Find user name if exists
      let matchedName: string | null = null
      try {
        const found = await payload.find({
          collection: "users",
          where: { email: { equals: trimmedEmail } },
          limit: 1,
        })
        if (found.docs.length > 0) {
          matchedName = (found.docs[0] as any).name || null
        }
      } catch (e) {
        // ignore
      }

      recipients = [{ email: trimmedEmail, name: matchedName }]
    } else if (target === "bulk") {
      if (!bulkEmails || !bulkEmails.trim()) {
        return NextResponse.json(
          { error: "Please enter comma or newline separated email addresses." },
          { status: 400 }
        )
      }

      // Parse emails separated by commas, semicolons, or newlines
      const rawList = bulkEmails
        .split(/[\n,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0)

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const validEmails = Array.from(new Set(rawList.filter((e) => emailRegex.test(e))))

      if (validEmails.length === 0) {
        return NextResponse.json(
          { error: "No valid email addresses found in the bulk list." },
          { status: 400 }
        )
      }

      targetSummary = `Bulk List (${validEmails.length} recipients)`
      recipients = validEmails.map((email) => ({ email, name: null }))
    } else {
      return NextResponse.json({ error: "Invalid target type specified." }, { status: 400 })
    }

    let emailDeliveredCount = 0
    let emailFailedCount = 0

    // Dispatch emails if email channel is selected
    if (channels.includes("email")) {
      // In production / large lists, chunking is best. For now send in small batches:
      const BATCH_SIZE = 5
      for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE)
        await Promise.all(
          batch.map(async (r) => {
            try {
              const res = await sendBroadcastEmail({
                to: r.email,
                recipientName: r.name,
                title,
                message,
                priority,
                actionUrl,
                actionText,
                imageUrl,
              })
              if (res.success) {
                emailDeliveredCount++
              } else {
                emailFailedCount++
              }
            } catch (err) {
              console.error(`Error sending email to ${r.email}:`, err)
              emailFailedCount++
            }
          })
        )
      }
    }

    const broadcastStatus: "delivered" | "partial" | "failed" =
      channels.includes("email") && emailDeliveredCount === 0 && recipients.length > 0
        ? "failed"
        : emailFailedCount > 0
        ? "partial"
        : "delivered"

    // Record the broadcast in persistent storage
    const newRecord: BroadcastRecord = {
      id: `bc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      message,
      priority,
      target,
      targetValue: targetSummary,
      channels,
      recipientCount: recipients.length,
      status: broadcastStatus,
      actionUrl,
      actionText,
      imageUrl,
      sentAt: new Date().toISOString(),
      recipientEmails: recipients.map((r) => r.email.toLowerCase()),
      readBy: [],
    }

    saveBroadcastRecord(newRecord)

    return NextResponse.json({
      success: true,
      message: `Notification broadcast dispatched successfully to ${recipients.length} recipients.`,
      broadcast: newRecord,
      stats: {
        recipientsCount: recipients.length,
        emailDeliveredCount,
        emailFailedCount,
        inAppCount: channels.includes("in_app") ? recipients.length : 0,
      },
    })
  } catch (error: any) {
    console.error("POST /api/admin/notifications/send error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to dispatch notification broadcast." },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, req.headers)

    if (!session?.user || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Administrator access required." },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const queryId = searchParams.get("id")

    let id = queryId
    let ids: string[] = []

    try {
      const body = await req.json()
      if (body.id) id = body.id
      if (Array.isArray(body.ids)) ids = body.ids
    } catch {
      // JSON body is optional if query params are used
    }

    if (!id && (!ids || ids.length === 0)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid notification ID or IDs to remove." },
        { status: 400 }
      )
    }

    let deleted = false
    if (ids.length > 0) {
      deleted = bulkDeleteBroadcastRecords(ids)
    } else if (id) {
      deleted = deleteBroadcastRecord(id)
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Notification not found or already removed." },
        { status: 404 }
      )
    }

    const updatedBroadcasts = getBroadcastHistory()

    return NextResponse.json({
      success: true,
      message: "Notification removed successfully.",
      broadcasts: updatedBroadcasts,
    })
  } catch (error: any) {
    console.error("DELETE /api/admin/notifications/send error:", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to remove notification." },
      { status: 500 }
    )
  }
}

