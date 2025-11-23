import { contextBridge as o, ipcRenderer as i } from "electron";
o.exposeInMainWorld("electronAPI", {
  // AI Chat
  sendMessage: (e) => i.invoke("ai:sendMessage", e),
  // Memory operations
  ingestDocument: (e, t, n) => i.invoke("ai:ingestDocument", { id: e, content: t, metadata: n }),
  queryMemory: (e) => i.invoke("ai:queryMemory", e),
  getStats: () => i.invoke("ai:getStats"),
  // File operations
  readFile: (e) => i.invoke("file:read", e),
  writeFile: (e, t) => i.invoke("file:write", { filePath: e, content: t }),
  listDirectory: (e) => i.invoke("file:list", e),
  // Shell operations
  executeCommand: (e) => i.invoke("shell:execute", e),
  // Settings
  getSettings: () => i.invoke("settings:get"),
  updateSettings: (e) => i.invoke("settings:update", e)
});
