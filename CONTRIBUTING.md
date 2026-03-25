# Contributing to md-editor

Thank you for contributing to md-editor!

## Project Overview

md-editor is a Chrome browser extension that provides Markdown editing with live preview. Built with Vanilla JS, marked.js, and highlight.js.

## How to Contribute

### Reporting Issues

Open an issue with:
- Steps to reproduce
- Browser version and OS
- Screenshots if applicable

### Pull Requests

1. **Fork and branch** — create a feature branch from `main`.
2. **Follow existing patterns** — the codebase uses Vanilla JS (no framework).
3. **Test manually** — load the extension via `chrome://extensions/` in developer mode.
4. **Keep manifest V3 compatible** — no deprecated MV2 APIs.
5. **Open a PR** with a clear description.

### Code Style

- Use ES6+ syntax (const/let, arrow functions, template literals)
- 2-space indentation
- Add JSDoc comments for public functions
- Keep `background.js` minimal — event handling only

### Adding New Features

1. **Popup mode** — edit `popup.html`, `popup.css`, `scripts/popup.js`
2. **Fullscreen mode** — edit `fullscreen.html`, `styles/fullscreen.css`, `scripts/fullscreen.js`
3. **Shared logic** — if the feature spans both modes, add to `scripts/shared/` or refactor common code
4. **i18n** — add new strings to `_locales/` language files
5. **Update manifest.json** if you add new permissions or resources

### Testing i18n

After adding a new string key, add entries to all `_locales/<lang>/messages.json` files.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
