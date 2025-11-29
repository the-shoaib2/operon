import { StorageManager } from '../../../../packages/operone/src';
import { app } from 'electron';
import path from 'path';

class StorageService {
  private storageManager: StorageManager;

  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'operone-data.db');
    this.storageManager = new StorageManager(dbPath);
  }



  // Chat Operations
  createChat(chat: any) {
    return this.storageManager.createChat(chat);
  }

  getChat(id: string) {
    return this.storageManager.getChat(id);
  }



  getAllChats() {
    return this.storageManager.getAllChats();
  }

  updateChat(id: string, updates: any) {
    return this.storageManager.updateChat(id, updates);
  }

  deleteChat(id: string) {
    return this.storageManager.deleteChat(id);
  }
}

let storageService: StorageService | null = null;

export function getStorageService() {
  if (!storageService) {
    storageService = new StorageService();
  }
  return storageService;
}
