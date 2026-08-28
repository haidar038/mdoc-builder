# Contributing to mdoc-builder

Thanks for your interest in contributing! This document covers the day-to-day
workflow for working on mdoc-builder. For an overview of what the project
is and how to use it, see the [README](README.md) and the
[changelog](CHANGELOG.md).

> **Code of Conduct** — A project Code of Conduct has not yet been adopted.
> Until one is in place, contributors are expected to interact with
> respect and in good faith.

## Development setup

### Prerequisites

- **Node.js ≥ 18** (Node 20 LTS recommended).
- **npm ≥ 9** (the lockfile is `bun.lock`; if you use `bun` that works too,
  but `npm` is the documented path).
- **Git**.

### Clone & install

```bash
git clone https://github.com/<your-org>/mdoc-builder.git
cd mdoc-builder
npm install
```

### Run the dev server

```bash
npm run dev
```

This starts Vite at <http://localhost:5173>. Hot-module reload is enabled,
so most edits show up without a full reload.

### Build & preview

```bash
npm run build      # type-check + production build to ./dist
npm run preview    # serve ./dist locally to verify the production bundle
```

### Lint

```bash
npm run lint
```

`npm run lint` must pass before you open a pull request. The configuration
is in `eslint.config.js` and extends the TypeScript, React Hooks, and
React Refresh recommended presets.

### Test

```bash
npm run test        # watch mode — re-runs on file changes
npm run test:run    # single run — for CI
```

Tests live next to the code they cover, in `__tests__/` folders
(`src/**/__tests__/*.test.ts`). The Vitest environment is `node` because
the test target is the pure serializer / frontmatter functions, not the
React UI.

## Project structure

The high-level tree:

```
mdoc-builder/
├── README.md                # Project README (bilingual EN/ID)
├── CHANGELOG.md             # Version history
├── CONTRIBUTING.md          # This file
├── docs/
│   ├── output-format.md     # .mdoc file format specification
│   ├── assets/              # Screenshots used by the README
│   └── tiptap-*.md          # Vendor Tiptap reference docs (carried over)
├── eslint.config.js         # ESLint flat config
├── index.html               # Vite entry HTML
├── package.json
├── public/                  # Static assets served as-is
├── src/
│   ├── App.tsx              # Top-level component
│   ├── main.tsx             # React entry
│   ├── components/          # React components
│   │   ├── editor/          # Tiptap editor + toolbar
│   │   ├── form/            # Metadata form
│   │   ├── output/          # Output panel (source + HTML preview)
│   │   ├── theme/           # Light/dark theme provider
│   │   ├── ui/              # shadcn/ui primitives
│   │   └── app-header.tsx
│   ├── data/
│   │   └── categories.json  # Externalized category list
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Core logic (framework-agnostic)
│   │   ├── constants.ts
│   │   ├── frontmatter.ts   # buildFrontmatter, slugify, buildFileName
│   │   ├── markdown.ts
│   │   ├── mdoc-parser.ts   # .mdoc → form/editor state
│   │   ├── storage.ts       # localStorage helpers
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── __tests__/       # Vitest unit tests
│   └── assets/              # Bundled assets
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

The folder to know is `src/lib/` — the Tiptap serializer, the
frontmatter builder, the `.mdoc` parser, and the localStorage helpers
all live there. Keep changes to that folder paired with tests in
`src/lib/__tests__/`.

The `docs/` folder contains **both** the project documentation (this
file, `output-format.md`, screenshots) and the bundled vendor Tiptap
reference docs (`tiptap-*.md`). A future release will separate the two
into `docs/reference/tiptap/`.

## Coding standards

- **TypeScript strict.** `tsconfig.app.json` enables `noUnusedLocals`,
  `noUnusedParameters`, and `noFallthroughCasesInSwitch`. The build
  script runs `tsc -b` so type errors fail the build.
- **ESLint must pass.** `npm run lint` is the gate. The flat config in
  `eslint.config.js` extends `js/recommended`,
  `tseslint/recommended`, `react-hooks/flat/recommended`, and
  `react-refresh/vite`. There is **no Prettier or formatter config** —
  match the surrounding code style (2-space indent, single quotes,
  trailing commas where present, semicolons).
- **Tailwind CSS 4** for styling. Prefer utility classes; reach for
  `cn(...)` from `src/lib/utils.ts` when conditionally composing classes.
- **shadcn/ui primitives** live in `src/components/ui/`. Treat them as
  third-party: do not edit them to add project-specific behavior —
  compose them in a parent component instead.
- **Tiptap extensions** are configured in
  `src/components/editor/mdoc-editor.tsx`. **Editor-to-Markdown
  serialization** is kept separate in `src/lib/markdown.ts` so the
  serializer can be unit-tested without a DOM.
- **Import path alias** — use `@/...` to import from `src/`. The
  mapping is defined in `tsconfig.app.json`:
  ```json
  "paths": { "@/*": ["./src/*"] }
  ```
- **Pure functions in `src/lib/`.** Anything in `src/lib/` should be
  importable in a Node environment without React or the DOM. If you find
  yourself importing `react` or DOM types into `src/lib/`, the function
  probably belongs in `src/components/` or `src/hooks/` instead.

## Testing

- Tests use **Vitest**. The config in `vitest.config.ts` sets the test
  environment to `node`, so do not rely on `window`, `document`, or
  other browser globals in tests.
- Tests live **co-located** with the code they cover, in a sibling
  `__tests__/` directory. Example: tests for
  `src/lib/frontmatter.ts` go in `src/lib/__tests__/frontmatter.test.ts`.
- If you change a function in `src/lib/`, **add or update a test** in
  the same PR. Pure functions in particular should be exhaustively
  covered; aim for branch coverage, not just happy-path.
- Run the full suite before opening a PR:
  ```bash
  npm run test:run
  ```

## Commit conventions

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add table cell merging
fix: slugify drops emoji in CJK titles
docs: clarify VITE_BASE_PATH in README
refactor: extract frontmatter serializer
test: cover empty description in buildFrontmatter
chore: bump vite to 8.1
style: reorder imports in editor toolbar
```

