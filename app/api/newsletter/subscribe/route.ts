import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const { email, name, source } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Check if subscriber already exists
    const existing = await payload.find({
      collection: 'newsletter',
      where: { email: { equals: email.toLowerCase().trim() } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed to our newsletter! Thank you for being with us.",
      })
    }

    await payload.create({
      collection: 'newsletter',
      data: {
        email: email.toLowerCase().trim(),
        name: name || undefined,
        status: 'subscribed',
        source: source || 'footer',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your inbox for updates.',
    })
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process subscription' },
      { status: 500 }
    )
  }
}
