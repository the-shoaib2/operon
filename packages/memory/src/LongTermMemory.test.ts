import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LongTermMemory, MemoryEntry } from './LongTermMemory';
import * as fs from 'fs/promises';
import * as path from 'path';
import { tmpdir } from 'os';

describe('LongTermMemory', () => {
  let memory: LongTermMemory;
  let testDbPath: string;

  beforeEach(async () => {
    testDbPath = path.join(tmpdir(), `test-memory-${Date.now()}.db`);
    memory = new LongTermMemory(testDbPath);
    // Wait for initialization
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterEach(async () => {
    // Clean up test database
    try {
      await fs.unlink(testDbPath);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('initialization', () => {
    it('should initialize with database path', () => {
      expect(memory).toBeInstanceOf(LongTermMemory);
    });

    it('should initialize with in-memory database', () => {
      const inMemory = new LongTermMemory(':memory:');
      expect(inMemory).toBeInstanceOf(LongTermMemory);
    });
  });

  describe('store operation', () => {
    it('should store memory entry', async () => {
      const entry: MemoryEntry = {
        id: 'test-1',
        content: 'Test content',
        type: 'test',
        timestamp: Date.now(),
      };

      await expect(memory.store(entry)).resolves.not.toThrow();
    });

    it('should store entry with metadata', async () => {
      const entry: MemoryEntry = {
        id: 'test-2',
        content: 'Test content',
        type: 'test',
        timestamp: Date.now(),
        metadata: JSON.stringify({ key: 'value' }),
      };

      await expect(memory.store(entry)).resolves.not.toThrow();
    });

    it('should store multiple entries', async () => {
      const entries: MemoryEntry[] = [
        {
          id: 'test-1',
          content: 'Content 1',
          type: 'test',
          timestamp: Date.now(),
        },
        {
          id: 'test-2',
          content: 'Content 2',
          type: 'test',
          timestamp: Date.now(),
        },
        {
          id: 'test-3',
          content: 'Content 3',
          type: 'test',
          timestamp: Date.now(),
        },
      ];

      for (const entry of entries) {
        await memory.store(entry);
      }

      const retrieved = await memory.retrieve('test-2');
      expect(retrieved).toBeDefined();
      expect(retrieved?.content).toBe('Content 2');
    });
  });

  describe('retrieve operation', () => {
    beforeEach(async () => {
      const entry: MemoryEntry = {
        id: 'retrieve-test',
        content: 'Retrieve test content',
        type: 'test',
        timestamp: Date.now(),
      };
      await memory.store(entry);
    });

    it('should retrieve existing entry', async () => {
      const retrieved = await memory.retrieve('retrieve-test');

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('retrieve-test');
      expect(retrieved?.content).toBe('Retrieve test content');
      expect(retrieved?.type).toBe('test');
    });

    it('should return undefined for non-existent entry', async () => {
      const retrieved = await memory.retrieve('non-existent');
      expect(retrieved).toBeUndefined();
    });

    it('should retrieve entry with metadata', async () => {
      const entryWithMeta: MemoryEntry = {
        id: 'meta-test',
        content: 'Content with metadata',
        type: 'test',
        timestamp: Date.now(),
        metadata: JSON.stringify({ foo: 'bar' }),
      };

      await memory.store(entryWithMeta);
      const retrieved = await memory.retrieve('meta-test');

      expect(retrieved?.metadata).toBeDefined();
    });
  });

  describe('search operation', () => {
    beforeEach(async () => {
      const entries: MemoryEntry[] = [
        {
          id: 'search-1',
          content: 'The quick brown fox',
          type: 'test',
          timestamp: Date.now(),
        },
        {
          id: 'search-2',
          content: 'jumps over the lazy dog',
          type: 'test',
          timestamp: Date.now(),
        },
        {
          id: 'search-3',
          content: 'Another test entry',
          type: 'test',
          timestamp: Date.now(),
        },
      ];

      for (const entry of entries) {
        await memory.store(entry);
      }
    });

    it('should search and find matching entries', async () => {
      const results = await memory.search('fox');

      expect(results).toHaveLength(1);
      expect(results[0].content).toContain('fox');
    });

    it('should search and find multiple matches', async () => {
      const results = await memory.search('test');

      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.content.toLowerCase()).toContain('test');
      });
    });

    it('should return empty array for no matches', async () => {
      const results = await memory.search('nonexistent');
      expect(results).toEqual([]);
    });

    it('should handle case-insensitive search', async () => {
      const results = await memory.search('QUICK');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('data persistence', () => {
    it('should persist data across instances', async () => {
      const entry: MemoryEntry = {
        id: 'persist-test',
        content: 'Persistent content',
        type: 'test',
        timestamp: Date.now(),
      };

      await memory.store(entry);

      // Create new instance with same database
      const memory2 = new LongTermMemory(testDbPath);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const retrieved = await memory2.retrieve('persist-test');
      expect(retrieved).toBeDefined();
      expect(retrieved?.content).toBe('Persistent content');
    });
  });

  describe('error handling', () => {
    it('should handle storing duplicate IDs', async () => {
      const entry: MemoryEntry = {
        id: 'duplicate',
        content: 'First entry',
        type: 'test',
        timestamp: Date.now(),
      };

      await memory.store(entry);

      const duplicateEntry: MemoryEntry = {
        id: 'duplicate',
        content: 'Second entry',
        type: 'test',
        timestamp: Date.now(),
      };

      // Should throw or handle duplicate key error
      await expect(memory.store(duplicateEntry)).rejects.toThrow();
    });
  });
});
