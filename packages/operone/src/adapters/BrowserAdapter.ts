import type { ModelInfo, ProviderType, ProviderConfig } from '@repo/types';

/**
 * Browser-compatible Memory Manager
 * Uses localStorage instead of SQLite for browser environments
 */
export interface MemoryEntry {
  id: number;
  content: string;
  timestamp: number;
  metadata?: string;
}

export class BrowserMemoryManager {
  public shortTerm: string[] = [];
  private readonly maxShortTermSize = 10;
  private readonly storageKey = 'operone-long-term-memory';

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage not available, memory features will be limited');
      return;
    }
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  private getStoredEntries(): MemoryEntry[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return [];
    }
  }

  private saveEntries(entries: MemoryEntry[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  public longTerm = {
    query: async (text: string): Promise<string[]> => {
      const entries = this.getStoredEntries();
      const results = entries
        .filter(entry => entry.content.toLowerCase().includes(text.toLowerCase()))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
      
      return results.map(r => r.content);
    },

    store: async (text: string): Promise<void> => {
      const entries = this.getStoredEntries();
      const newEntry: MemoryEntry = {
        id: Date.now(),
        content: text,
        timestamp: Date.now(),
      };
      
      entries.push(newEntry);
      
      if (entries.length > 1000) {
        entries.splice(0, entries.length - 1000);
      }
      
      this.saveEntries(entries);
    }
  };

  public addToShortTerm(content: string): void {
    this.shortTerm.push(content);
    if (this.shortTerm.length > this.maxShortTermSize) {
      this.shortTerm.shift();
    }
  }

  public clearShortTerm(): void {
    this.shortTerm = [];
  }

  public clearLongTerm(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  public getStats(): { vectorDocuments: number; shortTermMemory: number } {
    const entries = this.getStoredEntries();
    return {
      vectorDocuments: entries.length,
      shortTermMemory: this.shortTerm.length,
    };
  }
}

/**
 * Browser-compatible Model Registry
 */
export class BrowserModelRegistry {
  private static models: Record<ProviderType, ModelInfo[]> = {
    openai: [
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', contextWindow: 128000, description: 'Most capable GPT-4 model' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', contextWindow: 128000, description: 'Affordable and fast' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', contextWindow: 128000, description: 'Previous generation flagship' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', contextWindow: 16385, description: 'Fast and efficient' },
    ],
    anthropic: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic', contextWindow: 200000, description: 'Most intelligent model' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'anthropic', contextWindow: 200000, description: 'Fastest model' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', contextWindow: 200000, description: 'Powerful model for complex tasks' },
    ],
    google: [
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', provider: 'google', contextWindow: 1000000, description: 'Latest experimental model' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', contextWindow: 2000000, description: 'Most capable Gemini model' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', contextWindow: 1000000, description: 'Fast and efficient' },
    ],
    mistral: [
      { id: 'mistral-large-latest', name: 'Mistral Large', provider: 'mistral', contextWindow: 128000, description: 'Most capable Mistral model' },
      { id: 'mistral-small-latest', name: 'Mistral Small', provider: 'mistral', contextWindow: 32000, description: 'Efficient and fast' },
      { id: 'codestral-latest', name: 'Codestral', provider: 'mistral', contextWindow: 32000, description: 'Specialized for code' },
    ],
    ollama: [
      { id: 'llama3.2', name: 'Llama 3.2', provider: 'ollama', description: 'Latest Llama model' },
      { id: 'llama3.1', name: 'Llama 3.1', provider: 'ollama', description: 'Previous Llama version' },
      { id: 'mistral', name: 'Mistral', provider: 'ollama', description: 'Mistral 7B' },
      { id: 'codellama', name: 'Code Llama', provider: 'ollama', description: 'Specialized for code' },
      { id: 'phi3', name: 'Phi-3', provider: 'ollama', description: 'Microsoft Phi-3' },
      { id: 'qwen2.5', name: 'Qwen 2.5', provider: 'ollama', description: 'Alibaba Qwen' },
    ],
    openrouter: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'openrouter', description: 'Via OpenRouter' },
      { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openrouter', description: 'Via OpenRouter' },
      { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', provider: 'openrouter', description: 'Via OpenRouter' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'openrouter', description: 'Via OpenRouter' },
    ],
    custom: [],
  };

  static updateOllamaModels(models: ModelInfo[]): void {
    this.models.ollama = models;
  }

  static async getOllamaModelsFromInstance(baseURL: string = 'http://localhost:11434'): Promise<ModelInfo[]> {
    try {
      const response = await fetch(`${baseURL}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        const ollamaModels = data.models || [];
        
        return ollamaModels.map((model: any) => ({
          id: model.name,
          name: model.name,
          provider: 'ollama' as const,
          description: `${model.details?.family || 'Unknown'} - ${model.details?.parameter_size || 'Unknown'}`,
          contextWindow: model.details?.format === 'gguf' ? 4096 : 8192,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error);
    }

    return this.models.ollama;
  }

  static getModels(provider: ProviderType): ModelInfo[] {
    return this.models[provider] || [];
  }

  static getModel(provider: ProviderType, modelId: string): ModelInfo | undefined {
    return this.models[provider]?.find(m => m.id === modelId);
  }

  static getAllProviders(): ProviderType[] {
    return Object.keys(this.models) as ProviderType[];
  }
}

/**
 * Ollama Detector for browser environments
 */
export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  modified_at: string;
}

export interface OllamaInfo {
  version: string;
  build: string;
}

export class OllamaDetector {
  private static instance: OllamaDetector;
  private baseURL: string = 'http://localhost:11434';
  private isAvailable: boolean = false;
  private availableModels: OllamaModel[] = [];

  static getInstance(): OllamaDetector {
    if (!OllamaDetector.instance) {
      OllamaDetector.instance = new OllamaDetector();
    }
    return OllamaDetector.instance;
  }

  async checkAvailability(baseURL?: string): Promise<boolean> {
    if (baseURL) {
      this.baseURL = baseURL;
    }

    try {
      const response = await fetch(`${this.baseURL}/api/version`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        this.isAvailable = true;
        return true;
      }
    } catch (error) {
      console.warn('Ollama not available:', error);
      this.isAvailable = false;
      return false;
    }

    this.isAvailable = false;
    return false;
  }

  async getAvailableModels(): Promise<OllamaModel[]> {
    if (!this.isAvailable) {
      await this.checkAvailability();
    }

    if (!this.isAvailable) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseURL}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        this.availableModels = data?.models || [];
        return this.availableModels;
      }
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error);
    }

    return [];
  }

  async getInfo(): Promise<OllamaInfo | null> {
    if (!this.isAvailable) {
      await this.checkAvailability();
    }

    if (!this.isAvailable) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/api/version`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch Ollama info:', error);
    }

    return null;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  isOllamaAvailable(): boolean {
    return this.isAvailable;
  }

  getCachedModels(): OllamaModel[] {
    return this.availableModels;
  }

  async detectOllama(): Promise<string | null> {
    const commonUrls = [
      'http://localhost:11434',
      'http://127.0.0.1:11434',
      'http://localhost:11435',
      'http://127.0.0.1:11435',
    ];

    for (const url of commonUrls) {
      try {
        if (await this.checkAvailability(url)) {
          return url;
        }
      } catch (error) {
        // Continue to next URL
      }
    }

    return null;
  }
}

/**
 * Browser AI Service - provides AI functionality using Ollama in browser
 */
export class BrowserAIService {
  private ollamaDetector: OllamaDetector;
  private memoryManager: BrowserMemoryManager;
  private baseURL: string | null = null;
  private activeModel: string | null = null;

  constructor() {
    this.ollamaDetector = OllamaDetector.getInstance();
    this.memoryManager = new BrowserMemoryManager();
  }

  async initialize(): Promise<boolean> {
    try {
      const detectedURL = await this.ollamaDetector.detectOllama();
      
      if (detectedURL) {
        this.baseURL = detectedURL;
        await this.loadModels();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to initialize browser AI service:', error);
      return false;
    }
  }

  private async loadModels(): Promise<void> {
    if (!this.baseURL) return;

    const models = await this.ollamaDetector.getAvailableModels();
    if (models.length > 0) {
    if (models.length > 0) {
      this.activeModel = models[0].name;
    }
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.baseURL || !this.activeModel) {
      throw new Error('Ollama not available or no model selected');
    }

    try {
      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.activeModel,
          prompt: message,
          stream: false,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || 'No response received';
    } catch (error) {
      console.error('Error sending message to Ollama:', error);
      throw error;
    }
  }

  getActiveProviderConfig(): ProviderConfig | null {
    if (!this.baseURL || !this.activeModel) {
      return null;
    }

    return {
      type: 'ollama' as const,
      baseURL: this.baseURL,
      model: this.activeModel,
    };
  }

  getAllProviderConfigs(): Record<string, ProviderConfig> {
    const config = this.getActiveProviderConfig();
    return config ? { 'detected-ollama': config } : {};
  }

  async getModels(providerType: 'ollama'): Promise<ModelInfo[]> {
    if (providerType !== 'ollama') {
      return [];
    }

    try {
      const models = await BrowserModelRegistry.getOllamaModelsFromInstance(this.baseURL || 'http://localhost:11434');
      BrowserModelRegistry.updateOllamaModels(models);
      return models;
    } catch (error) {
      console.error('Failed to get Ollama models:', error);
      return [];
    }
  }

  isAvailable(): boolean {
    return this.baseURL !== null && this.activeModel !== null;
  }

  async ingestDocument(id: string, content: string, metadata?: any): Promise<void> {
    this.memoryManager.longTerm.store(content);
  }

  async queryMemory(query: string): Promise<string[]> {
    return await this.memoryManager.longTerm.query(query);
  }

  getMemoryStats(): { vectorDocuments: number; shortTermMemory: number } {
    return this.memoryManager.getStats();
  }

  getOllamaInfo() {
    return this.ollamaDetector.getInfo();
  }
}

/**
 * Browser Adapter - exports all browser-specific utilities
 */
export const BrowserAdapter = {
  BrowserMemoryManager,
  BrowserModelRegistry,
  OllamaDetector,
  BrowserAIService,
};
