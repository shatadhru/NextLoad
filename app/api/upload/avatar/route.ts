import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { getPayload } from "payload"
import config from "@payload-config"
import { getServerSession } from "@delmaredigital/payload-better-auth"

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const session = await getServerSession(payload, req.headers)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. You must be signed in to upload an avatar." },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      )
    }

    const ALLOWED_MIME_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ]
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF images are allowed." },
        { status: 400 }
      )
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      )
    }

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME
    const apiKey =
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary configuration is incomplete on the server." },
        { status: 500 }
      )
    }

    const timestamp = Math.round(Date.now() / 1000)
    const folder = "nextload/avatars"
    // Professional face-centered avatar crop with auto format and auto quality
    const transformation = "c_fill,g_face,w_500,h_500,q_auto,f_auto"

    const paramsToSign = `folder=${folder}&timestamp=${timestamp}&transformation=${transformation}${apiSecret}`
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign)
      .digest("hex")

    const uploadFormData = new FormData()
    uploadFormData.append("file", file)
    uploadFormData.append("api_key", apiKey)
    uploadFormData.append("timestamp", timestamp.toString())
    uploadFormData.append("signature", signature)
    uploadFormData.append("folder", folder)
    uploadFormData.append("transformation", transformation)

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    )

    const data = await cloudinaryResponse.json()

    if (!cloudinaryResponse.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Failed to upload image to Cloudinary." },
        { status: cloudinaryResponse.status }
      )
    }

    // Return the professional CDN URL
    return NextResponse.json({
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error occurred."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
