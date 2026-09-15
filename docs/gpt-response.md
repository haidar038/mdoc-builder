Ya. Saya sudah cek repo **`haidar038/mdoc-builder`** langsung di GitHub, termasuk README, struktur source, `package.json`, parser `.mdoc`, dan spesifikasi output-nya. ([GitHub][1])

## Kesimpulan utama

**Tool ini relevan dan genuinely useful, tetapi bukan untuk “semua developer”.** Nilainya tinggi untuk developer yang memakai **Keystatic + Astro/static content workflow**, dan lebih rendah untuk developer yang cuma menulis Markdown biasa.

Yang menurut saya menarik justru **problem yang diselesaikan cukup spesifik dan jelas**:

> mengubah proses penulisan konten dari “harus paham syntax Markdown + YAML frontmatter” menjadi editor visual yang tetap menghasilkan file `.mdoc` yang kompatibel dengan content pipeline.

Repo tersebut memang mendeskripsikan dirinya sebagai browser-based WYSIWYG editor untuk menghasilkan `.mdoc` yang dapat langsung dimasukkan ke content collection Keystatic. Aplikasi berjalan sepenuhnya di browser, tanpa backend/account/network call, dan menyimpan draft di `localStorage`. ([GitHub][1])

---

# 1. Sebenarnya tool ini menawarkan apa?

Core feature-nya adalah **`.mdoc` authoring tool**.

Flow-nya kira-kira:

```text
Metadata
   ↓
Rich Text Editor
   ↓
Markdown/GFM serialization
   ↓
YAML frontmatter
   ↓
.mdoc file
```

Metadata yang ditangani mencakup:

* title
* publish date
* category
* featured image
* description
* featured flag

Kemudian body menggunakan Tiptap dan mendukung:

* headings
* bold/italic/strike
* links
* lists
* blockquote
* inline code
* code block
* images
* horizontal rule
* tables
* task lists
* undo/redo

Ada juga preview **Source** dan **HTML**, content statistics, dark/light mode, responsive layout, import `.mdoc`, serta copy/download. ([GitHub][1])

Jadi ini bukan sekadar:

> "textbox yang convert text ke Markdown."

Lebih tepat disebut:

> **visual `.mdoc` authoring environment.**

---

# 2. Bagian yang menurut saya paling valuable: round-trip editing

Ada satu fitur yang cukup penting tetapi gampang diremehkan:

**import existing `.mdoc` → edit secara visual → generate kembali.**

Repo memiliki parser khusus untuk membaca YAML frontmatter dan body Markdown, lalu mengembalikannya ke state editor. ([GitHub][2])

Artinya workflow-nya bisa:

```text
existing.mdoc
      ↓
   Import
      ↓
Visual Editor
      ↓
Edit
      ↓
Generate
      ↓
updated.mdoc
```

Ini jauh lebih useful daripada converter satu arah.

Dan spesifikasi repo sendiri memang secara eksplisit mendesain format tersebut agar **round-trippable**. ([GitHub][3])

---

# 3. Kenapa `.mdoc` sendiri relevan?

Karena `.mdoc` bukan format random yang dibuat repo ini.

Keystatic memang mendukung penyimpanan content dalam beberapa format termasuk YAML, JSON, Markdoc dan MDX; ketika memakai document/Markdoc/MDX field, Keystatic dapat menghasilkan file `.mdoc`/`.mdx`. Dengan `format.contentField`, metadata dan content juga dapat disimpan dalam satu file `.mdoc`. ([Keystatic][4])

Contoh konseptual:

```text
blog/
└── my-first-post.mdoc
```

yang isinya:

```md
---
title: My First Post
publishedDate: 2026-08-28
---

Ini adalah content.
```

Astro sendiri mendokumentasikan workflow Keystatic yang menghasilkan `.mdoc` di content directory. ([GitHub][5])

Jadi **fondasi masalah yang diselesaikan repo ini memang real**.

---

# 4. Tapi ada limitation besar

Ini penting.

**Scope tool ini sangat niche.**

Kalau seorang developer menggunakan:

* plain Markdown
* MDX
* Hugo
* Jekyll
* Eleventy
* Docusaurus
* Next.js content
* Contentlayer-like workflow
* CMS seperti Sanity/Contentful
* database-backed CMS

maka `mdoc-builder` belum tentu memberikan value besar.

Karena developer tersebut mungkin cukup menggunakan:

```text
VS Code
+
Markdown
+
frontmatter
```

dan selesai.

