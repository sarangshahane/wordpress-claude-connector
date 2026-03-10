
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('connector', {
  connectSite: (data) => ipcRenderer.invoke('connect-site', data)
});
