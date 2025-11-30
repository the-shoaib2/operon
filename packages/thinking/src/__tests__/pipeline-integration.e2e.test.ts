import { describe, it, expect, beforeEach } from 'vitest';
import { ThinkingPipeline } from '../pipeline';
import { MCPBroker } from '@operone/mcp/src/Broker';
import { FileSystemTool } from '@operone/fs/src/FileSystemTool';
import { ShellExecutionTool } from '@operone/shell/src/ShellExecutionTool';
import { AutomationTool } from '@operone/automation/src/AutomationTool';
import { AITool } from '@operone/ai/src/AITool';
import { MemoryTool } from '@operone/memory/src/MemoryTool';

describe('Complete Pipeline Integration E2E Tests', () => {
  let pipeline: ThinkingPipeline;
  let broker: MCPBroker;

  beforeEach(() => {
    broker = new MCPBroker({
      enablePeerNetwork: false
    });

    // Register all tools
    broker.registerTool(new FileSystemTool());
    broker.registerTool(new ShellExecutionTool());
    broker.registerTool(new AutomationTool());
    broker.registerTool(new AITool());
    broker.registerTool(new MemoryTool());

    pipeline = new ThinkingPipeline({
      userId: 'test-user',
      enableMemory: true
    });
  });

  it('should discover all registered tools', async () => {
    const tools = await broker.discoverTools(false);
    const toolNames = tools.map(t => t.name);

    expect(toolNames).toContain('fs');
    expect(toolNames).toContain('shell');
    expect(toolNames).toContain('automation');
    expect(toolNames).toContain('ai');
    expect(toolNames).toContain('memory');
    expect(toolNames).toContain('log');
  });

  it('should execute file system operations', async () => {
    const result = await broker.callTool('fs', {
      operation: 'metadata',
      filePath: __filename
    });

    expect(result).toBeDefined();
    expect(result.isFile).toBe(true);
  });

  it('should execute shell operations', async () => {
    const result = await broker.callTool('shell', {
      command: 'echo "test"'
    });

    expect(result.success).toBe(true);
    expect(result.stdout).toContain('test');
  });

  it('should execute automation operations', async () => {
    const scheduleResult = await broker.callTool('automation', {
      operation: 'schedule',
      taskId: 'task-1',
      script: 'echo "scheduled"',
      schedule: '0 0 * * *'
    });

    expect(scheduleResult.success).toBe(true);
    expect(scheduleResult.taskId).toBe('task-1');

    const listResult = await broker.callTool('automation', {
      operation: 'list'
    });

    expect(listResult.count).toBe(1);
    expect(listResult.tasks[0].id).toBe('task-1');
  });

  it('should execute AI operations', async () => {
    const result = await broker.callTool('ai', {
      operation: 'generate',
      prompt: 'Hello, world!',
      model: 'test-model'
    });

    expect(result.success).toBe(true);
    expect(result.output).toBeDefined();
    expect(result.model).toBe('test-model');
  });

  it('should execute memory operations', async () => {
    const storeResult = await broker.callTool('memory', {
      operation: 'store',
      key: 'test-key',
      value: { data: 'test-value' }
    });

    expect(storeResult.success).toBe(true);

    const recallResult = await broker.callTool('memory', {
      operation: 'recall',
      key: 'test-key'
    });

    expect(recallResult.success).toBe(true);
    expect(recallResult.value.data).toBe('test-value');
  });

  it('should handle complex pipeline with multiple tools', async () => {
    // Store something in memory
    await broker.callTool('memory', {
      operation: 'store',
      key: 'pipeline-test',
      value: { step: 1 }
    });

    // Schedule a task
    await broker.callTool('automation', {
      operation: 'schedule',
      taskId: 'pipeline-task',
      script: 'echo "pipeline"',
      schedule: '0 * * * *'
    });

    // Generate AI response
    const aiResult = await broker.callTool('ai', {
      operation: 'generate',
      prompt: 'Summarize pipeline execution'
    });

    expect(aiResult.success).toBe(true);

    // Verify all operations succeeded
    const memoryResult = await broker.callTool('memory', {
      operation: 'recall',
      key: 'pipeline-test'
    });

    expect(memoryResult.value.step).toBe(1);
  });

  it('should handle tool errors gracefully', async () => {
    await expect(
      broker.callTool('fs', {
        operation: 'read',
        filePath: '/nonexistent/file.txt'
      })
    ).rejects.toThrow();
  });

  it('should support all tool capabilities', () => {
    const tools = broker.getTools();
    
    for (const tool of tools) {
      if ('capabilities' in tool) {
        expect(tool.capabilities).toBeDefined();
        expect(Array.isArray(tool.capabilities)).toBe(true);
      }
    }
  });
});
