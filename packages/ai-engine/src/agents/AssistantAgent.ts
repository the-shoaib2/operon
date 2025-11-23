import { Agent } from '@repo/types';
import { RAGEngine } from '../rag/RAGEngine';
import { MemoryManager } from '../memory/MemoryManager';
import { generateText } from 'ai';

export interface AssistantAgentConfig {
  model: any; // Vercel AI SDK model
  memoryManager: MemoryManager;
}

export class AssistantAgent implements Agent {
  public readonly id = 'assistant-agent';
  public readonly name = 'Assistant Agent';
  public readonly role = 'assistant' as const;

  private model: any;
  private ragEngine: RAGEngine;
  private memoryManager: MemoryManager;
  private lastThought: string = '';

  constructor(config: AssistantAgentConfig) {
    this.model = config.model;
    this.memoryManager = config.memoryManager;
    this.ragEngine = new RAGEngine(this.memoryManager);
  }

  async think(input: string): Promise<string> {
    // Query RAG for relevant context
    const ragResults = await this.ragEngine.query(input, 3);
    const context = ragResults.map(r => r.content).join('\n');

    // Add to short-term memory
    this.memoryManager.addToShortTerm(input);

    const systemPrompt = `You are an intelligent assistant with access to:
- Long-term memory (RAG-based retrieval)
- Short-term conversation memory
- Vector-based document search

Use the provided context to answer questions accurately.
If you have a final answer, prefix it with "FINAL ANSWER:".`;

    const { text } = await generateText({
      model: this.model,
      system: systemPrompt,
      prompt: `Context from memory:\n${context}\n\nUser question: ${input}\n\nProvide a thoughtful response.`,
    });

    this.lastThought = text;
    return text;
  }

  async act(action: string): Promise<void> {
    // Store important information in long-term memory
    if (action.length > 50) {
      await this.memoryManager.longTerm.store(action);
    }
  }

  async observe(): Promise<string> {
    return this.lastThought;
  }

  /**
   * Ingest documents into the RAG system
   */
  async ingestDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void> {
    await this.ragEngine.ingestDocument(id, content, metadata);
  }

  /**
   * Get RAG statistics
   */
  getStats() {
    return this.ragEngine.getStats();
  }
}
