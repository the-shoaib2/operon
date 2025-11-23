import { VectorStore } from './VectorStore';
import { MemoryManager } from '../memory/MemoryManager';

export interface RAGResult {
  content: string;
  relevance: number;
  source: 'vector' | 'memory';
}

export class RAGEngine {
  private vectorStore: VectorStore;
  private memoryManager: MemoryManager;

  constructor(memoryManager: MemoryManager) {
    this.vectorStore = new VectorStore();
    this.memoryManager = memoryManager;
  }

  /**
   * Ingest a document into the RAG system
   */
  public async ingestDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void> {
    // Add to vector store for semantic search
    await this.vectorStore.addDocument(id, content, metadata);
    
    // Also store in long-term memory
    await this.memoryManager.longTerm.store(content);
  }

  /**
   * Query the RAG system for relevant information
   */
  public async query(question: string, topK: number = 3): Promise<RAGResult[]> {
    // Search vector store
    const vectorResults = await this.vectorStore.search(question, topK);
    
    // Search long-term memory
    const memoryResults = await this.memoryManager.longTerm.query(question);
    
    // Combine and deduplicate results
    const results: RAGResult[] = [];
    
    vectorResults.forEach((doc, index) => {
      results.push({
        content: doc.content,
        relevance: 1 - (index / vectorResults.length),
        source: 'vector'
      });
    });
    
    memoryResults.forEach((content, index) => {
      // Avoid duplicates
      if (!results.some(r => r.content === content)) {
        results.push({
          content,
          relevance: 0.5 - (index / memoryResults.length) * 0.5,
          source: 'memory'
        });
      }
    });
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, topK);
  }

  /**
   * Get statistics about the RAG system
   */
  public getStats(): { vectorDocuments: number; shortTermMemory: number } {
    return {
      vectorDocuments: this.vectorStore.size(),
      shortTermMemory: this.memoryManager.shortTerm.length
    };
  }
}
