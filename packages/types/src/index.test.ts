import { describe, it, expect } from 'vitest';
import type {
  Agent,
  Memory,
  MCPTool,
  ProviderType,
  ProviderConfig,
  ModelInfo,
  ChatMessage,
  AIServiceConfig,
  MessageType,
} from './index';

describe('@repo/types', () => {
  describe('Type Exports', () => {
    it('should export Agent interface', () => {
      const agent: Agent = {
        id: 'test-agent',
        name: 'Test Agent',
        role: 'os',
        think: async (_input: string) => 'thinking...',
        act: async (_action: string) => {},
        observe: async () => 'observing...',
      };
      
      expect(agent.id).toBe('test-agent');
      expect(agent.role).toBe('os');
    });

    it('should export Memory interface', () => {
      const memory: Memory = {
        shortTerm: ['memory1', 'memory2'],
        longTerm: {
          query: async (_text: string) => ['result1'],
          store: async (_text: string) => {},
        },
      };
      
      expect(memory.shortTerm).toHaveLength(2);
      expect(typeof memory.longTerm.query).toBe('function');
    });

    it('should export MCPTool interface', () => {
      const tool: MCPTool = {
        name: 'test-tool',
        description: 'A test tool',
        execute: async (_args: Record<string, unknown>) => ({ success: true }),
      };
      
      expect(tool.name).toBe('test-tool');
      expect(typeof tool.execute).toBe('function');
    });
  });

  describe('Provider Types', () => {
    it('should support all provider types', () => {
      const providers: ProviderType[] = [
        'openai',
        'anthropic',
        'ollama',
        'openrouter',
        'google',
        'mistral',
        'custom',
      ];
      
      expect(providers).toHaveLength(7);
    });

    it('should create OpenAI config', () => {
      const config: ProviderConfig = {
        type: 'openai',
        apiKey: 'test-key',
        model: 'gpt-4',
        organization: 'test-org',
      };
      
      expect(config.type).toBe('openai');
      expect(config.model).toBe('gpt-4');
    });

    it('should create Ollama config', () => {
      const config: ProviderConfig = {
        type: 'ollama',
        baseURL: 'http://localhost:11434',
        model: 'llama2',
      };
      
      expect(config.type).toBe('ollama');
      expect(config.baseURL).toBe('http://localhost:11434');
    });

    it('should create Google config', () => {
      const config: ProviderConfig = {
        type: 'google',
        apiKey: 'test-key',
        model: 'gemini-pro',
      };
      
      expect(config.type).toBe('google');
      expect(config.model).toBe('gemini-pro');
    });
  });

  describe('Model Types', () => {
    it('should create ModelInfo', () => {
      const model: ModelInfo = {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        contextWindow: 8192,
        maxTokens: 4096,
        description: 'Most capable GPT-4 model',
      };
      
      expect(model.id).toBe('gpt-4');
      expect(model.provider).toBe('openai');
      expect(model.contextWindow).toBe(8192);
    });
  });

  describe('Chat Message Types', () => {
    it('should create text message', () => {
      const message: ChatMessage = {
        id: 'msg-1',
        role: 'user',
        content: 'Hello',
        timestamp: new Date(),
        type: 'text',
      };
      
      expect(message.role).toBe('user');
      expect(message.type).toBe('text');
    });

    it('should create message with images', () => {
      const message: ChatMessage = {
        id: 'msg-2',
        role: 'assistant',
        content: 'Here is an image',
        timestamp: new Date(),
        type: 'image',
        images: [
          {
            base64: 'base64-data',
            mediaType: 'image/png',
            width: 512,
            height: 512,
          },
        ],
      };
      
      expect(message.images).toHaveLength(1);
      expect(message.images?.[0]?.mediaType).toBe('image/png');
    });

    it('should support all message types', () => {
      const types: MessageType[] = ['text', 'image', 'exact-text', 'mixed'];
      expect(types).toHaveLength(4);
    });
  });

  describe('AI Service Config', () => {
    it('should create AIServiceConfig', () => {
      const config: AIServiceConfig = {
        defaultProvider: 'openai',
        providers: {
          'openai-1': {
            type: 'openai',
            apiKey: 'key-1',
            model: 'gpt-4',
          },
          'ollama-1': {
            type: 'ollama',
            baseURL: 'http://localhost:11434',
            model: 'llama2',
          },
        },
      };
      
      expect(config.defaultProvider).toBe('openai');
      expect(Object.keys(config.providers)).toHaveLength(2);
    });
  });
});
