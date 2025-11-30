import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PeerNetwork } from '../peer/PeerNetwork';
import { MCPBroker } from '@operone/mcp/src/Broker';
import { FileSystemTool } from '@operone/fs/src/FileSystemTool';

describe('Multi-PC Network E2E Tests', () => {
  let server: PeerNetwork;
  let client1: PeerNetwork;
  let client2: PeerNetwork;
  let broker: MCPBroker;

  const SERVER_PORT = 9876;

  beforeAll(async () => {
    // Initialize server
    server = new PeerNetwork({
      peerId: 'server-1',
      peerName: 'Test Server',
      port: SERVER_PORT
    });

    await server.start();

    // Initialize clients
    client1 = new PeerNetwork({
      peerId: 'client-1',
      peerName: 'Test Client 1'
    });

    client2 = new PeerNetwork({
      peerId: 'client-2',
      peerName: 'Test Client 2'
    });

    // Initialize MCP Broker with peer network enabled
    broker = new MCPBroker({
      enablePeerNetwork: true,
      peerId: 'broker-1',
      peerName: 'Test Broker'
    });

    // Register a test tool
    const fsTool = new FileSystemTool();
    broker.registerTool(fsTool);
  });

  afterAll(async () => {
    await server.stop();
    await client1.stop();
    await client2.stop();
  });

  it('should establish peer connections', async () => {
    // Connect clients to server
    await client1.connectToPeer('localhost', SERVER_PORT);
    await client2.connectToPeer('localhost', SERVER_PORT);

    // Wait for connections to establish
    await new Promise(resolve => setTimeout(resolve, 1000));

    const connectedPeers = server.getConnectedPeers();
    expect(connectedPeers.length).toBe(2);
    expect(connectedPeers.map(p => p.id)).toContain('client-1');
    expect(connectedPeers.map(p => p.id)).toContain('client-2');
  });

  it('should discover tools across peers', async () => {
    // Register peer with broker
    broker.registerPeer({
      id: 'client-1',
      name: 'Test Client 1',
      host: 'localhost',
      port: SERVER_PORT,
      capabilities: ['fs', 'shell'],
      tools: ['fs', 'shell'],
      status: 'online',
      lastSeen: Date.now(),
      load: 10
    });

    const tools = await broker.discoverTools(true);
    expect(tools.length).toBeGreaterThan(0);
    
    const toolNames = tools.map(t => t.name);
    expect(toolNames).toContain('fs');
  });

  it('should handle heartbeat monitoring', async () => {
    const heartbeatReceived = new Promise((resolve) => {
      server.once('message', (message: any) => {
        if (message.type === 'heartbeat') {
          resolve(true);
        }
      });
    });

    // Heartbeat should be sent automatically
    const result = await Promise.race([
      heartbeatReceived,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Heartbeat timeout')), 35000))
    ]);

    expect(result).toBe(true);
  }, 40000);

  it('should handle peer disconnection gracefully', async () => {
    const disconnectPromise = new Promise((resolve) => {
      server.once('peer:disconnected', (data: any) => {
        resolve(data.peerId);
      });
    });

    // Disconnect client1
    await client1.stop();

    const disconnectedPeerId = await disconnectPromise;
    expect(disconnectedPeerId).toBe('client-1');

    const remainingPeers = server.getConnectedPeers();
    expect(remainingPeers.length).toBe(1);
    expect(remainingPeers[0].id).toBe('client-2');
  });
});
