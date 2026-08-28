import type { JSONContent } from "@tiptap/react"

import type { BlogMeta } from "@/lib/types"

const KEY = "mdoc-builder:draft:v1"

export interface Draft {
  meta: BlogMeta
  content: JSONContent
}

export interface LoadRequest {
  html: string
  nonce: number
}

export function loadDraft(): Draft | null {
  try {
    if (typeof localStorage === "undefined") return null
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Draft>
    if (!parsed?.meta || !parsed?.content) return null
    return parsed as Draft
  } catch {
    return null
  }
}

export function saveDraft(draft: Draft): void {
  try {
    if (typeof localStorage === "undefined") return
    localStorage.setItem(KEY, JSON.stringify(draft))
  } catch {
    /* storage penuh / disabled — abaikan */
  }
}

export function clearDraft(): void {
  try {
    if (typeof localStorage === "undefined") return
    localStorage.removeItem(KEY)
  } catch {
    /* abaikan */
  }
}