- Imperative mood ("add", "fix"), not past tense ("added", "fixed").
- Subject line ≤ 72 characters.
- Body explains the **why**; the diff explains the **what**.

## Pull request process

1. **Branch from `main`.** Use a short, descriptive name:
   `feat/table-cell-merge`, `fix/slugify-cjk`, `docs/bilingual-readme`.
2. **Keep changes focused.** A single PR should address a single concern.
   If you find yourself writing "and" in the title, split it.
3. **Run the gates locally before pushing:**
   ```bash
   npm run lint
   npm run test:run
   npm run build
   ```
4. **Push the branch** and open a pull request against `main`.
5. **Describe the change** in the PR body: what you changed, why, and
   any follow-up work that is out of scope. Link any related issue
   (`Closes #123`).
6. **Wait for review.** A maintainer will either approve or request
   changes. Address review comments with new commits rather than force-
   pushing during review.

> A `.github/PULL_REQUEST_TEMPLATE.md` is not currently in use. If the
> project adds one, this section will be updated.

## Reporting bugs & requesting features

Please use the GitHub issue tracker. For a bug report, include:

- A clear, descriptive title.
- Steps to reproduce (or a sample `.mdoc` file that triggers the bug).
- Expected vs. actual behavior.
- Browser, OS, and Node version if relevant.
- Screenshots or screen recordings if the bug is visual.

For feature requests, describe the use case, the proposed behavior, and
any alternatives you considered.

## Localization

- The application UI is **bilingual** (English default, Indonesian
  secondary) via `i18next` + `react-i18next`. Locale resources live
  in `src/i18n/locales/{en,id}.json`. The user's choice is persisted
  in `localStorage` under `mdoc-builder:locale:v1`, and the
  `<html lang>` attribute is synced to the active locale.
- When you add or change a UI string, **update both locale files** in
  the same PR. Missing keys fall back to English at runtime; do not
  rely on that for production translations.
- The `README.md` is **bilingual** (English followed by
  `## 🇮🇩 Bahasa Indonesia`). When you change a section in one language,
  you **must** mirror the change in the other language in the same PR.
  Drift between the two halves is a known risk and a maintainer will
  ask you to fix it before merging if it slips in.
- All other documentation files in this repository
  (`CHANGELOG.md`, `CONTRIBUTING.md`, `docs/output-format.md`) are
  **English-only** to avoid duplication of maintenance effort.
- All other documentation files in this repository
  (`CHANGELOG.md`, `CONTRIBUTING.md`, `docs/output-format.md`) are
  **English-only** to avoid duplication of maintenance effort.

## Documentation contributions

- **Code changes that affect the spec** — if you change the `.mdoc`
  output (frontmatter fields, body schema, file naming, content marker),
  update `docs/output-format.md` in the same PR. The spec is the
  cross-tool contract; it must match the implementation in
  `src/lib/frontmatter.ts`, `src/lib/mdoc-parser.ts`,
  `src/lib/types.ts`, `src/lib/constants.ts`, and
  `src/components/form/meta-form.tsx`.
- **README changes** — keep the English and Indonesian halves in sync,
  as noted above. Internal links (`docs/output-format.md`,
  `CHANGELOG.md`, `CONTRIBUTING.md`, `LICENSE`) are written once in the
  English section; the Indonesian section points at the same targets.
- **CHANGELOG** — add an entry under an `## [Unreleased]` section when
  you open a PR. A maintainer will move it under a versioned heading at
  release time.
