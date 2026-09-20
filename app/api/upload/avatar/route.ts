import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      )
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files are allowed." },
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
