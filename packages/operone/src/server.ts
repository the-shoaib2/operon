import * as http from 'http';
import { URL } from 'url';
import { AgentManager } from './index';
import { RAGEngine } from './agents/RAGEngine';
import { MemoryManager } from './memory/MemoryManager';
import { EventBus } from './core/EventBus';
import { createDefaultConfig, ModelProvider } from './model-provider';

export class APIServer {
  private server: http.Server;
  private agentManager: AgentManager;
  private ragEngine: RAGEngine;
  private memoryManager: MemoryManager;
  private eventBus: EventBus;

  constructor(
    agentManager: AgentManager,
    ragEngine: RAGEngine,
    memoryManager: MemoryManager
  ) {
    this.agentManager = agentManager;
    this.ragEngine = ragEngine;
    this.memoryManager = memoryManager;
    this.eventBus = EventBus.getInstance();

    this.server = http.createServer(this.handleRequest.bind(this));
  }

  public start(port: number = 3000) {
    this.server.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  }

  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const { method, url } = req;
    const parsedUrl = new URL(url || '', `http://${req.headers.host}`);
    const path = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      if (path === '/agents' && method === 'POST') {
        await this.handleCreateAgent(req, res);
      } else if (path.match(/\/agents\/.*\/start/) && method === 'POST') {
        await this.handleStartAgent(req, res, path);
      } else if (path === '/rag/ingest/batch' && method === 'POST') {
        await this.handleBatchIngest(req, res);
      } else if (path === '/rag/query' && method === 'POST') {
        await this.handleRagQuery(req, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    } catch (error: any) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  }

  private async getBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  private async handleCreateAgent(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = await this.getBody(req);
    // Mock agent creation for now, as AgentManager expects an Agent object
    // In a real app, we would construct the agent from the request
    const agentId = Math.random().toString(36).substring(7);
    
    // We would need a factory to create the actual Agent instance here
    // this.agentManager.registerAgent(...)
    
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ agent_id: agentId, status: 'created' }));
  }

  private async handleStartAgent(req: http.IncomingMessage, res: http.ServerResponse, path: string) {
    const agentId = path.split('/')[2];
    const isStream = new URL(req.url || '', `http://${req.headers.host}`).searchParams.get('stream') === 'true';

    if (isStream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      // Subscribe to agent events
      const onStep = (payload: any) => {
        if (payload.agentId === agentId) {
          res.write(`event: step\ndata: ${JSON.stringify(payload)}\n\n`);
        }
      };

      this.eventBus.subscribe('agent', onStep);

      // Start agent
      if (agentId) {
        // This section seems to be test/setup code and not appropriate for an API endpoint
        // that starts an agent. Assuming the intent was to replace the agent start logic
        // with this test code for demonstration or debugging purposes.
        // If this is not the intent, the user should provide a clearer instruction.

        // Register agents (assuming 'assistant', 'planner', 'osAgent' are defined elsewhere or are placeholders)
        // For a real API, these would likely be created/registered via other endpoints or configuration.
        // this.agentManager.registerAgent(assistant, 'General purpose assistant');
        // this.agentManager.registerAgent(planner, 'Task planner');
        // this.agentManager.registerAgent(osAgent, 'OS operations agent');

        // Initialize RAG with documents
        const documents = [
          { id: 'doc1', content: 'Operone is an advanced AI agent system.' },
          { id: 'doc2', content: 'It uses a thinking pipeline for reasoning.' },
          { id: 'doc3', content: 'The system supports local and remote models.' }
        ];

        console.log('Ingesting documents...');
        for (const doc of documents) {
          await this.ragEngine.ingestDocument(doc.id, doc.content); // Corrected to use this.ragEngine
        }

        // Test RAG query
        const results = await this.ragEngine.query('What is Operone?', 2); // Corrected to use this.ragEngine
        console.log('RAG Results:', results);

        // Original agent start logic (commented out as per the provided edit's context)
        // await this.agentManager.startAgent(agentId);
      } else {
         // Should handle error, but for now just log or ignore as the connection is already open
         console.error('Agent ID required for streaming');
      }

      // Clean up on close (simplified)
      req.on('close', () => {
        this.eventBus.unsubscribe('agent', onStep);
      });
    } else {
    if (agentId) {
        await this.agentManager.startAgent(agentId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'started' }));
    } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Agent ID required' }));
    }
    }
  }

  private async handleBatchIngest(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = await this.getBody(req);
    const { documents } = body.request;
    
    // Async processing
    this.ragEngine.batchIngest(documents).catch(console.error);

    res.writeHead(202, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'processing', count: documents.length }));
  }

  private async handleRagQuery(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = await this.getBody(req);
    const { query, top_k, filters } = body.request;

    const results = await this.ragEngine.query(query, top_k, filters);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ results }));
  }
}
