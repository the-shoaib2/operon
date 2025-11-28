import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgentManager } from './AgentManager';
import { Agent, AgentConfig } from './Agent';

// Create a test agent implementation
class TestAgent extends Agent {
  async run(task: string): Promise<any> {
    return { result: `Executed: ${task}` };
  }
}

describe('AgentManager', () => {
  let manager: AgentManager;
  let agent1: TestAgent;
  let agent2: TestAgent;

  beforeEach(() => {
    manager = new AgentManager();
    
    const config1: AgentConfig = {
      id: 'agent-1',
      name: 'Agent 1',
      role: 'worker',
      capabilities: ['test'],
    };
    
    const config2: AgentConfig = {
      id: 'agent-2',
      name: 'Agent 2',
      role: 'executor',
      capabilities: ['execute'],
    };

    agent1 = new TestAgent(config1);
    agent2 = new TestAgent(config2);
  });

  describe('agent registration', () => {
    it('should register an agent', () => {
      manager.registerAgent(agent1);
      
      const retrieved = manager.getAgent('agent-1');
      expect(retrieved).toBe(agent1);
    });

    it('should register multiple agents', () => {
      manager.registerAgent(agent1);
      manager.registerAgent(agent2);

      expect(manager.getAgent('agent-1')).toBe(agent1);
      expect(manager.getAgent('agent-2')).toBe(agent2);
    });

    it('should return undefined for non-existent agent', () => {
      const retrieved = manager.getAgent('non-existent');
      expect(retrieved).toBeUndefined();
    });

    it('should overwrite agent with same id', () => {
      manager.registerAgent(agent1);
      
      const newAgent = new TestAgent({
        id: 'agent-1',
        name: 'New Agent 1',
        role: 'new-role',
        capabilities: ['new'],
      });
      
      manager.registerAgent(newAgent);
      
      const retrieved = manager.getAgent('agent-1');
      expect(retrieved).toBe(newAgent);
      expect(retrieved?.config.name).toBe('New Agent 1');
    });
  });

  describe('agent retrieval', () => {
    beforeEach(() => {
      manager.registerAgent(agent1);
      manager.registerAgent(agent2);
    });

    it('should get all agents', () => {
      const allAgents = manager.getAllAgents();
      
      expect(allAgents).toHaveLength(2);
      expect(allAgents).toContain(agent1);
      expect(allAgents).toContain(agent2);
    });

    it('should return empty array when no agents registered', () => {
      const emptyManager = new AgentManager();
      const allAgents = emptyManager.getAllAgents();
      
      expect(allAgents).toEqual([]);
    });
  });

  describe('agent execution', () => {
    beforeEach(() => {
      manager.registerAgent(agent1);
      manager.registerAgent(agent2);
    });

    it('should run agent by id', async () => {
      const result = await manager.runAgent('agent-1', 'test task');
      
      expect(result).toEqual({ result: 'Executed: test task' });
    });

    it('should throw error for non-existent agent', async () => {
      await expect(
        manager.runAgent('non-existent', 'test task')
      ).rejects.toThrow('Agent non-existent not found');
    });

    it('should run different agents with different tasks', async () => {
      const result1 = await manager.runAgent('agent-1', 'task 1');
      const result2 = await manager.runAgent('agent-2', 'task 2');

      expect(result1.result).toBe('Executed: task 1');
      expect(result2.result).toBe('Executed: task 2');
    });
  });

  describe('agent lifecycle', () => {
    it('should manage agent lifecycle', async () => {
      // Register
      manager.registerAgent(agent1);
      expect(manager.getAgent('agent-1')).toBeDefined();

      // Execute
      const result = await manager.runAgent('agent-1', 'test');
      expect(result).toBeDefined();

      // Retrieve
      const agents = manager.getAllAgents();
      expect(agents).toHaveLength(1);
    });
  });
});
