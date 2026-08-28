import { describe, it, expect } from "vitest"

import {
  buildFileName,
  buildFrontmatter,
  buildMdoc,
  getContentStats,
  slugify,
} from "@/lib/frontmatter"
import { CONTENT_MARKER, DEFAULT_META } from "@/lib/constants"
import type { BlogMeta } from "@/lib/types"

function makeMeta(overrides: Partial<BlogMeta> = {}): BlogMeta {
  return { ...DEFAULT_META, ...overrides }
}

describe("slugify", () => {
  it("lowercases and replaces spaces with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world")
  })

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world")
  })

  it("collapses multiple separators", () => {
    expect(slugify("foo --- bar")).toBe("foo-bar")
    expect(slugify("foo___bar")).toBe("foo-bar")
  })

  it("strips leading and trailing dashes", () => {
    expect(slugify("---hello---")).toBe("hello")
  })

  it("normalizes diacritics (café → cafe)", () => {
    expect(slugify("café")).toBe("cafe")
  })

  it("normalizes diacritics (Jalapeño → jalapeno)", () => {
    expect(slugify("Jalapeño")).toBe("jalapeno")
  })

  it("returns untitled for empty string", () => {
    expect(slugify("")).toBe("untitled")
  })

  it("returns untitled for whitespace only", () => {
    expect(slugify("   ")).toBe("untitled")
  })

  it("returns untitled for pure non-Latin (emoji)", () => {
    expect(slugify("🎉🎊")).toBe("untitled")
  })

  it("returns untitled for pure CJK", () => {
    expect(slugify("你好世界")).toBe("untitled")
  })

  it("truncates to 80 characters", () => {
    const long = "a".repeat(200)
    expect(slugify(long).length).toBe(80)
  })

  it("handles Indonesian text with diacritics", () => {
    expect(slugify("Béla Négo")).toBe("bela-nego")
  })
})

describe("buildFrontmatter", () => {
  it("starts and ends with ---", () => {
    const out = buildFrontmatter(makeMeta({ title: "Hi" }))
    expect(out.startsWith("---")).toBe(true)
    expect(out.endsWith("---")).toBe(true)
  })

  it("includes all fields", () => {
    const meta = makeMeta({
      title: "My Post",
      featuredImage: "https://example.com/img.png",
      category: "tech",
      description: "desc",
      publishDate: "2026-01-15",
      featured: true,
    })
    const out = buildFrontmatter(meta)
    expect(out).toContain("title: My Post")
    expect(out).toContain("featured_image: https://example.com/img.png")
    expect(out).toContain("category: tech")
    expect(out).toContain("publishDate: 2026-01-15")
    expect(out).toContain("featured: true")
  })

  it("quotes special characters in title", () => {
    const out = buildFrontmatter(makeMeta({ title: "Title: with colon" }))
    expect(out).toContain('title: "Title: with colon"')
  })

  it("quotes title starting with hash", () => {
    const out = buildFrontmatter(makeMeta({ title: "# heading" }))
    expect(out).toContain('title: "# heading"')
  })

  it("handles empty fields", () => {
    const out = buildFrontmatter(
      makeMeta({ title: "", featuredImage: "", description: "" })
    )
    expect(out).toContain('title: ""')
    expect(out).toContain('featured_image: ""')
    expect(out).toContain('description: ""')
  })

  it("uses block scalar for multiline description", () => {
    const desc = "lorem ipsum ".repeat(20)
    const out = buildFrontmatter(makeMeta({ description: desc }))
    expect(out).toContain("description: >-")
  })

  it("renders featured: false correctly", () => {
    const out = buildFrontmatter(makeMeta({ featured: false }))
    expect(out).toContain("featured: false")
  })
})

describe("buildMdoc", () => {
  it("includes CONTENT_MARKER", () => {
    const out = buildMdoc(makeMeta({ title: "T" }), "body")
    expect(out).toContain(CONTENT_MARKER)
  })

  it("includes body after marker", () => {
    const out = buildMdoc(makeMeta({ title: "T" }), "Hello world")
    expect(out).toContain("Hello world")
  })

  it("handles empty body", () => {
    const out = buildMdoc(makeMeta({ title: "T" }), "")
    expect(out).toContain(CONTENT_MARKER)
    expect(out.endsWith("\n")).toBe(true)
  })

  it("structure: frontmatter then marker then body", () => {
    const out = buildMdoc(makeMeta({ title: "T" }), "body text")
    const markerIdx = out.indexOf(CONTENT_MARKER)
    const fmEndIdx = out.indexOf("---", 3) + 3
    expect(markerIdx).toBeGreaterThan(fmEndIdx)
    const afterMarker = out.slice(markerIdx + CONTENT_MARKER.length)
    expect(afterMarker.trim()).toBe("body text")
  })
})

describe("buildFileName", () => {
  it("formats as {date}-{slug}.mdoc", () => {
    const meta = makeMeta({ title: "Hello World", publishDate: "2026-03-15" })
    expect(buildFileName(meta)).toBe("2026-03-15-hello-world.mdoc")
  })

  it("falls back to today when no date", () => {
    const meta = makeMeta({ title: "Test", publishDate: "" })
    const today = new Date().toISOString().slice(0, 10)
    expect(buildFileName(meta)).toBe(`${today}-test.mdoc`)
  })

  it("uses untitled for empty title", () => {
    const meta = makeMeta({ title: "", publishDate: "2026-01-01" })
    expect(buildFileName(meta)).toBe("2026-01-01-untitled.mdoc")
  })
})

describe("getContentStats", () => {
  it("counts words", () => {
    expect(getContentStats("one two three").words).toBe(3)
  })

  it("counts characters", () => {
    expect(getContentStats("hello").characters).toBe(5)
  })

  it("handles empty string", () => {
    const stats = getContentStats("")
    expect(stats.words).toBe(0)
    expect(stats.characters).toBe(0)
    expect(stats.readingTime).toBe(1)
  })

  it("calculates reading time (200 wpm)", () => {
    const text = "word ".repeat(250).trim()
    expect(getContentStats(text).readingTime).toBe(2)
  })
})
