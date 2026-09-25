import { notFound } from "next/navigation"
import { getPayload } from "payload"
import config from "@/payload/payload.config"
import { ProductDetailClient } from "./ProductDetailClient"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function fetchProduct(slug: string) {
  try {
    const payload = await getPayload({ config })

    // Try by slug first, then by ID
    const bySlug = await payload.find({
      collection: "products",
      depth: 3,
      where: {
        and: [
          { slug: { equals: slug } },
          { _status: { equals: "published" } },
        ],
      },
      limit: 1,
    })

    let product = bySlug.docs[0]

    if (!product) {
      // Try by ID as fallback
      try {
        product = await payload.findByID({
          collection: "products",
          id: slug,
          depth: 3,
        })
      } catch {
        return null
      }
    }

    if (!product) return null

    // Fetch reviews for this product
    const reviewsRes = await payload.find({
      collection: "reviews",
      depth: 0,
      where: {
        and: [
          { product: { equals: product.id } },
          { approved: { equals: true } },
        ],
      },
      limit: 50,
      sort: "-createdAt",
    })

    // Fetch related products (same category)
    const categoryId = product.category
      ? typeof product.category === "object"
        ? product.category.id
        : product.category
      : null

    const relatedRes = await payload.find({
      collection: "products",
      depth: 2,
      limit: 8,
      where: {
        and: [
          { _status: { equals: "published" } },
          { id: { not_equals: product.id } },
          ...(categoryId ? [{ category: { equals: categoryId } }] : []),
        ],
      },
    })

    // Fetch categories for the navbar
    const categoriesRes = await payload.find({
      collection: "categories",
      limit: 50,
      depth: 0,
    })

    return {
      product,
      reviews: reviewsRes.docs.map((r: any) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        rating: r.rating,
        author: r.author,
        verified: r.verified ?? false,
        createdAt: r.createdAt,
      })),
      relatedProducts: relatedRes.docs,
      categories: categoriesRes.docs.map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug || null,
      })),
    }
  } catch (error) {
    console.error("Product detail fetch error:", error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchProduct(slug)
  if (!data) return { title: "Product Not Found" }
  const { product } = data
  const p = product as any
  return {
    title: p.seoTitle || `${product.title} | Shop`,
    description: p.seoDescription || product.description || `Buy ${product.title} online.`,
    openGraph: {
      title: product.title,
      description: product.description ?? "",
    },
  }
}

export const dynamic = "force-dynamic"

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await fetchProduct(slug)

  if (!data) {
    notFound()
  }

  const { product, reviews, relatedProducts, categories } = data

  return (
    <ProductDetailClient
      product={product as any}
      reviews={reviews}
      relatedProducts={relatedProducts as any}
      categories={categories}
    />
  )
}
