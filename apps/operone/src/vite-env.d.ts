/// <reference types="vite/client" />

interface Window {
  electron?: {
    getSettings: () => Promise<any>
    updateSettings: (settings: any) => Promise<boolean>
    sendMessage: (message: string) => Promise<string>
    getStats: () => Promise<any>
  }
}
