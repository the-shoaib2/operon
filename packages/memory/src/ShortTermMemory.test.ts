import { describe, it, expect, beforeEach } from 'vitest';
import { ShortTermMemory } from './ShortTermMemory';

describe('ShortTermMemory', () => {
  let memory: ShortTermMemory<any>;

  beforeEach(() => {
    memory = new ShortTermMemory();
  });

  describe('basic operations', () => {
    it('should set and get value', () => {
      memory.set('key1', 'value1');
      expect(memory.get('key1')).toBe('value1');
    });

    it('should return undefined for non-existent key', () => {
      expect(memory.get('non-existent')).toBeUndefined();
    });

    it('should overwrite existing value', () => {
      memory.set('key1', 'value1');
      memory.set('key1', 'value2');
      expect(memory.get('key1')).toBe('value2');
    });

    it('should handle different data types', () => {
      memory.set('string', 'text');
      memory.set('number', 42);
      memory.set('boolean', true);
      memory.set('object', { foo: 'bar' });
      memory.set('array', [1, 2, 3]);

      expect(memory.get('string')).toBe('text');
      expect(memory.get('number')).toBe(42);
      expect(memory.get('boolean')).toBe(true);
      expect(memory.get('object')).toEqual({ foo: 'bar' });
      expect(memory.get('array')).toEqual([1, 2, 3]);
    });
  });

  describe('has operation', () => {
    it('should return true for existing key', () => {
      memory.set('key1', 'value1');
      expect(memory.has('key1')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(memory.has('non-existent')).toBe(false);
    });

    it('should return true even for undefined values', () => {
      memory.set('key1', undefined);
      expect(memory.has('key1')).toBe(true);
    });
  });

  describe('delete operation', () => {
    it('should delete existing key', () => {
      memory.set('key1', 'value1');
      memory.delete('key1');
      expect(memory.has('key1')).toBe(false);
    });

    it('should handle deleting non-existent key', () => {
      expect(() => memory.delete('non-existent')).not.toThrow();
    });
  });

  describe('clear operation', () => {
    it('should clear all entries', () => {
      memory.set('key1', 'value1');
      memory.set('key2', 'value2');
      memory.set('key3', 'value3');

      memory.clear();

      expect(memory.has('key1')).toBe(false);
      expect(memory.has('key2')).toBe(false);
      expect(memory.has('key3')).toBe(false);
    });

    it('should handle clearing empty memory', () => {
      expect(() => memory.clear()).not.toThrow();
    });
  });

  describe('size operation', () => {
    it('should return correct size', () => {
      expect(memory.size()).toBe(0);

      memory.set('key1', 'value1');
      expect(memory.size()).toBe(1);

      memory.set('key2', 'value2');
      expect(memory.size()).toBe(2);

      memory.delete('key1');
      expect(memory.size()).toBe(1);

      memory.clear();
      expect(memory.size()).toBe(0);
    });
  });

  describe('keys operation', () => {
    it('should return all keys', () => {
      memory.set('key1', 'value1');
      memory.set('key2', 'value2');
      memory.set('key3', 'value3');

      const keys = memory.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
      expect(keys).toHaveLength(3);
    });

    it('should return empty array for empty memory', () => {
      expect(memory.keys()).toEqual([]);
    });
  });

  describe('values operation', () => {
    it('should return all values', () => {
      memory.set('key1', 'value1');
      memory.set('key2', 'value2');
      memory.set('key3', 'value3');

      const values = memory.values();
      expect(values).toContain('value1');
      expect(values).toContain('value2');
      expect(values).toContain('value3');
      expect(values).toHaveLength(3);
    });

    it('should return empty array for empty memory', () => {
      expect(memory.values()).toEqual([]);
    });
  });

  describe('entries operation', () => {
    it('should return all entries', () => {
      memory.set('key1', 'value1');
      memory.set('key2', 'value2');

      const entries = memory.entries();
      expect(entries).toEqual(
        expect.arrayContaining([
          ['key1', 'value1'],
          ['key2', 'value2'],
        ])
      );
    });

    it('should return empty array for empty memory', () => {
      expect(memory.entries()).toEqual([]);
    });
  });

  describe('complex scenarios', () => {
    it('should handle rapid set/get operations', () => {
      for (let i = 0; i < 100; i++) {
        memory.set(`key${i}`, `value${i}`);
      }

      for (let i = 0; i < 100; i++) {
        expect(memory.get(`key${i}`)).toBe(`value${i}`);
      }

      expect(memory.size()).toBe(100);
    });

    it('should maintain data integrity during mixed operations', () => {
      memory.set('key1', 'value1');
      memory.set('key2', 'value2');
      expect(memory.get('key1')).toBe('value1');

      memory.delete('key1');
      expect(memory.has('key1')).toBe(false);
      expect(memory.get('key2')).toBe('value2');

      memory.set('key3', 'value3');
      expect(memory.size()).toBe(2);
    });
  });
});
