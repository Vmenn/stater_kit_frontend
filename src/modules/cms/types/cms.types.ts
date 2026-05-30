export interface CmsContent {
  id: string
  title: string
  slug: string
  body: string
  excerpt?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  metaTitle?: string
  metaDescription?: string
  featuredImage?: string
  authorId: string
  authorName?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateContentRequest {
  title: string
  slug: string
  body: string
  excerpt?: string
  status: CmsContent['status']
  metaTitle?: string
  metaDescription?: string
  featuredImage?: string
}

export type UpdateContentRequest = Partial<CreateContentRequest>
