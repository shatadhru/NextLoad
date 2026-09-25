import { Suspense } from "react"
import { getPayload } from "payload"
import config from "@/payload/payload.config"
import { StoreClient } from "./StoreClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop | Browse All Products",
  description: "Browse our curated collection of premium products. Filter by category, price, and more.",
}

export const dynamic = "force-dynamic"
export const revalidate = 60

async function fetchStoreData() {
  try {
    const payload = await getPayload({ config })

    const [productsRes, categoriesRes] = await Promise.all([
      payload.find({
        collection: "products",
        limit: 100,
        depth: 2,
        where: {
          _status: { equals: "published" },
        },
        sort: "-createdAt",
      }),
      payload.find({
        collection: "categories",
        limit: 50,
        depth: 0,
      }),
    ])

    const products = productsRes.docs
    const categories = categoriesRes.docs.map((c) => ({
      id: c.id,
      title: c.title,
      slug: (c as any).slug || null,
    }))

    const featuredProducts = products.filter((p: any) => p.isFeatured)

    return { products, categories, featuredProducts }
  } catch (error) {
    console.error("Store page fetch error:", error)
    return { products: [], categories: [], featuredProducts: [] }
  }
}

export default async function StorePage() {
  const { products, categories, featuredProducts } = await fetchStoreData()

  return (
    <Suspense>
      <StoreClient
        initialProducts={products as any}
        categories={categories}
        featuredProducts={featuredProducts as any}
      />
    </Suspense>
  )
}
