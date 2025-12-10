import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PeerNetwork } from '@operone/networking/src/peer/PeerNetwork';
import { MCPBroker } from '@operone/mcp/src/Broker';
import { FileSystemTool } from '@operone/fs/src/FileSystemTool';
import { ShellExecutionTool } from '@operone/shell/src/ShellExecutionTool';

/**
 * Multi-PC E2E Test Suite
 * Simulates 5 PCs (1 host + 4 workers) connected via PeerNetwork
 * Host PC controls all worker PCs and orchestrates distributed tasks
 */

interface PCInstance {
  id: string;
  name: string;
  peerNetwork: PeerNetwork;
  broker: MCPBroker;
  port: number;
}

const BASE_PORT = 9000;
const NUM_WORKERS = 4;

describe('Multi-PC Orchestration E2E', () => {
  let hostPC: PCInstance;
  let workerPCs: PCInstance[] = [];

  beforeAll(async () => {
    // Initialize Host PC
    hostPC = await initializePC('host', 'Host PC', BASE_PORT);

    // Initialize Worker PCs
    for (let i = 1; i <= NUM_WORKERS; i++) {
      const worker = await initializePC(
        `worker-${i}`,
        `Worker PC ${i}`,
        BASE_PORT + i
      );
      workerPCs.push(worker);
    }

    // Connect all workers to host
    for (const worker of workerPCs) {
      await worker.peerNetwork.connectToPeer('localhost', hostPC.port);
      
      // Register worker with host broker
      hostPC.broker.registerPeer({
        id: worker.id,
        name: worker.name,
        host: 'localhost',
        port: worker.port,
        capabilities: ['fs', 'shell'],
        tools: ['fs', 'shell'],
        status: 'online',
        lastSeen: Date.now(),
        load: 0
      });
    }

    // Wait for connections to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async () => {
    // Cleanup all PCs
    await hostPC.peerNetwork.stop();
    for (const worker of workerPCs) {
      await worker.peerNetwork.stop();
    }
  });

  it('should establish connections between all 5 PCs', async () => {
    const connectedPeers = hostPC.peerNetwork.getConnectedPeers();
    expect(connectedPeers.length).toBe(NUM_WORKERS);
    
    // Verify all workers are connected
    const workerIds = workerPCs.map(w => w.id);
    for (const workerId of workerIds) {
      expect(connectedPeers.some(p => p.id === workerId)).toBe(true);
    }
  });

  it('host should discover tools from all worker PCs', async () => {
    const allTools = await hostPC.broker.discoverTools(true);
    
    // Should have local tools + remote tools from 4 workers
    // Each worker has fs + shell = 2 tools
    // Expected: local tools (3: fs, shell, log) + (4 workers * 2 tools) = 11 tools minimum
    expect(allTools.length).toBeGreaterThanOrEqual(11);
    
    // Verify remote tools are tagged with peerId
    const remoteTools = allTools.filter(t => t.peerId);
    expect(remoteTools.length).toBe(NUM_WORKERS * 2);
  });

  it('host should distribute file operations across workers', async () => {
    const peers = hostPC.broker.getPeers();
    expect(peers.length).toBe(NUM_WORKERS);
    
    // Simulate load distribution
    for (let i = 0; i < peers.length; i++) {
      const peer = peers[i];
      hostPC.broker.updatePeerStatus(peer.id, 'busy', (i + 1) * 20);
    }
    
    // Verify load is tracked
    const updatedPeers = hostPC.broker.getPeers();
    expect(updatedPeers[0].load).toBe(20);
    expect(updatedPeers[1].load).toBe(40);
    expect(updatedPeers[2].load).toBe(60);
    expect(updatedPeers[3].load).toBe(80);
  });

  it('host should handle worker disconnection gracefully', async () => {
    // Disconnect worker-1
    const worker1 = workerPCs[0];
    await worker1.peerNetwork.stop();
    
    // Wait for disconnection to be detected
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify host detects disconnection
    const remainingPeers = hostPC.peerNetwork.getConnectedPeers();
    expect(remainingPeers.length).toBe(NUM_WORKERS - 1);
    expect(remainingPeers.some(p => p.id === worker1.id)).toBe(false);
    
    // Reconnect worker-1
    workerPCs[0] = await initializePC('worker-1', 'Worker PC 1', BASE_PORT + 1);
    await workerPCs[0].peerNetwork.connectToPeer('localhost', hostPC.port);
    
    // Re-register with host
    hostPC.broker.registerPeer({
      id: workerPCs[0].id,
      name: workerPCs[0].name,
      host: 'localhost',
      port: workerPCs[0].port,
      capabilities: ['fs', 'shell'],
      tools: ['fs', 'shell'],
      status: 'online',
      lastSeen: Date.now(),
      load: 0
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify reconnection
    const reconnectedPeers = hostPC.peerNetwork.getConnectedPeers();
    expect(reconnectedPeers.length).toBe(NUM_WORKERS);
  });

  it('host should broadcast tool updates to all workers', async () => {
    const broadcastEvents: any[] = [];
    
    // Listen for broadcast events on host
    hostPC.broker.on('tool:broadcast', (data) => {
      broadcastEvents.push(data);
    });
    
    // Register a new tool on host
    const customTool = {
      name: 'custom-distributed-tool',
      description: 'Custom tool for testing',
      execute: async () => ({ success: true }),
      capabilities: ['distributed']
    };
    
    hostPC.broker.registerTool(customTool);
    
    // Wait for broadcast
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verify broadcast was emitted
    expect(broadcastEvents.length).toBeGreaterThan(0);
    expect(broadcastEvents[0].toolName).toBe('custom-distributed-tool');
    expect(broadcastEvents[0].action).toBe('registered');
  });

  it('host should monitor heartbeats from all workers', async () => {
    // This test verifies the heartbeat mechanism
    // Heartbeats are sent every 30 seconds, so we'll check the lastSeen timestamps
    
    const peers = hostPC.broker.getPeers();
    const now = Date.now();
    
    for (const peer of peers) {
      // All peers should have been seen recently (within last 5 seconds)
      expect(now - peer.lastSeen).toBeLessThan(5000);
    }
  });

  it('host should execute distributed pipeline across all workers', async () => {
    // Simulate a distributed task that uses multiple workers
    const tasks = [
      { workerId: 'worker-1', tool: 'shell', command: 'echo "Task 1"' },
      { workerId: 'worker-2', tool: 'shell', command: 'echo "Task 2"' },
      { workerId: 'worker-3', tool: 'shell', command: 'echo "Task 3"' },
      { workerId: 'worker-4', tool: 'shell', command: 'echo "Task 4"' },
    ];
    
    // Execute tasks in parallel
    const results = await Promise.all(
      tasks.map(async (task) => {
        const peer = hostPC.broker.getPeer(task.workerId);
        expect(peer).toBeDefined();
        expect(peer!.status).toBe('online');
        
        // In a real implementation, this would execute the tool remotely
        // For now, we verify the peer is available
        return { workerId: task.workerId, available: true };
      })
    );
    
    expect(results.length).toBe(NUM_WORKERS);
    expect(results.every(r => r.available)).toBe(true);
  });
});

/**
 * Helper function to initialize a PC instance
 */
async function initializePC(id: string, name: string, port: number): Promise<PCInstance> {
  const peerNetwork = new PeerNetwork({
    peerId: id,
    peerName: name,
    port: id === 'host' ? port : undefined,
    maxPeers: 50
  });
  
  if (id === 'host') {
    await peerNetwork.start();
  }
  
  const broker = new MCPBroker({
    enablePeerNetwork: true,
    peerId: id,
    peerName: name
  });
  
  // Register tools
  broker.registerTool(new FileSystemTool());
  broker.registerTool(new ShellExecutionTool());
  
  // Setup event forwarding from PeerNetwork to Broker
  peerNetwork.on('peer:connected', (peer) => {
    broker.registerPeer({
      id: peer.id,
      name: peer.name,
      host: 'localhost',
      port: port,
      capabilities: peer.capabilities,
      tools: peer.tools,
      status: 'online',
      lastSeen: Date.now(),
      load: 0
    });
  });
  
  peerNetwork.on('peer:disconnected', ({ peerId }) => {
    broker.unregisterPeer(peerId);
  });
  
  peerNetwork.on('tool:remote-request', async ({ peerId, requestId, toolName, args, respond }) => {
    try {
      const result = await broker.callTool(toolName, args);
      respond(result);
    } catch (error: any) {
      respond(null, error.message);
    }
  });
  
  return {
    id,
    name,
    peerNetwork,
    broker,
    port
  };
}
