import { describe, it, expect } from "vitest"

import { parseMdoc } from "@/lib/mdoc-parser"
import { CONTENT_MARKER, LEGACY_CONTENT_MARKERS } from "@/lib/constants"

const FRONT_MATTER = `---
title: Sample
publishDate: 2026-01-15
category: tutorial
featured_image: ""
description: A description.
featured: false
---
`

function wrap(body: string, marker: string): string {
  return `${FRONT_MATTER}\n${marker}\n${body}`
}

describe("parseMdoc — content marker", () => {
  it("strips the new English CONTENT_MARKER", () => {
    const raw = wrap("Hello world.", CONTENT_MARKER)
    const { meta, markdown } = parseMdoc(raw)
    expect(meta.title).toBe("Sample")
    expect(meta.category).toBe("tutorial")
    expect(meta.featured).toBe(false)
    expect(markdown).toBe("Hello world.")
  })

  it("strips the legacy Indonesian CONTENT_MARKER (backward-compat)", () => {
    const legacy = LEGACY_CONTENT_MARKERS[0]
    const raw = wrap("Legacy body.", legacy)
    const { meta, markdown } = parseMdoc(raw)
    expect(meta.title).toBe("Sample")
    expect(markdown).toBe("Legacy body.")
  })

  it("returns the whole body when no marker is present", () => {
    const raw = `${FRONT_MATTER}Plain body without any marker.`
    const { markdown } = parseMdoc(raw)
    expect(markdown).toBe("Plain body without any marker.")
  })

  it("strips only the first occurrence of the marker", () => {
    const raw = wrap(
      `Section A\n${CONTENT_MARKER}\nSection B\n${CONTENT_MARKER}\nSection C`,
      CONTENT_MARKER,
    )
    const { markdown } = parseMdoc(raw)
    // After slicing past the first marker, the remaining text begins with
    // the section after it ("Section A") and contains the second marker
    // verbatim (as authored content).
    expect(markdown).toContain("Section A")
    expect(markdown).toContain("Section B")
    expect(markdown).toContain("Section C")
    expect(markdown).toContain(CONTENT_MARKER)
  })

  it("picks the earliest marker when both legacy and new are present", () => {
    const legacy = LEGACY_CONTENT_MARKERS[0]
    const raw = `${FRONT_MATTER}${CONTENT_MARKER}\nold\n${legacy}\nkept`
    const { markdown } = parseMdoc(raw)
    expect(markdown).toBe("old\n<!-- Konten Blog -->\nkept")
  })

  it("handles missing frontmatter and defaults to DEFAULT_META", () => {
    const raw = `${CONTENT_MARKER}\nBody only.`
    const { meta, markdown } = parseMdoc(raw)
    expect(meta.title).toBe("")
    expect(markdown).toBe("Body only.")
  })

  it("parses featured boolean as true when 'true'", () => {
    const fm = `---
title: Featured
publishDate: 2026-01-15
category: tips-trik
featured_image: ""
description: ""
featured: true
---
`
    const { meta } = parseMdoc(`${fm}\n${CONTENT_MARKER}\nbody`)
    expect(meta.featured).toBe(true)
  })
})
