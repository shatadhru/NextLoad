export interface BlogMedia {
  id?: string
  url?: string
  alt?: string
  width?: number
  height?: number
  cloudinary?: {
    secure_url?: string
    public_id?: string
  }
}

export interface BlogAuthor {
  id: string
  name?: string | null
  email?: string
  image?: string | null
}

export interface BlogCategory {
  id: string
  title: string
  slug: string
  description?: string | null
}

export interface BlogTag {
  id: string
  title: string
  slug: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: any
  featuredImage?: BlogMedia | string | null
  author?: BlogAuthor | string | null
  category?: BlogCategory | string | null
  tags?: (BlogTag | string)[] | null
  status: 'draft' | 'published'
  visibility: 'public' | 'private' | 'unlisted'
  publishDate?: string
  readingTime?: number
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  canonicalUrl?: string | null
  ogImage?: BlogMedia | string | null
  createdAt: string
  updatedAt: string
}
