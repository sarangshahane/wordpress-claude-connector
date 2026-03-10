# WordPress Claude Connector

A lightweight Electron desktop app that connects [Claude Desktop](https://claude.ai/download) to any WordPress site using the [MCP WordPress Remote](https://github.com/Automattic/mcp-server-wordpress) adapter.

Fill in your site details once, click **Connect site**, restart Claude Desktop — and Claude can read and manage your WordPress content directly.

---

## How it works

1. You enter your WordPress site URL, username, and an Application Password in the app
2. The app writes an MCP server entry into Claude Desktop's config file (`claude_desktop_config.json`)
3. After restarting Claude Desktop, Claude can communicate with your WordPress site via the MCP protocol

```
┌─────────────────────┐        MCP         ┌──────────────────────┐
│   Claude Desktop    │ ◄────────────────► │  Your WordPress Site │
└─────────────────────┘                    └──────────────────────┘
         ▲
         │ writes config
┌─────────────────────┐
│  WP Claude Connector│  ← this app
└─────────────────────┘
```

---

## Prerequisites

- **Claude Desktop** installed on your Mac
- A **WordPress site** (self-hosted or WordPress.com) with the REST API enabled
- A **WordPress Application Password** — _not_ your regular login password (see below)

---

## Getting started

### Run from source

```bash
git clone https://github.com/sarangshahane/wordpress-claude-connector.git
cd wordpress-claude-connector
npm install
npm start
```

### Build a macOS app

```bash
npm run package
```

This produces a `wordpress-claude-connector-darwin-x64/` folder with a standalone `.app` you can move to `/Applications`.

---

## Creating a WordPress Application Password

1. Log in to your WordPress admin dashboard
2. Go to **Users → Profile**
3. Scroll down to **Application Passwords**
4. Enter a name (e.g. `Claude`) and click **Add New Application Password**
5. Copy the generated password — it looks like `xxxx xxxx xxxx xxxx xxxx xxxx`

> **Important:** This is a separate credential from your regular WordPress login password. It can be revoked at any time from your profile page without affecting your main account.

---

## Usage

1. Open the app
2. Fill in the form:
   - **Site name** — a label for this connection (e.g. `My Blog`)
   - **Site URL** — the root URL of your WordPress site (e.g. `https://example.com`)
   - **WordPress username** — your WordPress login username
   - **Application password** — the password generated above
3. Click **Connect site**
4. You'll see a ✅ success message — **restart Claude Desktop**
5. Claude can now access your WordPress site

---

## Config file location

The app writes to Claude Desktop's config file at one of these paths (whichever exists):

| Platform | Path |
|----------|------|
| macOS    | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux    | `~/.config/claude/claude_desktop_config.json` |

The entry added looks like this:

```json
{
  "mcpServers": {
    "My Blog": {
      "command": "npx",
      "args": ["-y", "@automattic/mcp-wordpress-remote@latest"],
      "env": {
        "WP_API_URL": "https://example.com/wp-json/mcp/mcp-adapter-default-server",
        "WP_API_USERNAME": "your-username",
        "WP_API_PASSWORD": "your-application-password"
      }
    }
  }
}
```

---

## Security notes

- Credentials are stored in plaintext in `claude_desktop_config.json`, consistent with how Claude Desktop stores all MCP server environment variables
- The Application Password can be revoked from your WordPress profile at any time without affecting your main account
- The Electron renderer runs with `contextIsolation: true` — the UI has no direct access to Node.js APIs

---

## Tech stack

- [Electron](https://www.electronjs.org/) v30
- Node.js (main process)
- Vanilla HTML/CSS (renderer — no framework)
- [`@automattic/mcp-wordpress-remote`](https://github.com/Automattic/mcp-server-wordpress) (invoked via `npx` at runtime)

---

## Contributing

Pull requests are welcome. For larger changes, open an issue first to discuss what you'd like to change.

```bash
npm start        # run in development
npm run package  # build macOS .app
```

---

## License

MIT
