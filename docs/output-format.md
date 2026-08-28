# mdoc output format

This document specifies the `.mdoc` file format produced by mdoc-builder and
consumed by [Keystatic](https://keystatic.com/) (and any downstream static
site generator that reads Keystatic-style content collections).

The specification is the source of truth for cross-tool compatibility. If
the implementation in `src/lib/frontmatter.ts` ever drifts from this
document, treat that as a bug and update either the code or this file so
they match.

## 1. Overview

A `.mdoc` file is a single Markdown file with a YAML frontmatter block at
the top, followed by an HTML comment marker, followed by the body content
in CommonMark + GFM. It is the on-disk representation of a single blog
post entry in a Keystatic content collection.

mdoc-builder produces these files from a structured metadata form and a
rich-text editor. The goal of the format is to be:

- **Human-editable** in any text editor.
- **Round-trippable** — importing a `.mdoc` produced by this tool back into
  mdoc-builder should yield an equivalent form state and editor state.
- **Framework-agnostic downstream** — once produced, the file is plain
  Markdown + YAML and can be consumed by Astro, Next.js, Hugo, Eleventy, or
  any other static site generator that supports Keystatic's content layer
  or standard frontmatter.

## 2. File structure

```
---
[frontmatter fields]
---

<!-- Blog Content -->

[markdown body]
```

Three sections, top to bottom:

1. **YAML frontmatter** — a `---`-delimited block at the very top of the
   file containing the post metadata.
2. **Content marker** — the literal HTML comment `<!-- Blog Content -->`
   on its own line. Separates frontmatter from body and is required by
   Keystatic's parser. mdoc-builder always emits it, even when the body is
   empty.
3. **Body** — CommonMark + GFM Markdown. May be empty.

## 3. Frontmatter fields

The order below is the order in which mdoc-builder emits the fields. It is
stable; downstream tools should not depend on field order but mdoc-builder
keeps it consistent so that diffs are readable.

| Field           | Type      | Required | Default                                  | Notes                                                                                |
| --------------- | --------- | -------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `title`         | string    | yes      | `""`                                     | Non-empty title is required to enable download in the UI.                            |
| `featured_image`| string    | no       | `""`                                     | Absolute URL. The UI validates with `new URL()` and warns on invalid input.          |
| `category`      | string    | no       | first entry of `src/data/categories.json`| Must match a `value` from the categories list, otherwise the UI select will be empty. |
| `description`   | string    | no       | `""`                                     | Auto-formatted as a YAML block scalar (`>-`) when longer than one line. See §5.       |
| `publishDate`   | string    | no       | today's date (`YYYY-MM-DD`)              | Validated against `^\d{4}-\d{2}-\d{2}$` and a parseable `Date`.                      |
| `featured`      | boolean   | no       | `false`                                  | Emitted as `true` / `false` (lowercase) per strict YAML.                             |

Source of truth: `BlogMeta` in `src/lib/types.ts:9` and `DEFAULT_META` in
`src/lib/constants.ts:12`.

### Examples

```yaml
title: "Panduan Web Dev 2026"
featured_image: ""
category: tutorial
description: ""
publishDate: 2026-08-28
featured: false
```

```yaml
title: "Tips & Trick"
featured_image: "https://example.com/cover.png"
category: tips-trik
description: >-
  Ringkasan singkat yang menarik untuk blog post
  ini, diformat sebagai block scalar.
publishDate: 2026-08-28
featured: true
```

## 4. Validation rules

The metadata form in `src/components/form/meta-form.tsx` enforces these
rules client-side. They are non-blocking for editing (the user can still
type freely) but **title blocks download** when empty.

| Field            | Rule                                                            | Behavior                                |
| ---------------- | --------------------------------------------------------------- | --------------------------------------- |
| `title`          | Must be non-empty after `trim()`                                | Blocks **Download** action.             |
| `publishDate`    | Match `^\d{4}-\d{2}-\d{2}$` and parse as a valid `Date`         | Inline warning when invalid.            |
| `featured_image` | Parse with `new URL(value)`                                     | Inline warning when invalid; no block.  |
| `category`       | Must be one of the `value` strings in `categories.json`         | Selected from a dropdown — no free text.|
| `featured`       | Boolean                                                         | Toggle switch.                          |
| `description`    | Free text; auto-formatted as YAML block scalar when wrapping.  | No validation; format only.             |

