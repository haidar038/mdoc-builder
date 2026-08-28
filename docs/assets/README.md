# docs/assets

This folder holds the media (screenshots, GIFs) referenced from the project
`README.md`. It is intentionally kept small — only assets that have a stable
home in the repo.

## Naming convention

Use lowercase, hyphen-separated names that describe what the image shows. The
following names are reserved by `README.md` placeholders and should be
replaced in place (do not rename the file references in `README.md` without
updating the link there too):

| File                  | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `editor-light.png`    | Editor + output panel, light theme            |
| `editor-dark.png`     | Editor + output panel, dark theme             |
| `output-preview.png`  | Output panel showing rendered HTML preview    |
| `import-dialog.png`   | Import `.mdoc` dialog / flow                  |
| `download-action.png` | Download action (button or downloaded file)   |

If a new asset is introduced, follow the same `kebab-case.png` style and
document it in the table above so it is discoverable.

## Recommended size

- Desktop screenshots: **~1280×800** pixels (16:10). This is wide enough to
  show the editor + output panel side by side without being so large that the
  README image dominates the page.
- Mobile / narrow screenshots: **~390×844** if you want to showcase the
  responsive layout.
- Crop tightly; avoid capturing the full browser chrome (tabs, address bar)
  unless it adds context.

## How to capture

1. Run `npm run dev` and open <http://localhost:5173> in your browser.
2. Toggle between light and dark themes using the header switch.
3. Fill the metadata form with a realistic example (non-empty title, a
   category, a description, a featured image URL, etc.) so the screenshots
   look representative.
4. Use the OS screenshot tool:
   - **Windows**: `Win + Shift + S` (Snipping Tool) or the Print Screen key.
   - **macOS**: `Cmd + Shift + 4` for a region, `Cmd + Shift + 5` for window.
   - **Linux**: `gnome-screenshot`, `spectacle`, or `flameshot` depending on
     desktop.
5. Save the file under the name from the table above inside this folder.
6. Open `README.md` and remove the `<!-- TODO: ... -->` HTML comment that
   wraps the matching `![]()` line so the image is rendered.

## Format & compression

- **Format**: PNG (lossless) for screenshots with sharp edges (text, UI);
  WebP for photographic content. Keep the source in the highest quality you
  can; downstream compression is fine.
- **Compression**: run the image through a lossless optimizer before
  committing. Recommended tools: `oxipng` (PNG), `cwebp -q 90` (WebP), or a
  GUI like Squoosh.
- **Target size**: keep each screenshot under ~300 KB where possible. README
  images load on every visitor; bloat hurts.

## Licensing

All assets in this folder are part of the mdoc-builder project and inherit
the same license as the rest of the repository. Do not commit screenshots
that contain third-party copyrighted content (e.g. third-party logos,
paywalled images) without explicit permission.
