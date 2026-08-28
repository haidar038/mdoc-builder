import type { BlogMeta } from "./types"
import { CONTENT_MARKER } from "./constants"

const SCALAR_RE =
  /^(true|false|null|yes|no|on|off|~|\d+|\d+\.\d+|\d{4}-\d{2}-\d{2}.*)$/i

function needsQuoting(value: string): boolean {
  if (value === "") return true
  if (value !== value.trim()) return true
  if (SCALAR_RE.test(value)) return true
  if (/^[!&*?|>%@`"'#,[\]{}]/.test(value)) return true
  if (/:\s|^- |#\s/.test(value)) return true
  return false
}

function quoteYamlString(value: string): string {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  return `"${escaped}"`
}

function yamlString(value: string): string {
  const trimmed = value.trim()
  if (needsQuoting(trimmed)) return quoteYamlString(trimmed)
  return trimmed
}

function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ""

  for (const word of words) {
    if (!current) {
      current = word
    } else if (current.length + 1 + word.length <= width) {
      current += " " + word
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

function formatDescription(desc: string): string {
  const trimmed = desc.trim()
  if (!trimmed) return 'description: ""'

  const wrapped = wrapText(trimmed, 80)
  if (wrapped.length <= 1) {
    return `description: ${yamlString(trimmed)}`
  }

  const folded = wrapped.map((line) => `  ${line}`).join("\n")
  return `description: >-\n${folded}`
}

export function buildFrontmatter(meta: BlogMeta): string {
  const lines: string[] = ["---"]
  lines.push(`title: ${yamlString(meta.title)}`)
  lines.push(`featured_image: ${yamlString(meta.featuredImage)}`)
  lines.push(`category: ${meta.category}`)
  lines.push(formatDescription(meta.description))
  lines.push(`publishDate: ${meta.publishDate}`)
  lines.push(`featured: ${meta.featured ? "true" : "false"}`)
  lines.push("---")
  return lines.join("\n")
}

export function buildMdoc(meta: BlogMeta, markdown: string): string {
  const frontmatter = buildFrontmatter(meta)
  const body = markdown.trim()
  if (!body) return `${frontmatter}\n\n${CONTENT_MARKER}\n`
  return `${frontmatter}\n\n${CONTENT_MARKER}\n${body}\n`
}

export function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "untitled"
  )
}

export function buildFileName(meta: BlogMeta): string {
  const datePart = meta.publishDate || new Date().toISOString().slice(0, 10)
  return `${datePart}-${slugify(meta.title)}.mdoc`
}

export interface ContentStats {
  words: number
  characters: number
  readingTime: number
}

export function getContentStats(markdown: string): ContentStats {
  const text = markdown.trim()
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0
  const characters = text.length
  const readingTime = Math.max(1, Math.ceil(words / 200))
  return { words, characters, readingTime }
}