Importing an existing `.mdoc` does not re-validate; whatever the file
contained is loaded back into the form. Validation only runs while the
user is editing.

## 5. Description formatting

mdoc-builder wraps long descriptions in a YAML block scalar with the
**folded** style indicator `>-` so line breaks in the form become single
spaces in the rendered output (matching how most static site generators
treat the `description` field).

Rules, from `formatDescription` in `src/lib/frontmatter.ts:46`:

- If the trimmed description is empty, the field is emitted as
  `description: ""`.
- If it fits in a single line of ≤ 80 characters, it is emitted inline:
  `description: Some short text.`
- Otherwise it is wrapped to 80 columns and emitted as:
  ```yaml
  description: >-
    Wrapped line one
    Wrapped line two
  ```

The `>-` indicator means "folded, strip final newline"; the resulting
string in Keystatic collapses internal line breaks into spaces, which is
what you want for a one-paragraph summary.

## 6. Content marker

The literal string `<!-- Blog Content -->` separates frontmatter from body.
It is defined as `CONTENT_MARKER` in `src/lib/constants.ts:47`.

- **Always emitted** by `buildMdoc` (`src/lib/frontmatter.ts:71`), even when
  the body is empty. An empty post therefore looks like:
  ```md
  ---
  title: ""
  ...
  ---

  <!-- Blog Content -->
  ```
- **Stripped on import** before the body is parsed. If you import a `.mdoc`
  that has a body containing the substring `Blog Content` outside the
  marker, it will be preserved as regular content. Only the dedicated
  marker line is treated as a separator.
- **Never edit manually** unless you are intentionally breaking a
  round-trip — Keystatic and the importer both rely on it.

### 6.1 Legacy marker compatibility

For backward compatibility with files produced by earlier versions of
mdoc-builder, the importer also accepts the legacy marker
`<!-- Konten Blog -->` (Indonesian). The set of recognised markers lives
in `CONTENT_MARKERS` at `src/lib/constants.ts:53`, and the parser walks
them in order, taking the **first occurrence** of any match
(`src/lib/mdoc-parser.ts:24`). New files always emit the current English
marker (`<!-- Blog Content -->`); old files using `<!-- Konten Blog -->`
still round-trip correctly.

## 7. Body Markdown

The body uses **CommonMark** with **GitHub-Flavored Markdown** (GFM)
extensions enabled by the Tiptap editor.

Supported nodes (Tiptap extensions configured in
`src/components/editor/mdoc-editor.tsx`):

