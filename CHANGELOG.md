# Changelog

All notable changes to mdoc-builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Documentation suite** — bilingual `README.md` (English +
  Indonesian), `CHANGELOG.md` (Keep a Changelog), `CONTRIBUTING.md`
  (development setup, coding standards, commit conventions, PR
  process), `docs/output-format.md` (authoritative `.mdoc` format
  specification), and `docs/assets/` with screenshot capture
  conventions.
- **Internationalization (i18n)** — `i18next` + `react-i18next`
  with English (default) and Indonesian (secondary) locale
  resources. Globe-icon language switcher in the app header,
  locale preference persisted in `localStorage` under
  `mdoc-builder:locale:v1`, `<html lang>` attribute synced to
  current locale for accessibility.
- **Categories i18n** — `src/data/categories.json` now stores
  entries as `{ value, translations: { en: { label, description },
  id: { ... } } }`. `getCategoryLabel` and `getCategoryDescription`
  resolve labels from the active locale with English fallback.
- **License** — `MIT License` added.

### Changed

- **Content marker** — new files emit `<!-- Blog Content -->`
  (English) instead of the previous `<!-- Konten Blog -->`
  (Indonesian). The `.mdoc` parser accepts both markers for
  backward compatibility with files produced by earlier versions.

## [0.1.0] - 2026-08-28

Initial public release.

### Added

- Tiptap 3 rich text editor (bold, italic, strikethrough, inline code,
  links, headings 1–3, bullet/ordered lists, blockquote, fenced code
  blocks, horizontal rule, hard break, images).
- GFM tables and task lists (with toolbar buttons).
- Image insertion via URL dialog and paste-of-image-URL detection.
- Real-time and manual `.mdoc` generation modes.
- YAML frontmatter with proper escaping and block-scalar description.
- Import existing `.mdoc` files (frontmatter + body parsing via `yaml` +
  `marked`).
- localStorage autosave/restore for drafts
  (key `mdoc-builder:draft:v1`).
- Field validation (required title blocks download, date/URL format
  warnings).
- i18n-safe `slugify` (Unicode/diacritics NFD normalization).
- Copy to clipboard and download `.mdoc` with auto-generated filename.
- Source and HTML preview tabs with content statistics (words,
  characters, reading time).
- Dark/light theme support.
- Responsive resizable panel layout (mobile-aware).
- Externalized categories via `src/data/categories.json`.
- Flexible deployment base path via `VITE_BASE_PATH` env var.
- Unit tests (Vitest) covering core serializers and frontmatter.

### Changed

None.

### Fixed

None.

### Removed

None.

[0.1.0]: #0.1.0
