import { describe, it, expect } from "vitest"

import { serializeToMarkdown } from "@/lib/markdown"
import type { JSONContent } from "@tiptap/react"

function p(...content: JSONContent[]): JSONContent {
  return { type: "paragraph", content }
}

function text(value: string, marks?: { type: string; attrs?: Record<string, unknown> }[]): JSONContent {
  return { type: "text", text: value, marks }
}

function doc(...content: JSONContent[]): JSONContent {
  return { type: "doc", content }
}

describe("serializeToMarkdown — inline", () => {
  it("serializes paragraph", () => {
    expect(serializeToMarkdown(doc(p(text("hello"))))).toBe("hello")
  })

  it("serializes bold text", () => {
    expect(serializeToMarkdown(doc(p(text("hi", [{ type: "bold" }]))))).toBe("**hi**")
  })

  it("serializes italic text", () => {
    expect(serializeToMarkdown(doc(p(text("hi", [{ type: "italic" }]))))).toBe("*hi*")
  })

  it("serializes strikethrough text", () => {
    expect(serializeToMarkdown(doc(p(text("hi", [{ type: "strike" }]))))).toBe("~~hi~~")
  })

  it("serializes inline code", () => {
    expect(serializeToMarkdown(doc(p(text("hi", [{ type: "code" }]))))).toBe("`hi`")
  })

  it("serializes link", () => {
    expect(
      serializeToMarkdown(
        doc(
          p(
            text("click", [
              { type: "link", attrs: { href: "https://example.com" } },
            ])
          )
        )
      )
    ).toBe("[click](https://example.com)")
  })

  it("serializes link with title", () => {
    expect(
      serializeToMarkdown(
        doc(
          p(
            text("click", [
              {
                type: "link",
                attrs: { href: "https://example.com", title: "Example" },
              },
            ])
          )
        )
      )
    ).toBe('[click](https://example.com "Example")')
  })

  it("serializes combined marks", () => {
    expect(
      serializeToMarkdown(
        doc(p(text("hi", [{ type: "bold" }, { type: "italic" }])))
      )
    ).toBe("***hi***")
  })
})

describe("serializeToMarkdown — blocks", () => {
  it("serializes heading 1", () => {
    expect(
      serializeToMarkdown(doc({ type: "heading", attrs: { level: 1 }, content: [text("Title")] }))
    ).toBe("# Title")
  })

  it("serializes heading 2", () => {
    expect(
      serializeToMarkdown(doc({ type: "heading", attrs: { level: 2 }, content: [text("Title")] }))
    ).toBe("## Title")
  })

  it("serializes heading 3", () => {
    expect(
      serializeToMarkdown(doc({ type: "heading", attrs: { level: 3 }, content: [text("Title")] }))
    ).toBe("### Title")
  })

  it("serializes blockquote", () => {
    expect(
      serializeToMarkdown(doc({ type: "blockquote", content: [p(text("quoted"))] }))
    ).toBe("> quoted")
  })

  it("serializes code block with language", () => {
    expect(
      serializeToMarkdown(
        doc({
          type: "codeBlock",
          attrs: { language: "js" },
          content: [text("const x = 1")],
        })
      )
    ).toBe("```js\nconst x = 1\n```")
  })

  it("serializes code block without language", () => {
    expect(
      serializeToMarkdown(
        doc({ type: "codeBlock", content: [text("plain")] })
      )
    ).toBe("```\nplain\n```")
  })

  it("serializes horizontal rule", () => {
    expect(serializeToMarkdown(doc({ type: "horizontalRule" }))).toBe("---")
  })

  it("serializes image (block)", () => {
    expect(
      serializeToMarkdown(
        doc({
          type: "image",
          attrs: { src: "https://example.com/a.png", alt: "Alt" },
        })
      )
    ).toBe("![Alt](https://example.com/a.png)")
  })

  it("serializes hard break", () => {
    const hardBreak: JSONContent = { type: "hardBreak" }
    const para: JSONContent = p(text("a"), hardBreak, text("b"))
    expect(serializeToMarkdown(doc(para))).toBe("a\nb")
  })
})

