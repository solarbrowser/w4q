# Docen

Docen is a minimal documentation engine built with pure HTML, CSS, and JavaScript.

## What it includes

- Hash-based routing (static-host friendly)
- Markdown rendering with HTML sanitization (DOMPurify)
- Sidebar navigation with nested folders
- Search with lazy indexing and in-memory document caching
- Light/Dark theme toggle with local persistence
- On-page TOC (desktop right panel, mobile bottom sheet)
- Previous/Next page navigation at the bottom
- Default keyboard shortcuts:
  - `/` focus search
  - `n` next page
  - `p` previous page
  - `Esc` close open menus/modals

## Quick start

Serve the project root with any static server:

```bash
npx serve .
```

or

```bash
python -m http.server
```

Then open the URL in your browser.

## Configuration

Main config is in `js/config.js`:

- `title`
- `baseDir`
- `homePage`
- `icons`
- `showDefaultIcons`
- `developerMode`
- `nav`

## Third-party notice

- **Lucide Icons** is used for the UI icon set (`https://lucide.dev`), distributed under the **ISC License**.
