# mdoc-builder

A browser-based editor for Keystatic `.mdoc` blog content.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](#)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6.svg)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](#)

mdoc-builder is a small, opinionated WYSIWYG editor that produces
Keystatic-compatible `.mdoc` files. Fill the metadata form on the left,
write your post in the Tiptap-powered editor, and download a single
Markdown file with YAML frontmatter that drops straight into a Keystatic
content collection.

It is built for authors using [Keystatic](https://keystatic.com/),
[Astro](https://astro.build/), or any other static site generator that
reads Keystatic-style content. There is no backend, no account, and no
network call: the whole app runs in the browser, autosaves to
`localStorage`, and lets you copy or download the result.

## 🌐 Live Demo

Open the live demo at https://mdoc-builder.vercel.app.

## ✨ Features

- **Rich text editor** powered by Tiptap 3 — bold, italic,
  strikethrough, inline code, links, headings 1–3, lists, blockquote,
  fenced code blocks, horizontal rule, hard break, and images.
- **GFM tables and task lists** with toolbar buttons.
- **Image insertion** via URL dialog and paste-of-image-URL detection.
- **Real-time and manual generation modes** — watch the output update
  as you type, or click **Generate** to take explicit control.
- **YAML frontmatter** with proper escaping and a folded block-scalar
  `description` field.
- **Import existing `.mdoc` files** — frontmatter fills the form, body
  loads into the editor.
- **`localStorage` autosave** under the key `mdoc-builder:draft:v1` so
  you never lose work to a closed tab.
- **Field validation** — empty title blocks download, invalid dates
  and URLs warn inline.
- **i18n-safe `slugify`** — Unicode NFD normalization handles
  diacritics and non-ASCII titles correctly.
- **Copy to clipboard** and **download** as `{date}-{slug}.mdoc` with
  an auto-generated filename.
- **Source and HTML preview tabs** with content statistics: word
  count, character count, and reading time.
- **Dark / light theme** with a header toggle.
- **Responsive resizable panel layout** that collapses gracefully on
  mobile.
- **Externalized categories** in `src/data/categories.json` — edit
  the JSON, no code change required.
- **Flexible deployment** — `VITE_BASE_PATH` env var lets you host at
  any subpath (root domain, GitHub Pages project page, etc.).

## 📸 Screenshots

<!-- TODO: replace with real screenshot of editor + output panel (light mode) -->
![mdoc-builder editor — light mode](docs/assets/editor-light.png)

<!-- TODO: replace with real screenshot of editor (dark mode) -->
![mdoc-builder editor — dark mode](docs/assets/editor-dark.png)

<!-- TODO: replace with real screenshot of the output preview tab -->
![mdoc-builder output preview](docs/assets/output-preview.png)

<!-- TODO: replace with real screenshot of the import dialog -->
![mdoc-builder import dialog](docs/assets/import-dialog.png)

<!-- TODO: replace with real screenshot of the download action -->
![mdoc-builder download action](docs/assets/download-action.png)

> The images above are placeholders. See
> [`docs/assets/README.md`](docs/assets/README.md) for naming
> conventions and how to capture real screenshots.

## 🚀 Quick Start

**Prerequisites**: Node.js ≥ 18 and npm ≥ 9.

```bash
git clone https://github.com/<your-org>/mdoc-builder.git
cd mdoc-builder
npm install
npm run dev
```

Open <http://localhost:5173> in your browser.

To produce a production build and preview it locally:

```bash
npm run build
npm run preview
```

## 📖 Usage

1. **Fill the metadata form** on the left:
   - *Post Title* — the post title (required).
   - *Publish Date* — the publish date.
   - *Category* — pick from the dropdown.
   - *Featured Image URL* — absolute URL to the cover image.
   - *Description* — short summary.
   - *Featured Post* — toggle to mark as featured.
2. **Write the body** in the editor. The toolbar exposes every
   formatting action — bold, italic, strike, link, heading 1–3,
   bullet/ordered list, blockquote, code, code block, horizontal rule,
   image, table, task list, undo/redo.
3. **Watch the output** update in real time in the right panel, **Source**
   tab. Switch to **Manual** mode in the header if you prefer to click
   **Generate** to control when the output is recomputed.
4. **Copy** the output to your clipboard, or **Unduh** (download) it as
   `{publishDate}-{slug}.mdoc`.
5. **Impor** an existing `.mdoc` to edit it — the frontmatter fills
   the form, the body loads into the editor.
6. Toggle the **theme** (light / dark) from the header.

## 📄 Output format

A `.mdoc` file is YAML frontmatter + a content marker + CommonMark /
GFM body. mdoc-builder emits the frontmatter field order, validation
rules, and filename pattern documented in
[`docs/output-format.md`](docs/output-format.md). That document is the
authoritative specification for the format; if you build tooling on
top of `.mdoc`, start there.

## ⚙️ Configuration

- **`VITE_BASE_PATH`** — environment variable read at build time by
  Vite. Controls the base path the app is served from. Defaults to
  `/` for root-domain deployments. See **Deployment** below.
- **`src/data/categories.json`** — the list of categories shown in the
  form. Each entry has a `value` (machine key written to the
  frontmatter `category` field) and a `translations` object with `en`
  and `id` (and any future locale) containing the `label` and
  `description`:
  ```json
  {
    "categories": [
      {
        "value": "tutorial",
        "translations": {
          "en": { "label": "Tutorial", "description": "Step-by-step guides" },
          "id": { "label": "Tutorial", "description": "Panduan langkah demi langkah" }
        }
      }
    ]
  }
  ```
  The active locale is resolved at runtime; missing translations fall
  back to English. Add, remove, or edit entries and run
  `npm run build` to pick up the change.

## 🌐 Deployment

mdoc-builder is a Vite SPA with no runtime backend. Build the static
`dist/` and serve it from any static host.

- **Vercel / Netlify** — connect the repo, set the build command to
  `npm run build` and the output directory to `dist`. The default
  `VITE_BASE_PATH=/` is correct for a custom domain.
- **GitHub Pages (project page)** — for a `username.github.io/mdoc-builder`
  deployment, set the environment variable `VITE_BASE_PATH=/mdoc-builder/`
  in your build step, then publish `dist/` to the `gh-pages` branch
  (e.g. via `actions/deploy-pages`). Because the app has no client-side
  router, no SPA fallback rewrite is needed.
- **Self-hosted / static** — set `VITE_BASE_PATH=/your-subpath/` and
  serve `dist/` with any web server (Nginx, Caddy, Apache, etc.).

## 🏗️ Project structure

```
mdoc-builder/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── docs/
│   ├── output-format.md
│   ├── assets/                # Screenshots used by README
│   └── tiptap-*.md            # Vendor Tiptap reference docs
├── eslint.config.js
├── index.html
├── package.json
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── editor/            # Tiptap editor + toolbar + image dialog
│   │   ├── form/              # Metadata form
│   │   ├── output/            # Output panel
│   │   ├── theme/             # Light/dark theme provider + toggle
│   │   ├── ui/                # shadcn/ui primitives
│   │   └── app-header.tsx
│   ├── data/
│   │   └── categories.json    # Externalized category list
│   ├── hooks/
│   ├── lib/                   # Pure logic (frontmatter, parser, storage)
│   │   ├── constants.ts
│   │   ├── frontmatter.ts
│   │   ├── markdown.ts
│   │   ├── mdoc-parser.ts
│   │   ├── storage.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── __tests__/
│   └── assets/
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

The `docs/` folder contains both the project documentation
(`README.md`, `CONTRIBUTING.md`, `output-format.md`, screenshots) **and**
the bundled vendor Tiptap reference docs (`tiptap-*.md`). A future
release will move the vendor content into `docs/reference/tiptap/`.

## 🛠️ Tech stack

- **React 19** + **Vite 8**
- **Tiptap 3** for the rich text editor
- **Tailwind CSS 4** for styling
- **TypeScript** (strict)
- **shadcn/ui** primitives
- **Vitest** for unit tests
- **date-fns**, **lucide-react**, **sonner**, **marked**, **yaml** as
  supporting libraries

## 🧪 Testing

```bash
npm run test        # watch mode
npm run test:run    # single run (CI)
```

Tests live in `src/**/__tests__/`. The Vitest environment is `node` —
the test target is the pure serializer / frontmatter functions, not
the React UI.

## 🤝 Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the development setup,
coding standards, and pull request process. The README is bilingual
(English + Indonesian); PRs that change one language must update the
other.

## 📝 Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for the version history. The
project follows [Keep a Changelog](https://keepachangelog.com/) and
[Semantic Versioning](https://semver.org/).

## 📜 License

[MIT](LICENSE). The `LICENSE` file is added by the maintainer; until
it is committed, the link in the badge above will 404.

## 🙏 Acknowledgments

- [Tiptap](https://tiptap.dev/) — the headless editor framework that
  powers the body.
- [shadcn/ui](https://ui.shadcn.com/) — the accessible UI primitives.
- [Vite](https://vitejs.dev/) and [React](https://react.dev/) — the
  build and view layers.
- [Tailwind CSS](https://tailwindcss.com/) — styling.
- The [Keystatic](https://keystatic.com/) community — for the `.mdoc`
  content format and the surrounding ecosystem.

---

## 🇮🇩 Bahasa Indonesia

Editor berbasis browser untuk konten blog Keystatic berformat `.mdoc`.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](#)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6.svg)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](#)

mdoc-builder adalah editor WYSIWYG kecil dan opinionated yang
menghasilkan file `.mdoc` kompatibel dengan Keystatic. Isi formulir
metadata di sebelah kiri, tulis postingan di editor berbasis Tiptap,
dan unduh satu file Markdown dengan frontmatter YAML yang langsung
masuk ke koleksi konten Keystatic.

Tool ini ditujukan untuk penulis yang menggunakan
[Keystatic](https://keystatic.com/), [Astro](https://astro.build/),
atau static site generator lain yang membaca konten gaya Keystatic.
Tidak ada backend, tidak ada akun, tidak ada panggilan jaringan:
seluruh aplikasi berjalan di browser, autosave ke `localStorage`, dan
Anda bisa menyalin atau mengunduh hasilnya.

## 🌐 Demo Langsung

Buka demo langsung di https://mdoc-builder.vercel.app.

## ✨ Fitur

- **Editor rich text** berbasis Tiptap 3 — bold, italic,
  strikethrough, inline code, link, heading 1–3, list, blockquote,
  code block, horizontal rule, hard break, dan image.
- **Tabel GFM dan task list** dengan tombol toolbar.
- **Sisipkan gambar** lewat dialog URL dan deteksi paste URL gambar.
- **Mode real-time dan manual** — output ikut berubah saat Anda
  mengetik, atau klik **Generate** untuk kontrol eksplisit.
- **Frontmatter YAML** dengan escaping yang benar dan field
  `description` block-scalar folded.
- **Impor file `.mdoc` yang sudah ada** — frontmatter mengisi
  formulir, body termuat ke editor.
- **Autosave `localStorage`** dengan key `mdoc-builder:draft:v1`
  sehingga draf tidak hilang saat tab ditutup.
- **Validasi field** — judul kosong memblokir unduhan, format
  tanggal dan URL yang salah memberi peringatan inline.
- **`slugify` i18n-safe** — normalisasi NFD Unicode menangani
  diakritik dan judul non-ASCII dengan benar.
- **Salin ke clipboard** dan **Unduh** sebagai `{date}-{slug}.mdoc`
  dengan nama file yang dibuat otomatis.
- **Tab Source dan HTML preview** dengan statistik konten: jumlah
  kata, jumlah karakter, dan estimasi waktu baca.
- **Tema gelap / terang** dengan toggle di header.
- **Layout panel resizable responsif** yang tetap rapi di mobile.
- **Kategori ter-eksternalisasi** di `src/data/categories.json` —
  edit JSON, tidak perlu ubah kode.
- **Deployment fleksibel** — env var `VITE_BASE_PATH` memungkinkan
  hosting di subpath mana pun (domain root, GitHub Pages project
  page, dll.).

## 📸 Tangkapan Layar

<!-- TODO: replace with real screenshot of editor + output panel (light mode) -->
![mdoc-builder editor — light mode](docs/assets/editor-light.png)

<!-- TODO: replace with real screenshot of editor (dark mode) -->
![mdoc-builder editor — dark mode](docs/assets/editor-dark.png)

<!-- TODO: replace with real screenshot of the output preview tab -->
![mdoc-builder output preview](docs/assets/output-preview.png)

<!-- TODO: replace with real screenshot of the import dialog -->
![mdoc-builder import dialog](docs/assets/import-dialog.png)

<!-- TODO: replace with real screenshot of the download action -->
![mdoc-builder download action](docs/assets/download-action.png)

> Gambar di atas adalah placeholder. Lihat
> [`docs/assets/README.md`](docs/assets/README.md) untuk konvensi
> penamaan dan cara mengambil screenshot asli.

## 🚀 Mulai Cepat

**Prasyarat**: Node.js ≥ 18 dan npm ≥ 9.

```bash
git clone https://github.com/<your-org>/mdoc-builder.git
cd mdoc-builder
npm install
npm run dev
```

Buka <http://localhost:5173> di browser Anda.

Untuk membuat production build dan melihat pratinjau lokalnya:

```bash
npm run build
npm run preview
```

## 📖 Penggunaan

1. **Isi formulir metadata** di sebelah kiri:
   - *Judul Blog* — judul postingan (wajib).
   - *Tanggal Terbit* — tanggal publikasi.
   - *Kategori* — pilih dari dropdown.
   - *URL Featured Image* — URL absolut gambar sampul.
   - *Deskripsi* — ringkasan singkat.
   - *Featured Post* — toggle untuk tandai unggulan.
2. **Tulis body** di editor. Toolbar menyediakan semua aksi
   formatting — bold, italic, strike, link, heading 1–3, bullet /
   ordered list, blockquote, code, code block, horizontal rule,
   image, table, task list, undo/redo.
3. **Lihat output** berubah secara real-time di panel kanan, tab
   **Source**. Beralih ke mode **Manual** di header jika Anda
   lebih memilih klik **Generate** untuk mengontrol kapan output
   dihitung ulang.
4. **Salin** output ke clipboard, atau **Unduh** sebagai
   `{publishDate}-{slug}.mdoc`.
5. **Impor** file `.mdoc` yang sudah ada untuk diedit — frontmatter
   mengisi formulir, body termuat ke editor.
6. Alihkan **tema** (terang / gelap) dari header.

## 📄 Format Output

Sebuah file `.mdoc` adalah frontmatter YAML + penanda konten + body
CommonMark / GFM. mdoc-builder menulis urutan field frontmatter,
aturan validasi, dan pola nama file yang didokumentasikan di
[`docs/output-format.md`](docs/output-format.md). Dokumen tersebut
adalah spesifikasi otoritatif untuk format ini; jika Anda membangun
tool di atas `.mdoc`, mulai dari sana.

## ⚙️ Konfigurasi

- **`VITE_BASE_PATH`** — environment variable yang dibaca Vite pada
  saat build. Mengatur base path tempat aplikasi disajikan. Default
  `/` untuk deployment domain root. Lihat **Deployment** di bawah.
- **`src/data/categories.json`** — daftar kategori yang ditampilkan
  di formulir. Setiap entri memiliki `value` (kunci mesin yang
  ditulis ke field frontmatter `category`) dan objek `translations`
  dengan `en` dan `id` (dan lokal apa pun di masa depan) yang berisi
  `label` dan `description`:
  ```json
  {
    "categories": [
      {
        "value": "tutorial",
        "translations": {
          "en": { "label": "Tutorial", "description": "Step-by-step guides" },
          "id": { "label": "Tutorial", "description": "Panduan langkah demi langkah" }
        }
      }
    ]
  }
  ```
  Lokal aktif diselesaikan saat runtime; terjemahan yang hilang
  fallback ke bahasa Inggris. Tambah, hapus, atau edit entri lalu
  jalankan `npm run build` agar perubahan diterapkan.

## 🌐 Deployment

mdoc-builder adalah SPA Vite tanpa backend runtime. Build `dist/`
statis dan sajikan dari host statis mana pun.

- **Vercel / Netlify** — hubungkan repo, set build command ke
  `npm run build` dan output directory ke `dist`. Default
  `VITE_BASE_PATH=/` sudah benar untuk custom domain.
- **GitHub Pages (project page)** — untuk deployment
  `username.github.io/mdoc-builder`, set environment variable
  `VITE_BASE_PATH=/mdoc-builder/` pada langkah build, lalu publikasikan
  `dist/` ke branch `gh-pages` (mis. via `actions/deploy-pages`.
  Karena aplikasi tidak memiliki client-side router, tidak perlu
  rewrite fallback SPA.
- **Self-hosted / static** — set `VITE_BASE_PATH=/subpath-anda/`
  dan sajikan `dist/` dengan web server apa pun (Nginx, Caddy,
  Apache, dll.).

## 🏗️ Struktur Proyek

```
mdoc-builder/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── docs/
│   ├── output-format.md
│   ├── assets/                # Screenshot yang dipakai README
│   └── tiptap-*.md            # Referensi vendor Tiptap
├── eslint.config.js
├── index.html
├── package.json
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── editor/            # Editor Tiptap + toolbar + dialog gambar
│   │   ├── form/              # Formulir metadata
│   │   ├── output/            # Panel output
│   │   ├── theme/             # Provider + toggle tema terang/gelap
│   │   ├── ui/                # Primitif shadcn/ui
│   │   └── app-header.tsx
│   ├── data/
│   │   └── categories.json    # Daftar kategori ter-eksternalisasi
│   ├── hooks/
│   ├── lib/                   # Logika murni (frontmatter, parser, storage)
│   │   ├── constants.ts
│   │   ├── frontmatter.ts
│   │   ├── markdown.ts
│   │   ├── mdoc-parser.ts
│   │   ├── storage.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── __tests__/
│   └── assets/
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

Folder `docs/` memuat **baik** dokumentasi proyek
(`README.md`, `CONTRIBUTING.md`, `output-format.md`, screenshot) **maupun**
dokumen referensi vendor Tiptap (`tiptap-*.md`). Rilis mendatang akan
memindahkan konten vendor ke `docs/reference/tiptap/`.

## 🛠️ Tumpukan Teknologi

- **React 19** + **Vite 8**
- **Tiptap 3** untuk editor rich text
- **Tailwind CSS 4** untuk styling
- **TypeScript** (strict)
- **Primitif shadcn/ui**
- **Vitest** untuk unit test
- **date-fns**, **lucide-react**, **sonner**, **marked**, **yaml**
  sebagai library pendukung

## 🧪 Pengujian

```bash
npm run test        # mode watch
npm run test:run    # single run (CI)
```

Test berada di `src/**/__tests__/`. Environment Vitest adalah `node` —
target test adalah fungsi murni serializer / frontmatter, bukan UI
React.

## 🤝 Kontribusi

Lihat [`CONTRIBUTING.md`](CONTRIBUTING.md) untuk setup development,
standar coding, dan proses pull request. README ini bilingual
(Bahasa Inggris + Bahasa Indonesia); PR yang mengubah satu bahasa
harus memperbarui bahasa yang lain.

## 📝 Catatan Perubahan

Lihat [`CHANGELOG.md`](CHANGELOG.md) untuk histori versi. Proyek ini
mengikuti [Keep a Changelog](https://keepachangelog.com/) dan
[Semantic Versioning](https://semver.org/).

## 📜 Lisensi

[MIT](LICENSE). File `LICENSE` ditambahkan oleh maintainer; hingga
file tersebut di-commit, tautan di badge di atas akan 404.

## 🙏 Pengakuan

- [Tiptap](https://tiptap.dev/) — framework editor headless yang
  menggerakkan body.
- [shadcn/ui](https://ui.shadcn.com/) — primitif UI yang aksesibel.
- [Vite](https://vitejs.dev/) dan [React](https://react.dev/) —
  lapisan build dan view.
- [Tailwind CSS](https://tailwindcss.com/) — styling.
- Komunitas [Keystatic](https://keystatic.com/) — untuk format
  konten `.mdoc` dan ekosistem di sekitarnya.
