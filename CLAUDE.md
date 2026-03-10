# wordpress-claude-connector

## Project Overview

Electron desktop app that installs MCP server configuration into Claude Desktop, enabling Claude to communicate with a WordPress site via the `@automattic/mcp-wordpress-remote` package.

## Tech Stack

- **Runtime**: Node.js + Electron v30
- **UI**: Vanilla HTML/CSS (no framework) — `index.html`
- **IPC**: Electron `contextBridge` + `ipcMain/ipcRenderer`
- **Packaging**: `electron-packager` (macOS, darwin/x64)
- **Dependency**: `fs-extra` for file system helpers

## Architecture

```
main.js          Electron main process — creates BrowserWindow, handles IPC
preload.js       Context bridge — exposes `window.connector.connectSite()` to renderer
index.html       Renderer UI — form + vanilla JS connect logic
assets/          App icons (icon.icns for macOS packaging)
```

**Data flow:**
1. User fills form in `index.html` (site name, URL, username, app password)
2. Renderer calls `window.connector.connectSite(data)` via the context bridge
3. `main.js` `ipcMain.handle('connect-site')` writes the MCP server entry into `claude_desktop_config.json`
4. User restarts Claude Desktop to pick up the new MCP server

**Config file locations searched (in order):**
- `~/.config/claude/claude_desktop_config.json`
- `~/Library/Application Support/Claude/claude_desktop_config.json`

## Commands

```bash
npm start           # Run app in development (electron .)
npm run package     # Build macOS .app via electron-packager (darwin/x64)
```

## Current Focus

<!-- TODO: Update with what you're currently working on -->
- [ ] Initial working prototype

## Gotchas

- **No test suite yet** — manual testing required; open the app and connect a local WordPress install
- **macOS only packaging** — `package` script targets `darwin/x64` only; add `--platform=win32` for Windows builds
- **Application Password ≠ login password** — the UI already warns users, but it's a common support issue
- **Claude Desktop must be restarted** after config is written; there is no live-reload of MCP servers
- **Config path fallback** — if neither config path exists, `main.js` defaults to `~/.config/claude/...` and creates it fresh

## Security Notes

- Credentials (`WP_API_USERNAME`, `WP_API_PASSWORD`) are stored in plaintext in `claude_desktop_config.json` — this is consistent with how Claude Desktop stores all MCP env vars
- `contextIsolation: true` is set — do not disable it
- Never enable `nodeIntegration: true` in the BrowserWindow
