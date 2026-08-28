import type { JSONContent } from "@tiptap/react"

interface Mark {
  type: string
  attrs?: Record<string, unknown>
}

function escapeInline(text: string): string {
  return text.replace(/([\\`*_[\]]|#)/g, "\\$1")
}

function serializeMarks(text: string, marks: Mark[]): string {
  if (!text) return ""

  const code = marks.find((m) => m.type === "code")
  if (code) {
    return "`" + text + "`"
  }

  let out = escapeInline(text)
  const link = marks.find((m) => m.type === "link")

  if (marks.some((m) => m.type === "bold")) out = `**${out}**`
  if (marks.some((m) => m.type === "italic")) out = `*${out}*`
  if (marks.some((m) => m.type === "strike")) out = `~~${out}~~`

  if (link) {
    const href = String(link.attrs?.href ?? "")
    const title = link.attrs?.title ? ` "${String(link.attrs.title)}"` : ""
    out = `[${out}](${href}${title})`
  }

  return out
}

function serializeInline(content?: JSONContent[]): string {
  if (!content) return ""
  return content
    .map((node) => {
      if (node.type === "hardBreak") return "\n"
      if (node.type === "text") return serializeMarks(node.text ?? "", node.marks ?? [])
      if (node.type === "image") {
        const src = String(node.attrs?.src ?? "")
        const alt = String(node.attrs?.alt ?? "")
        return `![${alt}](${src})`
      }
      return serializeMarks(node.text ?? "", node.marks ?? [])
    })
    .join("")
}

function nodeText(node: JSONContent): string {
  if (!node.content) return ""
  return node.content.map((n) => n.text ?? "").join("")
}

function serializeList(node: JSONContent, depth: number, ordered: boolean): string {
  const items = node.content ?? []
  const indent = "  ".repeat(depth)
  const lines: string[] = []

  items.forEach((item, index) => {
    const marker = ordered ? `${index + 1}. ` : "- "
    const children = item.content ?? []
    const blocks: string[] = []
    const nested: string[] = []

    for (const child of children) {
      if (child.type === "bulletList" || child.type === "orderedList") {
        nested.push(
          serializeList(child, depth + 1, child.type === "orderedList")
        )
      } else {
        blocks.push(serializeBlock(child, depth))
      }
    }

    const body = blocks.join("\n" + "  ".repeat(depth + 1))
    lines.push(`${indent}${marker}${body}`)
    nested.forEach((n) => lines.push(n))
  })

  return lines.join("\n")
}

function serializeTaskList(node: JSONContent, depth: number): string {
  const items = node.content ?? []
  const indent = "  ".repeat(depth)
  const lines: string[] = []

  for (const item of items) {
    if (item.type !== "taskItem") continue
    const checked = Boolean(item.attrs?.checked)
    const marker = `${indent}- [${checked ? "x" : " "}] `
    const children = item.content ?? []
    const blocks: string[] = []
    const nested: string[] = []

    for (const child of children) {
      if (child.type === "taskList") {
        nested.push(serializeTaskList(child, depth + 1))
      } else if (child.type === "bulletList" || child.type === "orderedList") {
        nested.push(
          serializeList(child, depth + 1, child.type === "orderedList")
        )
      } else {
        blocks.push(serializeBlock(child, depth))
      }
    }

    const body = blocks.join("\n" + "  ".repeat(depth + 1))
    lines.push(`${marker}${body}`)
    nested.forEach((n) => lines.push(n))
  }

  return lines.join("\n")
}

function serializeCell(cell: JSONContent): string {
  const blocks = (cell.content ?? []).map((block) => serializeBlock(block, 0))
  return blocks.join("<br>").replace(/\|/g, "\\|")
}

function serializeTable(node: JSONContent): string {
  const rows = node.content ?? []
  if (rows.length === 0) return ""

  const allRows = rows.map((row) => {
    const cells = (row.content ?? []).map(serializeCell)
    return `| ${cells.join(" | ")} |`
  })

  const colCount = Math.max(...rows.map((row) => row.content?.length ?? 0))
  const separator = `| ${Array(colCount).fill("---").join(" | ")} |`

  const firstRowCells = rows[0].content ?? []
  const hasHeader = firstRowCells.some((c) => c.type === "tableHeader")

  if (hasHeader) {
    return [allRows[0], separator, ...allRows.slice(1)].join("\n")
  }

  const emptyHeader = `| ${Array(colCount).fill("").join(" | ")} |`
  return [emptyHeader, separator, ...allRows].join("\n")
}

function serializeBlock(node: JSONContent, depth: number): string {
  switch (node.type) {
    case "paragraph":
      return serializeInline(node.content)
    case "heading": {
      const level = Number(node.attrs?.level ?? 1)
      return `${"#".repeat(level)} ${serializeInline(node.content)}`
    }
    case "bulletList":
      return serializeList(node, depth, false)
    case "orderedList":
      return serializeList(node, depth, true)
    case "taskList":
      return serializeTaskList(node, depth)
    case "table":
      return serializeTable(node)
    case "blockquote": {
      const inner = serializeBlocks(node.content, depth)
      return inner
        .split("\n")
        .map((line) => (line ? `> ${line}` : ">"))
        .join("\n")
    }
    case "codeBlock": {
      const lang = String(node.attrs?.language ?? "")
      return "```" + lang + "\n" + nodeText(node) + "\n```"
    }
    case "horizontalRule":
      return "---"
    case "image": {
      const src = String(node.attrs?.src ?? "")
      const alt = String(node.attrs?.alt ?? "")
      return `![${alt}](${src})`
    }
    default:
      return serializeInline(node.content)
  }
}

function serializeBlocks(content: JSONContent[] | undefined, depth: number): string {
  if (!content) return ""
  return content.map((node) => serializeBlock(node, depth)).join("\n\n")
}

export function serializeToMarkdown(doc: JSONContent): string {
  const out = serializeBlocks(doc.content, 0)
  return out.trim()
}
