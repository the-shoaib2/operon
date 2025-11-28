import { Project, Chat, ChatMessage } from '@repo/types';
import { EventBus } from './EventBus';

// Conditional import for better-sqlite3 (Node.js only)
let Database: any;
let dbLoadPromise: Promise<void> | null = null;

async function loadDatabase() {
  if (Database) return;
  if (dbLoadPromise) return dbLoadPromise;
  
  dbLoadPromise = (async () => {
    try {
      // Use runtime import to avoid bundler interference
      const importFn = new Function('specifier', 'return import(specifier)');
      const module = await importFn('better-sqlite3');
      Database = module.default;
      console.log('✓ better-sqlite3 loaded successfully in StorageManager');
    } catch (error) {
      console.warn('better-sqlite3 not available, StorageManager will not persist data');
    }
  })();
  
  return dbLoadPromise;
}

export class StorageManager {
  private db: any;
  private eventBus: EventBus;
  private initPromise: Promise<void>;

  constructor(dbPath: string = './operone-data.db') {
    this.eventBus = EventBus.getInstance();
    this.initPromise = this.initializeAsync(dbPath);
  }

  private async initializeAsync(dbPath: string): Promise<void> {
    await loadDatabase();
    
    if (!Database) return;
    
    try {
      this.db = new Database(dbPath);
      this.initializeDatabase();
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
    }
  }

  private initializeDatabase(): void {
    if (!this.db) return;

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        title TEXT NOT NULL,
        messages TEXT NOT NULL, -- JSON string
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_project_id ON chats(project_id);
    `);
  }

  // Project Operations
  public createProject(project: Project): void {
    if (!this.db) return;
    const stmt = this.db.prepare(`
      INSERT INTO projects (id, name, category, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      project.id,
      project.name,
      project.category,
      project.description || null,
      project.createdAt.getTime(),
      project.updatedAt.getTime()
    );
    this.eventBus.publish('storage', 'project_created', { id: project.id });
  }

  public getProject(id: string): Project | null {
    if (!this.db) return null;
    const stmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return null;
    return this.mapProjectRow(row);
  }

  public getAllProjects(): Project[] {
    if (!this.db) return [];
    const stmt = this.db.prepare('SELECT * FROM projects ORDER BY updated_at DESC');
    const rows = stmt.all();
    return rows.map(this.mapProjectRow.bind(this));
  }

  public updateProject(id: string, updates: Partial<Project>): void {
    if (!this.db) return;
    
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category); }
    if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
    
    // Always update updated_at
    fields.push('updated_at = ?');
    values.push(Date.now());

    if (fields.length === 0) return;

    values.push(id); // For WHERE clause

    const stmt = this.db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    this.eventBus.publish('storage', 'project_updated', { id });
  }

  public deleteProject(id: string): void {
    if (!this.db) return;
    const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(id);
    this.eventBus.publish('storage', 'project_deleted', { id });
  }

  // Chat Operations
  public createChat(chat: Chat): void {
    if (!this.db) return;
    const stmt = this.db.prepare(`
      INSERT INTO chats (id, project_id, title, messages, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      chat.id,
      chat.projectId || null,
      chat.title,
      JSON.stringify(chat.messages),
      chat.createdAt.getTime(),
      chat.updatedAt.getTime()
    );
    this.eventBus.publish('storage', 'chat_created', { id: chat.id });
  }

  public getChat(id: string): Chat | null {
    if (!this.db) return null;
    const stmt = this.db.prepare('SELECT * FROM chats WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return null;
    return this.mapChatRow(row);
  }

  public getChatsByProject(projectId: string): Chat[] {
    if (!this.db) return [];
    const stmt = this.db.prepare('SELECT * FROM chats WHERE project_id = ? ORDER BY updated_at DESC');
    const rows = stmt.all(projectId);
    return rows.map(this.mapChatRow.bind(this));
  }

  public getAllChats(): Chat[] {
    if (!this.db) return [];
    const stmt = this.db.prepare('SELECT * FROM chats ORDER BY updated_at DESC');
    const rows = stmt.all();
    return rows.map(this.mapChatRow.bind(this));
  }

  public updateChat(id: string, updates: Partial<Chat>): void {
    if (!this.db) return;

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
    if (updates.projectId !== undefined) { fields.push('project_id = ?'); values.push(updates.projectId || null); }
    if (updates.messages !== undefined) { fields.push('messages = ?'); values.push(JSON.stringify(updates.messages)); }
    
    // Always update updated_at
    fields.push('updated_at = ?');
    values.push(Date.now());

    if (fields.length === 0) return;

    values.push(id); // For WHERE clause

    const stmt = this.db.prepare(`UPDATE chats SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    this.eventBus.publish('storage', 'chat_updated', { id });
  }

  public deleteChat(id: string): void {
    if (!this.db) return;
    const stmt = this.db.prepare('DELETE FROM chats WHERE id = ?');
    stmt.run(id);
    this.eventBus.publish('storage', 'chat_deleted', { id });
  }

  // Helpers
  private mapProjectRow(row: any): Project {
    // We need to fetch conversationIds separately or just return empty array and let the context handle it?
    // The Project interface has conversationIds.
    // Let's fetch them efficiently.
    const conversationIds = this.getChatIdsForProject(row.id);
    
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      conversationIds
    };
  }

  private getChatIdsForProject(projectId: string): string[] {
    if (!this.db) return [];
    const stmt = this.db.prepare('SELECT id FROM chats WHERE project_id = ?');
    const rows = stmt.all(projectId);
    return rows.map((r: any) => r.id);
  }

  private mapChatRow(row: any): Chat {
    return {
      id: row.id,
      title: row.title,
      projectId: row.project_id || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      messages: JSON.parse(row.messages)
    };
  }

  public close(): void {
    if (this.db) this.db.close();
  }
}
