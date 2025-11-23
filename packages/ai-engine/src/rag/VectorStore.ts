export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

export class VectorStore {
  private documents: Map<string, VectorDocument> = new Map();

  /**
   * Simple embedding function using character-based hashing
   * In production, this would use a proper embedding model
   */
  private createEmbedding(text: string): number[] {
    const embedding = new Array(128).fill(0);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      embedding[i % 128] += charCode;
    }
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += (a[i] ?? 0) * (b[i] ?? 0);
    }
    return dotProduct;
  }

  /**
   * Add a document to the vector store
   */
  public async addDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void> {
    const embedding = this.createEmbedding(content);
    this.documents.set(id, { id, content, embedding, metadata });
  }

  /**
   * Search for similar documents using vector similarity
   */
  public async search(query: string, topK: number = 5): Promise<VectorDocument[]> {
    const queryEmbedding = this.createEmbedding(query);
    
    const results = Array.from(this.documents.values())
      .map(doc => ({
        doc,
        similarity: this.cosineSimilarity(queryEmbedding, doc.embedding)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map(result => result.doc);

    return results;
  }

  /**
   * Get document by ID
   */
  public getDocument(id: string): VectorDocument | undefined {
    return this.documents.get(id);
  }

  /**
   * Delete document by ID
   */
  public deleteDocument(id: string): boolean {
    return this.documents.delete(id);
  }

  /**
   * Get total number of documents
   */
  public size(): number {
    return this.documents.size;
  }
}
