import type { JSONContent } from "@tiptap/react"

export interface CategoryTranslation {
  label: string
  description: string
}

export interface CategoryOption {
  value: string
  translations: {
    en: CategoryTranslation
    id: CategoryTranslation
  }
}

export interface BlogMeta {
  title: string
  publishDate: string
  category: string
  featuredImage: string
  description: string
  featured: boolean
}

export interface BlogFormState {
  meta: BlogMeta
  content: JSONContent
}

export type GenerateMode = "realtime" | "manual"