Bahkan README sendiri mengakui bahwa tool ini **opinionated** dan target utamanya adalah Keystatic/static-site workflow. ([GitHub][1])

Jadi saya tidak akan memposisikannya sebagai:

> "Markdown editor for developers."

Itu terlalu generic dan membuat value proposition-nya melemah.

Saya akan memposisikannya sebagai:

> **A visual `.mdoc` editor for Keystatic-powered content workflows.**

Itu jauh lebih tajam.

---

# 5. Apakah ini berguna bagi developer?

Saya kasih penilaian seperti ini:

| Target user                               | Usefulness |
| ----------------------------------------- | ---------: |
| Keystatic developer                       |   **9/10** |
| Astro + Keystatic developer               |   **9/10** |
| Static-site developer                     |   **6/10** |
| Markdown-heavy developer                  |   **6/10** |
| Documentation writer                      |   **5/10** |
| Backend developer                         |   **2/10** |
| Developer yang tidak menggunakan Markdown |   **1/10** |

Masalahnya bukan tool-nya kurang bagus.

Masalahnya adalah **market/problem-nya sempit**.

Dan sebenarnya itu bukan hal buruk. Untuk open-source tool, niche yang jelas malah bisa lebih sehat daripada mencoba menyelesaikan semuanya.

---

# 6. Dari sisi engineering, repo ini cukup proper

Saya juga melihat bahwa repo ini tidak sekadar prototype UI.

Stack-nya cukup modern:

```text
React 19
Vite 8
TypeScript
Tailwind CSS 4
Tiptap 3
shadcn/ui
Vitest
YAML parser
Marked
i18next
```

dan TypeScript-nya strict. Ada juga unit test untuk logic serializer/frontmatter. ([GitHub][6])

Struktur source juga cukup terpisah:

```text
components/
  editor/
  form/
  output/
  theme/

lib/
  frontmatter.ts
  markdown.ts
  mdoc-parser.ts
  storage.ts
  types.ts
  utils.ts
  __tests__/
```

Jadi secara architecture, ini sudah menunjukkan pola:

**UI layer ≠ serialization logic ≠ parsing logic ≠ persistence.** ([GitHub][1])

Itu bagus.

---

# 7. Ada detail engineering yang sebenarnya cukup menarik

Misalnya generator frontmatter-nya tidak sekadar melakukan:

```ts
`title: ${title}`
```

Ada logic untuk menentukan kapan YAML string perlu di-quote dan melakukan escaping terhadap backslash/quotes. Description panjang juga menggunakan YAML folded block scalar `>-`. ([GitHub][7])

Ada juga slugification dengan Unicode NFD normalization:

```text
normalize("NFD")
→ remove combining marks
→ lowercase
→ sanitize
→ hyphenate
```

yang membuat handling title dengan diacritics/non-ASCII menjadi lebih aman. ([GitHub][7])

Hal-hal seperti ini bukan fitur yang kelihatan keren di screenshot, tetapi justru **meningkatkan reliability tool**.

---

# 8. Namun ada sesuatu yang menurut saya perlu diperbaiki

Repo GitHub saat saya cek menunjukkan:

* **2 commits**
* **0 forks**
* **0 issues**
* **0 pull requests**
* repo masih sangat awal. ([GitHub][1])

Jadi saya tidak akan menyebutnya sebagai:

> "established developer tool"

Belum.

Lebih tepat:

> **a focused early-stage developer utility.**

Itu perbedaan penting.

Apalagi README masih menyebut screenshot sebagai placeholder. ([GitHub][1])

Untuk developer tool, screenshots, live demo, example output, dan installation clarity sangat berpengaruh terhadap adoption.

---

# 9. Yang lebih menarik: sebenarnya tool ini bisa berkembang jauh lebih besar

Menurut saya, **versi sekarang baru v1 dari konsep yang lebih besar.**

Core engine-nya sebenarnya bisa menjadi:

```text
Content authoring
       │
       ├── .mdoc
       ├── .md
       ├── .mdx
       ├── Markdoc
       ├── YAML frontmatter
       └── custom schemas
```

Kemudian menjadi semacam:

> **local-first visual content editor for Git-based CMS workflows**

Misalnya nanti ada:

```text
Open file
   ↓
Edit visually
   ↓
Preview
   ↓
Validate schema
   ↓
Save
```

bahkan:

```text
GitHub repository
       ↓
Fetch content
       ↓
Edit
       ↓
Commit
       ↓
Pull Request
```

