import { parse as parseYaml } from "yaml"

import { CONTENT_MARKERS, DEFAULT_META } from "@/lib/constants"
import type { BlogMeta } from "@/lib/types"

export interface ParsedMdoc {
  meta: BlogMeta
  markdown: string
}

function toBool(v: unknown): boolean {
  return v === true || v === "true" || v === "yes" || v === 1
}

export function parseMdoc(raw: string): ParsedMdoc {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  let yamlRaw = ""
  let body = raw
  if (fmMatch) {
    yamlRaw = fmMatch[1]
    body = raw.slice(fmMatch[0].length)
  }

  let markerIdx = -1
  let markerLen = 0
  for (const marker of CONTENT_MARKERS) {
    const idx = body.indexOf(marker)
    if (idx !== -1 && (markerIdx === -1 || idx < markerIdx)) {
      markerIdx = idx
      markerLen = marker.length
    }
  }
  if (markerIdx !== -1) body = body.slice(markerIdx + markerLen)

  let data: Record<string, unknown> = {}
  try {
    const parsed = parseYaml(yamlRaw)
    if (parsed && typeof parsed === "object") {
      data = parsed as Record<string, unknown>
    }
  } catch {
    /* YAML invalid → meta default */
  }

  const meta: BlogMeta = {
    ...DEFAULT_META,
    title: typeof data.title === "string" ? data.title : "",
    publishDate:
      typeof data.publishDate === "string"
        ? data.publishDate
        : DEFAULT_META.publishDate,
    category:
      typeof data.category === "string"
        ? data.category
        : DEFAULT_META.category,
    featuredImage:
      typeof data.featured_image === "string" ? data.featured_image : "",
    description:
      typeof data.description === "string" ? data.description : "",
    featured: toBool(data.featured),
  }

  return { meta, markdown: body.replace(/^\r?\n/, "").trim() }
}
