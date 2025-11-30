import { test, expect } from '@playwright/test';
import { MCPBroker } from '@operone/mcp/src/Broker';
import { FileSystemTool } from '@operone/fs/src/FileSystemTool';
import { ShellExecutionTool } from '@operone/shell/src/ShellExecutionTool';
import { AutomationTool } from '@operone/automation/src/AutomationTool';
import { AITool } from '@operone/ai/src/AITool';
import { MemoryTool } from '@operone/memory/src/MemoryTool';
import { PeerNetwork } from '@operone/networking/src/peer/PeerNetwork';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Comprehensive Playwright E2E Test Suite
 * Tests all packages with real-world scenarios
 */

test.describe('Complete Package E2E Tests', () => {
  let broker: MCPBroker;
  let testDir: string;

  test.beforeAll(async () => {
    testDir = path.join(__dirname, 'temp_playwright_test');
    await fs.mkdir(testDir, { recursive: true });

    broker = new MCPBroker({
      enablePeerNetwork: false
    });

    // Register all tools
    broker.registerTool(new FileSystemTool([testDir]));
    broker.registerTool(new ShellExecutionTool());
    broker.registerTool(new AutomationTool());
    broker.registerTool(new AITool());
    broker.registerTool(new MemoryTool());
  });

  test.afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test.describe('@operone/fs - File System Package', () => {
    test('should perform complete file lifecycle', async () => {
      const testFile = path.join(testDir, 'lifecycle-test.txt');

      // Create file
      const writeResult = await broker.callTool('fs', {
        operation: 'write',
        filePath: testFile,
        content: 'Initial content'
      });
      expect(writeResult.success).toBe(true);

      // Read file
      const readResult = await broker.callTool('fs', {
        operation: 'read',
        filePath: testFile
      });
      expect(readResult).toBe('Initial content');

      // Get metadata
      const metaResult = await broker.callTool('fs', {
        operation: 'metadata',
        filePath: testFile
      });
      expect(metaResult.isFile).toBe(true);
      expect(metaResult.size).toBeGreaterThan(0);

      // Delete file
      const deleteResult = await broker.callTool('fs', {
        operation: 'delete',
        filePath: testFile
      });
      expect(deleteResult.success).toBe(true);
    });

    test('should list directory contents', async () => {
      const result = await broker.callTool('fs', {
        operation: 'list',
        filePath: testDir
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  test.describe('@operone/shell - Shell Execution Package', () => {
    test('should execute simple commands', async () => {
      const result = await broker.callTool('shell', {
        command: 'echo "Hello from shell"'
      });
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Hello from shell');
    });

    test('should handle command with environment variables', async () => {
      const result = await broker.callTool('shell', {
        command: 'echo $TEST_VAR',
        env: { TEST_VAR: 'test-value' }
      });
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('test-value');
    });

    test('should respect working directory', async () => {
      const result = await broker.callTool('shell', {
        command: 'pwd',
        cwd: testDir
      });
      expect(result.success).toBe(true);
      expect(result.stdout).toContain(testDir);
    });
  });

  test.describe('@operone/automation - Automation Package', () => {
    test('should schedule and manage tasks', async () => {
      // Schedule task
      const scheduleResult = await broker.callTool('automation', {
        operation: 'schedule',
        taskId: 'test-task-1',
        script: 'echo "automated task"',
        schedule: '0 * * * *'
      });
      expect(scheduleResult.success).toBe(true);

      // List tasks
      const listResult = await broker.callTool('automation', {
        operation: 'list'
      });
      expect(listResult.count).toBeGreaterThan(0);
      expect(listResult.tasks.some((t: any) => t.id === 'test-task-1')).toBe(true);

      // Execute task
      const execResult = await broker.callTool('automation', {
        operation: 'execute',
        taskId: 'test-task-1'
      });
      expect(execResult.success).toBe(true);

      // Cancel task
      const cancelResult = await broker.callTool('automation', {
        operation: 'cancel',
        taskId: 'test-task-1'
      });
      expect(cancelResult.success).toBe(true);
    });
  });

  test.describe('@operone/ai - AI Package', () => {
    test('should generate text', async () => {
      const result = await broker.callTool('ai', {
        operation: 'generate',
        prompt: 'Test prompt',
        model: 'test-model'
      });
      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
    });

    test('should create embeddings', async () => {
      const result = await broker.callTool('ai', {
        operation: 'embed',
        text: 'Sample text for embedding'
      });
      expect(result.success).toBe(true);
      expect(result.embedding).toBeDefined();
      expect(result.dimensions).toBe(1536);
    });

    test('should analyze text', async () => {
      const result = await broker.callTool('ai', {
        operation: 'analyze',
        text: 'This is a test sentence for analysis'
      });
      expect(result.success).toBe(true);
      expect(result.keywords).toBeDefined();
    });

    test('should handle chat completion', async () => {
      const result = await broker.callTool('ai', {
        operation: 'chat',
        prompt: 'Hello, how are you?'
      });
      expect(result.success).toBe(true);
      expect(result.response).toBeDefined();
    });
  });

  test.describe('@operone/memory - Memory Package', () => {
    test('should store and recall data', async () => {
      // Store data
      const storeResult = await broker.callTool('memory', {
        operation: 'store',
        key: 'test-key',
        value: { data: 'test-value', timestamp: Date.now() }
      });
      expect(storeResult.success).toBe(true);

      // Recall data
      const recallResult = await broker.callTool('memory', {
        operation: 'recall',
        key: 'test-key'
      });
      expect(recallResult.success).toBe(true);
      expect(recallResult.value.data).toBe('test-value');
    });

    test('should search stored data', async () => {
      // Store multiple items
      await broker.callTool('memory', {
        operation: 'store',
        key: 'search-1',
        value: { content: 'apple banana' }
      });
      await broker.callTool('memory', {
        operation: 'store',
        key: 'search-2',
        value: { content: 'orange grape' }
      });

      // Search
      const searchResult = await broker.callTool('memory', {
        operation: 'search',
        query: 'apple'
      });
      expect(searchResult.success).toBe(true);
      expect(searchResult.results.length).toBeGreaterThan(0);
    });

    test('should handle sync operation', async () => {
      const syncResult = await broker.callTool('memory', {
        operation: 'sync'
      });
      expect(syncResult.success).toBe(true);
    });
  });

  test.describe('@operone/mcp - MCP Broker Package', () => {
    test('should discover all registered tools', async () => {
      const tools = await broker.discoverTools(false);
      const toolNames = tools.map(t => t.name);

      expect(toolNames).toContain('fs');
      expect(toolNames).toContain('shell');
      expect(toolNames).toContain('automation');
      expect(toolNames).toContain('ai');
      expect(toolNames).toContain('memory');
    });

    test('should handle tool registration events', async () => {
      let eventFired = false;

      broker.once('tool:registered', () => {
        eventFired = true;
      });

      broker.registerTool({
        name: 'test-tool',
        description: 'Test tool',
        execute: async () => ({ success: true })
      });

      expect(eventFired).toBe(true);
    });
  });

  test.describe('@operone/networking - Networking Package', () => {
    test('should create and start peer network', async () => {
      const network = new PeerNetwork({
        peerId: 'test-peer',
        peerName: 'Test Peer',
        port: 9876
      });

      await network.start();
      
      const peers = network.getConnectedPeers();
      expect(Array.isArray(peers)).toBe(true);

      await network.stop();
    });

    test('should support secure configuration', () => {
      const network = new PeerNetwork({
        peerId: 'secure-peer',
        peerName: 'Secure Peer',
        enableTLS: false, // Would be true with certs
        jwtSecret: 'test-secret',
        enableMessageSigning: true,
        signingKey: 'signing-key'
      });

      expect(network).toBeDefined();
    });
  });

  test.describe('Cross-Package Integration', () => {
    test('should execute workflow across multiple packages', async () => {
      // 1. Store data in memory
      await broker.callTool('memory', {
        operation: 'store',
        key: 'workflow-data',
        value: { step: 1, status: 'started' }
      });

      // 2. Create file with AI-generated content
      const aiResult = await broker.callTool('ai', {
        operation: 'generate',
        prompt: 'Generate test content'
      });

      const testFile = path.join(testDir, 'workflow-test.txt');
      await broker.callTool('fs', {
        operation: 'write',
        filePath: testFile,
        content: aiResult.output
      });

      // 3. Execute shell command on the file
      const shellResult = await broker.callTool('shell', {
        command: `cat ${testFile}`
      });
      expect(shellResult.success).toBe(true);

      // 4. Schedule automation task
      await broker.callTool('automation', {
        operation: 'schedule',
        taskId: 'workflow-task',
        script: `echo "Processing ${testFile}"`,
        schedule: '0 0 * * *'
      });

      // 5. Update memory with completion
      await broker.callTool('memory', {
        operation: 'store',
        key: 'workflow-data',
        value: { step: 5, status: 'completed' }
      });

      // Verify final state
      const finalState = await broker.callTool('memory', {
        operation: 'recall',
        key: 'workflow-data'
      });
      expect(finalState.value.status).toBe('completed');
    });

    test('should handle error propagation across packages', async () => {
      // Attempt invalid file operation
      await expect(
        broker.callTool('fs', {
          operation: 'read',
          filePath: '/nonexistent/path/file.txt'
        })
      ).rejects.toThrow();

      // Memory should still work
      const memResult = await broker.callTool('memory', {
        operation: 'store',
        key: 'error-test',
        value: { error: 'handled' }
      });
      expect(memResult.success).toBe(true);
    });
  });

  test.describe('Performance & Load Testing', () => {
    test('should handle concurrent operations', async () => {
      const operations = [];

      for (let i = 0; i < 50; i++) {
        operations.push(
          broker.callTool('memory', {
            operation: 'store',
            key: `concurrent-${i}`,
            value: { index: i }
          })
        );
      }

      const results = await Promise.all(operations);
      expect(results.every(r => r.success)).toBe(true);
    });

    test('should maintain performance under load', async () => {
      const startTime = Date.now();
      const operations = [];

      for (let i = 0; i < 100; i++) {
        operations.push(broker.discoverTools(false));
      }

      await Promise.all(operations);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
    });
  });
});