Nah, **di titik itu usefulness-nya untuk developer akan naik drastis.**

---

# 10. Potential feature yang paling masuk akal

Saya justru tidak akan buru-buru menambahkan 30 toolbar baru.

Yang lebih valuable:

### GitHub integration

```text
Connect repo
↓
Select content directory
↓
Open .mdoc
↓
Edit
↓
Commit changes
```

Ini akan menghilangkan workflow:

```text
Download
→ edit
→ save
→ upload
```

### Schema-driven metadata

Saat ini metadata cukup hardcoded:

```text
title
featured_image
category
description
publishDate
featured
```

Padahal Keystatic sendiri schema-driven.

Idealnya user bisa memberi schema:

```ts
{
  title: "string",
  category: "select",
  publishedAt: "date",
  featured: "boolean",
  cover: "image"
}
```

lalu builder membangun form secara otomatis.

Itu akan mengubah tool dari:

**mdoc-builder**

menjadi:

**content-schema builder/editor.**

---

# 11. Ada satu positioning yang menurut saya sangat kuat

Jangan jual tool ini sebagai alternatif:

> "VS Code Markdown editor"

karena VS Code sudah terlalu powerful.

Jangan juga melawan:

> "Notion"

karena itu market yang berbeda.

Lebih tepat:

> **"A GUI for Git-based Markdown content."**

Itu positioning yang menarik.

Karena workflow developer sering seperti:

```text
CMS
↓
database
```

atau:

```text
Markdown
↓
Git
```

mdoc-builder berada di tengah:

```text
Human
 ↓
Visual editor
 ↓
Git-native content
```

Itu niche yang legitimate.

---

# 12. Apakah relevan untuk kamu sebagai developer?

**Iya. Bahkan cukup relevan.**

Terutama karena tool ini menunjukkan beberapa capability yang bagus untuk portfolio engineering:

```text
React
TypeScript
complex state management
rich-text editor
serialization
parser
YAML
Markdown AST/content conversion
local-first architecture
file import/export
responsive UI
testing
deployment
i18n
```

Jadi walaupun aplikasi akhirnya cuma menghasilkan file `.mdoc`, engineering problem di belakangnya bukan trivial.

Dan yang paling penting: **ini menunjukkan kamu tidak hanya membangun CRUD.**

Kamu membangun sebuah **developer utility yang punya format specification, parser, serializer, editor, persistence, validation, dan interoperability concern.**

Itu jauh lebih menarik secara portfolio.

---

## Verdict saya

Saya akan kasih nilai:

**Problem validity:** 8/10
**Usefulness:** 7/10
**Developer relevance:** 8/10
**Market breadth:** 4/10
**Engineering quality:** 7.5/10
**Portfolio value:** **8.5/10**
**Current maturity:** 4/10

Jadi:

> **Yes, mdoc-builder adalah tool yang genuinely berguna, tetapi sangat niche.**

Dan menurut saya justru **nicheness itu jangan dihilangkan**. Yang perlu diperluas adalah **capability**, bukan sekadar menambah fitur acak.

Saat ini dia adalah:

```text
.mdoc visual editor
```

Potensi jangka panjangnya bisa menjadi:

```text
Git-based Content Authoring Tool
```

dan itu jauh lebih menarik sebagai developer product.

([GitHub][1])

[1]: https://github.com/haidar038/mdoc-builder "GitHub - haidar038/mdoc-builder · GitHub"
[2]: https://github.com/haidar038/mdoc-builder/blob/main/src/lib/mdoc-parser.ts "mdoc-builder/src/lib/mdoc-parser.ts at main · haidar038/mdoc-builder · GitHub"
[3]: https://github.com/haidar038/mdoc-builder/blob/main/docs/output-format.md "mdoc-builder/docs/output-format.md at main · haidar038/mdoc-builder · GitHub"
[4]: https://keystatic.com/docs/format-options?utm_source=chatgpt.com "Format options - Docs | Keystatic"
[5]: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/cms/keystatic.mdx?utm_source=chatgpt.com "docs/src/content/docs/en/guides/cms/keystatic.mdx at main · withastro/docs · GitHub"
[6]: https://github.com/haidar038/mdoc-builder/blob/main/package.json "mdoc-builder/package.json at main · haidar038/mdoc-builder · GitHub"
[7]: https://github.com/haidar038/mdoc-builder/blob/main/src/lib/frontmatter.ts "mdoc-builder/src/lib/frontmatter.ts at main · haidar038/mdoc-builder · GitHub"
