import { Memory } from '@repo/types';
import { EventBus } from '../core/EventBus';

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
      console.log('✓ better-sqlite3 loaded successfully');
    } catch (error) {
      console.warn('better-sqlite3 not available, using browser memory manager');
    }
  })();
  
  return dbLoadPromise;
}

export interface MemoryEntry {
  id: number;
  content: string;
  timestamp: number;
  metadata?: string;
  tags?: string[];
}

export class SessionMemory {
  private entries: Map<string, MemoryEntry> = new Map();
  private readonly maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  public add(content: string, metadata?: any): void {
    const id = Math.random().toString(36).substring(7);
    const entry: MemoryEntry = {
      id: Date.now(), // Use timestamp as numeric ID for compatibility or change interface
      content,
      timestamp: Date.now(),
      metadata: JSON.stringify(metadata)
    };

    if (this.entries.size >= this.maxSize) {
      const firstKey = this.entries.keys().next().value;
      if (firstKey) this.entries.delete(firstKey);
    }

    this.entries.set(id, entry);
  }

  public getRecent(limit: number = 10): MemoryEntry[] {
    return Array.from(this.entries.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public clear(): void {
    this.entries.clear();
  }
}

export class MemoryManager implements Memory {
  private db: any;
  public shortTerm: string[] = [];
  public session: SessionMemory;
  private readonly maxShortTermSize = 10;
  private eventBus: EventBus;
  private initPromise: Promise<void>;

  constructor(dbPath: string = './operone-memory.db') {
    this.eventBus = EventBus.getInstance();
    this.session = new SessionMemory();

    // Initialize database asynchronously
    this.initPromise = this.initializeAsync(dbPath);
  }

  private async initializeAsync(dbPath: string): Promise<void> {
    await loadDatabase();
    
    if (!Database) {
      console.warn('MemoryManager running in non-SQLite environment.');
      return;
    }
    
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
      CREATE TABLE IF NOT EXISTS long_term_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        metadata TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_timestamp ON long_term_memory(timestamp);
    `);
  }

  public longTerm = {
    query: async (text: string): Promise<string[]> => {
      await this.initPromise;
      if (!this.db) return [];
      const stmt = this.db.prepare(`
        SELECT content FROM long_term_memory 
        WHERE content LIKE ? 
        ORDER BY timestamp DESC 
        LIMIT 10
      `);
      
      const results = stmt.all(`%${text}%`) as MemoryEntry[];
      return results.map(r => r.content);
    },

    store: async (text: string): Promise<void> => {
      await this.initPromise;
      if (!this.db) return;
      const stmt = this.db.prepare(`
        INSERT INTO long_term_memory (content, timestamp) 
        VALUES (?, ?)
      `);
      
      stmt.run(text, Date.now());
      this.eventBus.publish('memory', 'stored', { type: 'longTerm', content: text });
    },

    batchStore: async (entries: { content: string; metadata?: any }[]): Promise<void> => {
      await this.initPromise;
      if (!this.db) return;
      const insert = this.db.prepare(`
        INSERT INTO long_term_memory (content, timestamp, metadata) 
        VALUES (@content, @timestamp, @metadata)
      `);

      const insertMany = this.db.transaction((items: any[]) => {
        for (const item of items) insert.run(item);
      });

      const items = entries.map(e => ({
        content: e.content,
        timestamp: Date.now(),
        metadata: e.metadata ? JSON.stringify(e.metadata) : null
      }));

      insertMany(items);
      this.eventBus.publish('memory', 'batch_stored', { count: entries.length });
    }
  };

  public addToShortTerm(content: string): void {
    this.shortTerm.push(content);
    if (this.shortTerm.length > this.maxShortTermSize) {
      this.shortTerm.shift();
    }
    this.eventBus.publish('memory', 'stored', { type: 'shortTerm', content });
  }

  public clearShortTerm(): void {
    this.shortTerm = [];
  }

  public async consolidate(): Promise<void> {
    // Simple consolidation: Move session memory to long-term
    const recent = this.session.getRecent(50);
    if (recent.length === 0) return;

    const entries = recent.map(r => ({ content: r.content, metadata: { source: 'consolidation', original_ts: r.timestamp } }));
    await this.longTerm.batchStore(entries);
    this.session.clear();
    
    this.eventBus.publish('memory', 'consolidated', { count: entries.length });
  }

  public close(): void {
    if (this.db) this.db.close();
  }
}