describe("serializeToMarkdown — lists", () => {
  it("serializes bullet list", () => {
    expect(
      serializeToMarkdown(
        doc({
          type: "bulletList",
          content: [
            { type: "listItem", content: [p(text("a"))] },
            { type: "listItem", content: [p(text("b"))] },
          ],
        })
      )
    ).toBe("- a\n- b")
  })

  it("serializes ordered list", () => {
    expect(
      serializeToMarkdown(
        doc({
          type: "orderedList",
          content: [
            { type: "listItem", content: [p(text("a"))] },
            { type: "listItem", content: [p(text("b"))] },
          ],
        })
      )
    ).toBe("1. a\n2. b")
  })

  it("serializes nested bullet list", () => {
    expect(
      serializeToMarkdown(
        doc({
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                p(text("a")),
                {
                  type: "bulletList",
                  content: [{ type: "listItem", content: [p(text("b"))] }],
                },
              ],
            },
          ],
        })
      )
    ).toBe("- a\n  - b")
  })
})

describe("serializeToMarkdown — table", () => {
  it("serializes 2x2 table with header", () => {
    const table: JSONContent = {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            { type: "tableHeader", content: [p(text("H1"))] },
            { type: "tableHeader", content: [p(text("H2"))] },
          ],
        },
        {
          type: "tableRow",
          content: [
            { type: "tableCell", content: [p(text("a"))] },
            { type: "tableCell", content: [p(text("b"))] },
          ],
        },
      ],
    }
    const out = serializeToMarkdown(doc(table))
    expect(out).toContain("| H1 | H2 |")
    expect(out).toContain("| --- | --- |")
    expect(out).toContain("| a | b |")
  })

  it("creates empty header row when no tableHeader cells", () => {
    const table: JSONContent = {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            { type: "tableCell", content: [p(text("a"))] },
            { type: "tableCell", content: [p(text("b"))] },
          ],
        },
      ],
    }
    const out = serializeToMarkdown(doc(table))
    const lines = out.split("\n")
    expect(lines[0]).toBe("|  |  |")
    expect(lines[1]).toBe("| --- | --- |")
    expect(lines[2]).toBe("| a | b |")
  })

  it("escapes pipe characters in cells", () => {
    const table: JSONContent = {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            { type: "tableHeader", content: [p(text("H"))] },
          ],
        },
        {
          type: "tableRow",
          content: [
            { type: "tableCell", content: [p(text("a|b"))] },
          ],
        },
      ],
    }
    expect(serializeToMarkdown(doc(table))).toContain("a\\|b")
  })
})

describe("serializeToMarkdown — task list", () => {
  it("serializes unchecked task", () => {
    expect(
      serializeToMarkdown(
        doc({
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [p(text("do it"))],
            },
          ],
        })
      )
    ).toBe("- [ ] do it")
  })

  it("serializes checked task", () => {
    expect(
      serializeToMarkdown(
        doc({
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [p(text("done"))],
            },
          ],
        })
      )
    ).toBe("- [x] done")
  })

  it("serializes mixed task list", () => {
    expect(
      serializeToMarkdown(
        doc({
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [p(text("a"))],
            },
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [p(text("b"))],
            },
          ],
        })
      )
    ).toBe("- [x] a\n- [ ] b")
  })

  it("serializes nested task list", () => {
    expect(
      serializeToMarkdown(
        doc({
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                p(text("parent")),
                {
                  type: "taskList",
                  content: [
                    {
                      type: "taskItem",
                      attrs: { checked: true },
                      content: [p(text("child"))],
                    },
                  ],
                },
              ],
            },
          ],
        })
      )
    ).toBe("- [ ] parent\n  - [x] child")
  })
})

describe("serializeToMarkdown — edge cases", () => {
  it("handles empty doc", () => {
    expect(serializeToMarkdown(doc())).toBe("")
  })

  it("joins blocks with double newline", () => {
    expect(
      serializeToMarkdown(
        doc(p(text("a")), p(text("b")))
      )
    ).toBe("a\n\nb")
  })

  it("handles multiple headings", () => {
    expect(
      serializeToMarkdown(
        doc(
          { type: "heading", attrs: { level: 1 }, content: [text("A")] },
          { type: "heading", attrs: { level: 2 }, content: [text("B")] }
        )
      )
    ).toBe("# A\n\n## B")
  })
})
