import i18n from "@/i18n"
import type { SupportedLng } from "@/i18n"
import categoriesData from "@/data/categories.json"
import type { BlogMeta, CategoryOption } from "./types"

const CATEGORIES: CategoryOption[] = categoriesData.categories

export { CATEGORIES }

export function getCategoryLabel(
  value: string,
  locale?: string,
): string {
  const cat = CATEGORIES.find((c) => c.value === value)
  if (!cat) return value
  const resolvedLocale = (locale ?? i18n.language ?? "en") as SupportedLng
  return (
    cat.translations[resolvedLocale]?.label ??
    cat.translations.en?.label ??
    cat.value
  )
}

export function getCategoryDescription(
  value: string,
  locale?: string,
): string {
  const cat = CATEGORIES.find((c) => c.value === value)
  if (!cat) return ""
  const resolvedLocale = (locale ?? i18n.language ?? "en") as SupportedLng
  return (
    cat.translations[resolvedLocale]?.description ??
    cat.translations.en?.description ??
    ""
  )
}

export const DEFAULT_META: BlogMeta = {
  title: "",
  publishDate: new Date().toISOString().slice(0, 10),
  category: CATEGORIES[0].value,
  featuredImage: "",
  description: "",
  featured: false,
}

export const CONTENT_MARKER = "<!-- Blog Content -->"

export const LEGACY_CONTENT_MARKERS: readonly string[] = [
  "<!-- Konten Blog -->",
] as const

export const CONTENT_MARKERS: readonly string[] = [
  CONTENT_MARKER,
  ...LEGACY_CONTENT_MARKERS,
]
