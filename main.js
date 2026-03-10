
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow () {
  const win = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});

function findClaudeConfig() {
  const paths = [
    path.join(os.homedir(), '.config/claude/claude_desktop_config.json'),
    path.join(os.homedir(), 'Library/Application Support/Claude/claude_desktop_config.json')
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return paths[0];
}

ipcMain.handle('connect-site', async (event, data) => {
  const configPath = findClaudeConfig();

  let config = {};
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath,'utf8'));
  }

  config.mcpServers = config.mcpServers || {};

  config.mcpServers[data.name] = {
    command: "npx",
    args: ["-y","@automattic/mcp-wordpress-remote@latest"],
    env: {
      WP_API_URL: data.endpoint,
      WP_API_USERNAME: data.username,
      WP_API_PASSWORD: data.password
    }
  };

  fs.writeFileSync(configPath, JSON.stringify(config,null,2));

  return {success:true};
});
