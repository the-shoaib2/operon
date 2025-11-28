import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WorkerAgent } from './WorkerAgent';
import { AgentConfig } from './Agent';

// Mock dependencies
vi.mock('@operone/memory', () => ({
  ShortTermMemory: vi.fn().mockImplementation(() => ({
    set: vi.fn(),
    get: vi.fn(),
  })),
  LongTermMemory: vi.fn().mockImplementation(() => ({
    store: vi.fn().mockResolvedValue(undefined),
    retrieve: vi.fn(),
    search: vi.fn(),
  })),
}));

vi.mock('@operone/thinking', () => ({
  DependencyGraph: vi.fn().mockImplementation(() => ({
    addTask: vi.fn(),
    getTasks: vi.fn(),
  })),
}));

vi.mock('@operone/ai', () => ({
  AIOrchestrator: vi.fn().mockImplementation(() => ({
    processRequest: vi.fn().mockResolvedValue('AI response'),
  })),
}));

vi.mock('@operone/context', () => ({
  ContextManager: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

describe('WorkerAgent', () => {
  let agent: WorkerAgent;
  let config: AgentConfig;

  beforeEach(() => {
    vi.clearAllMocks();
    config = {
      id: 'worker-1',
      name: 'Worker Agent',
      role: 'worker',
      capabilities: ['execute', 'process'],
      memoryPath: ':memory:',
    };
    agent = new WorkerAgent(config);
  });

  describe('initialization', () => {
    it('should initialize as WorkerAgent', () => {
      expect(agent).toBeInstanceOf(WorkerAgent);
      expect(agent.config.id).toBe('worker-1');
    });
  });

  describe('task execution', () => {
    it('should emit start event when running task', async () => {
      const startHandler = vi.fn();
      agent.on('start', startHandler);

      await agent.run('test task');

      expect(startHandler).toHaveBeenCalledWith('test task');
    });

    it('should store task in short-term memory', async () => {
      const setMock = agent['shortTermMemory'].set as any;

      await agent.run('test task');

      expect(setMock).toHaveBeenCalledWith('current_task', 'test task');
    });

    it('should store task in long-term memory', async () => {
      const storeMock = agent['longTermMemory'].store as any;

      await agent.run('test task');

      expect(storeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'test task',
          type: 'task_request',
        })
      );
    });

    it('should add task to planner', async () => {
      const addTaskMock = agent['planner'].addTask as any;

      await agent.run('test task');

      expect(addTaskMock).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'test task',
          status: 'pending',
        })
      );
    });

    it('should process task with AI', async () => {
      const processRequestMock = agent['ai'].processRequest as any;

      await agent.run('test task');

      expect(processRequestMock).toHaveBeenCalledWith('Execute task: test task');
    });

    it('should store result in long-term memory', async () => {
      const storeMock = agent['longTermMemory'].store as any;

      await agent.run('test task');

      // Should be called twice: once for task, once for result
      expect(storeMock).toHaveBeenCalledTimes(2);
      expect(storeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'AI response',
          type: 'task_result',
        })
      );
    });

    it('should emit completed event with result', async () => {
      const completedHandler = vi.fn();
      agent.on('completed', completedHandler);

      await agent.run('test task');

      expect(completedHandler).toHaveBeenCalledWith('AI response');
    });

    it('should return AI response', async () => {
      const result = await agent.run('test task');

      expect(result).toBe('AI response');
    });
  });

  describe('error handling', () => {
    it('should emit error event on failure', async () => {
      const errorHandler = vi.fn();
      agent.on('error', errorHandler);

      // Make AI processing fail
      const processRequestMock = agent['ai'].processRequest as any;
      processRequestMock.mockRejectedValueOnce(new Error('AI failed'));

      await expect(agent.run('test task')).rejects.toThrow('AI failed');
      expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should propagate errors', async () => {
      const processRequestMock = agent['ai'].processRequest as any;
      processRequestMock.mockRejectedValueOnce(new Error('Processing error'));

      await expect(agent.run('test task')).rejects.toThrow('Processing error');
    });
  });

  describe('workflow integration', () => {
    it('should execute complete workflow', async () => {
      const startHandler = vi.fn();
      const completedHandler = vi.fn();

      agent.on('start', startHandler);
      agent.on('completed', completedHandler);

      const result = await agent.run('complex task');

      // Verify workflow steps
      expect(startHandler).toHaveBeenCalled();
      expect(agent['shortTermMemory'].set).toHaveBeenCalled();
      expect(agent['longTermMemory'].store).toHaveBeenCalled();
      expect(agent['planner'].addTask).toHaveBeenCalled();
      expect(agent['ai'].processRequest).toHaveBeenCalled();
      expect(completedHandler).toHaveBeenCalled();
      expect(result).toBe('AI response');
    });
  });
});
