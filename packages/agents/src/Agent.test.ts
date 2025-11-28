import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Agent, AgentConfig } from './Agent';

// Create a concrete implementation for testing
class TestAgent extends Agent {
  async run(task: string): Promise<any> {
    this.emit('start', task);
    return { result: `Executed: ${task}` };
  }
}

describe('Agent', () => {
  let agent: TestAgent;
  let config: AgentConfig;

  beforeEach(() => {
    config = {
      id: 'test-agent-1',
      name: 'Test Agent',
      role: 'tester',
      capabilities: ['test', 'execute'],
      memoryPath: ':memory:',
    };
    agent = new TestAgent(config);
  });

  describe('initialization', () => {
    it('should initialize with config', () => {
      expect(agent.config).toEqual(config);
      expect(agent.config.id).toBe('test-agent-1');
      expect(agent.config.name).toBe('Test Agent');
    });

    it('should initialize memory systems', () => {
      expect(agent['shortTermMemory']).toBeDefined();
      expect(agent['longTermMemory']).toBeDefined();
    });

    it('should initialize planner', () => {
      expect(agent['planner']).toBeDefined();
    });

    it('should initialize AI orchestrator', () => {
      expect(agent['ai']).toBeDefined();
    });

    it('should initialize context manager', () => {
      expect(agent['context']).toBeDefined();
    });
  });

  describe('event emission', () => {
    it('should emit start event on run', async () => {
      const startHandler = vi.fn();
      agent.on('start', startHandler);

      await agent.run('test task');

      expect(startHandler).toHaveBeenCalledWith('test task');
    });

    it('should emit stopped event on stop', async () => {
      const stoppedHandler = vi.fn();
      agent.on('stopped', stoppedHandler);

      await agent.stop();

      expect(stoppedHandler).toHaveBeenCalled();
    });
  });

  describe('task execution', () => {
    it('should execute task', async () => {
      const result = await agent.run('test task');

      expect(result).toBeDefined();
      expect(result.result).toBe('Executed: test task');
    });
  });

  describe('configuration', () => {
    it('should handle optional memoryPath', () => {
      const configWithoutMemory: AgentConfig = {
        id: 'agent-2',
        name: 'Agent 2',
        role: 'worker',
        capabilities: ['work'],
      };

      const agent2 = new TestAgent(configWithoutMemory);
      expect(agent2['longTermMemory']).toBeDefined();
    });

    it('should handle optional modelConfig', () => {
      const configWithModel: AgentConfig = {
        id: 'agent-3',
        name: 'Agent 3',
        role: 'worker',
        capabilities: ['work'],
        modelConfig: { path: 'custom-model' },
      };

      const agent3 = new TestAgent(configWithModel);
      expect(agent3['ai']).toBeDefined();
    });

    it('should store capabilities', () => {
      expect(agent.config.capabilities).toEqual(['test', 'execute']);
      expect(agent.config.capabilities).toHaveLength(2);
    });
  });
});