- Paragraphs.
- Headings — levels 1, 2, and 3 only.
- Marks: **bold**, *italic*, ~~strikethrough~~, `inline code`, and links.
- Lists: bullet (`-`), ordered (`1.`), and task (`- [ ]` / `- [x]`).
- Blockquote.
- Fenced code block with a language tag (e.g. ` ```ts `).
- Horizontal rule (`---`).
- Image (inserted via URL dialog or paste-of-image-URL detection).
- Hard break (`Shift+Enter`).
- GFM tables.

Anything not in this list is **not** preserved on a round-trip — the
importer uses the same Tiptap schema, so unsupported nodes (e.g. HTML
blocks, raw HTML) will be dropped or treated as plain text.

## 8. File naming

When you click **Download**, the file is named:

```
{publishDate}-{slug}.mdoc
```

- `publishDate` is the form value (or today's date if empty), in
  `YYYY-MM-DD` form.
- `slug` comes from `slugify(title)` in `src/lib/frontmatter.ts:78`, with
  these rules:
  1. Unicode NFD normalize, then strip combining diacritics
     (`\u0300-\u036f`).
  2. Lowercase.
  3. Trim.
  4. Drop any character that is not a word character, whitespace, or `-`.
  5. Collapse runs of whitespace, `_`, and `-` into a single `-`.
  6. Strip leading and trailing `-`.
  7. Truncate to 80 characters.
  8. If the result is empty, fall back to the literal string `untitled`.

Example: `Panduan Web Dev 2026!` → `panduan-web-dev-2026`.

The filename is **advisory**; the content is what matters. You are free to
rename files in your content collection as long as Keystatic's slug
configuration matches.

## 9. Example

A complete, realistic `.mdoc` file:

```markdown
---
title: "Panduan Web Dev 2026"
featured_image: "https://example.com/cover.png"
category: tutorial
description: >-
  Roadmap langkah demi langkah untuk menjadi web
  developer di tahun 2026, dari fundamental hingga
  spesialisasi.
publishDate: 2026-08-28
featured: true
---

<!-- Blog Content -->

# Pendahuluan

Tahun 2026 membawa perubahan baru di ekosistem web. Post ini merangkum
roadmap yang saya rekomendasikan untuk **junior developer** yang ingin
naik level.

## Prasyarat

- HTML & CSS dasar.
- JavaScript modern (ES2023+).
- Familiar dengan terminal.

## Checklist

- [ ] Pelajari TypeScript
- [ ] Pahami React 19
- [ ] Eksplorasi Vite 8
- [x] Setup environment lokal

## Tabel alat

| Alat       | Versi | Catatan                  |
| ---------- | ----- | ------------------------ |
| Node.js    | 20.x  | LTS                      |
| Vite       | 8.x   | Dev server cepat         |
| TypeScript | 6.x   | Strict mode              |

```ts
export function hello(name: string): string {
  return `Hello, ${name}!`
}
```

> Lihat dokumentasi resmi masing-masing alat untuk detail instalasi.
```

## 10. Compatibility

- **Keystatic** — Keystatic's content layer reads `.mdoc` files using
  the `<!-- Blog Content -->` marker. The field names above match a
  Keystatic `collection` schema with the same field names. To wire this
  up in Keystatic, declare a collection whose `slugField` is `title` and
  whose schema fields match the table in §3.
- **Static site generators** — Astro, Next.js (with `@keystatic/next`),
  Hugo, Eleventy, and any framework that reads Markdown with YAML
  frontmatter can consume the file. The body is plain Markdown.
- **Round-tripping** — re-importing a `.mdoc` produced by mdoc-builder
  into mdoc-builder restores the form state from the frontmatter and the
  editor state from the body. See `src/lib/mdoc-parser.ts` for the parser
  implementation.

## 11. Customization

To add a new field to the frontmatter:

1. **Type** — extend the `BlogMeta` interface in
   `src/lib/types.ts:9` with the new field and its TypeScript type.
2. **Default** — add a default value in `DEFAULT_META` in
   `src/lib/constants.ts:12`.
3. **Serializer** — update `buildFrontmatter` in
   `src/lib/frontmatter.ts:59` to emit the new field. Reuse
   `yamlString(...)` for safe quoting, or add a new formatter if the
   field needs a non-scalar shape.
4. **Parser** — extend the parser in `src/lib/mdoc-parser.ts` to read the
   new field back during import.
5. **UI** — add the matching input to
   `src/components/form/meta-form.tsx` and add validation rules if the
   field is required.
6. **Rebuild** — run `npm run build` and `npm run test:run` to confirm
   nothing regressed.

If the new field is required, also update §3 and §4 of this document so
the specification stays in sync.

## 12. Categories

Categories are externalized in `src/data/categories.json` so they can be
edited without touching the source. The schema is:

```ts
interface CategoryTranslation {
  label: string       // Human-readable label shown in the UI
  description: string // Helper text shown to the editor
}

interface CategoryOption {
  value: string                          // Stable identifier written to `category` frontmatter
  translations: Record<string, CategoryTranslation>  // Locale code → translation
}
```

The file contains a `categories` array of these objects. The first entry
becomes the default selection in the form (see `DEFAULT_META` in
`src/lib/constants.ts:12`). The `translations` object must contain at
least an `en` entry (English is the fallback locale); `id` and any
future locale is optional. Labels and descriptions are resolved at
runtime by `getCategoryLabel` and `getCategoryDescription` in
`src/lib/constants.ts:10`.

To add, remove, or edit a category:

1. Edit `src/data/categories.json`.
2. Run `npm run build` to pick up the change (Vite imports the JSON at
   build time).
3. If you remove a category that is already in use, the form's
   `getCategoryLabel` helper falls back to displaying the raw `value`
   string (`src/lib/constants.ts:8`).
