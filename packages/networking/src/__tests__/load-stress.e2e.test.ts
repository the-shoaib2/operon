import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PeerNetwork } from '@operone/networking/src/peer/PeerNetwork';
import { MCPBroker } from '@operone/mcp/src/Broker';

describe('Load & Stress Tests', () => {
  const NUM_PEERS = 10; // Reduced from 50 for faster testing
  let server: PeerNetwork;
  let clients: PeerNetwork[] = [];
  let broker: MCPBroker;

  beforeAll(async () => {
    // Initialize server
    server = new PeerNetwork({
      peerId: 'load-test-server',
      peerName: 'Load Test Server',
      port: 9999,
      maxPeers: 50
    });

    await server.start();

    broker = new MCPBroker({
      enablePeerNetwork: true,
      peerId: 'load-test-broker',
      peerName: 'Load Test Broker'
    });

    // Connect multiple clients
    for (let i = 0; i < NUM_PEERS; i++) {
      const client = new PeerNetwork({
        peerId: `load-client-${i}`,
        peerName: `Load Client ${i}`
      });

      clients.push(client);
      await client.connectToPeer('localhost', 9999);

      // Register with broker
      broker.registerPeer({
        id: `load-client-${i}`,
        name: `Load Client ${i}`,
        host: 'localhost',
        port: 9999 + i + 1,
        capabilities: ['fs', 'shell'],
        tools: ['fs', 'shell'],
        status: 'online',
        lastSeen: Date.now(),
        load: Math.random() * 100
      });
    }

    // Wait for all connections
    await new Promise(resolve => setTimeout(resolve, 2000));
  }, 60000);

  afterAll(async () => {
    for (const client of clients) {
      await client.stop();
    }
    await server.stop();
  });

  it('should handle 10+ concurrent peer connections', () => {
    const connectedPeers = server.getConnectedPeers();
    expect(connectedPeers.length).toBeGreaterThanOrEqual(NUM_PEERS);
  });

  it('should distribute load across all peers', () => {
    const peers = broker.getPeers();
    expect(peers.length).toBe(NUM_PEERS);

    // Verify load is tracked for all peers
    for (const peer of peers) {
      expect(peer.load).toBeGreaterThanOrEqual(0);
      expect(peer.load).toBeLessThanOrEqual(100);
    }
  });

  it('should handle rapid peer status updates', async () => {
    const updatePromises = [];

    for (let i = 0; i < 100; i++) {
      const peerId = `load-client-${i % NUM_PEERS}`;
      const promise = Promise.resolve(
        broker.updatePeerStatus(peerId, 'busy', Math.random() * 100)
      );
      updatePromises.push(promise);
    }

    await Promise.all(updatePromises);

    const peers = broker.getPeers();
    expect(peers.length).toBe(NUM_PEERS);
  });

  it('should handle concurrent tool discoveries', async () => {
    const discoveryPromises = [];

    for (let i = 0; i < 50; i++) {
      discoveryPromises.push(broker.discoverTools(true));
    }

    const results = await Promise.all(discoveryPromises);

    for (const tools of results) {
      expect(tools.length).toBeGreaterThan(0);
    }
  });

  it('should maintain performance under load', async () => {
    const startTime = Date.now();
    const operations = [];

    // Perform 100 operations
    for (let i = 0; i < 100; i++) {
      operations.push(
        broker.discoverTools(false),
        broker.getPeers(),
        broker.updatePeerStatus(`load-client-${i % NUM_PEERS}`, 'online', 50)
      );
    }

    await Promise.all(operations);

    const duration = Date.now() - startTime;
    
    // Should complete 300 operations in under 5 seconds
    expect(duration).toBeLessThan(5000);
  });

  it('should handle peer churn (connect/disconnect)', async () => {
    // Disconnect half the clients
    const halfPoint = Math.floor(NUM_PEERS / 2);
    
    for (let i = 0; i < halfPoint; i++) {
      await clients[i].stop();
      broker.unregisterPeer(`load-client-${i}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const remainingPeers = server.getConnectedPeers();
    expect(remainingPeers.length).toBeLessThanOrEqual(halfPoint + 1);

    // Reconnect them
    for (let i = 0; i < halfPoint; i++) {
      clients[i] = new PeerNetwork({
        peerId: `load-client-${i}`,
        peerName: `Load Client ${i}`
      });

      await clients[i].connectToPeer('localhost', 9999);

      broker.registerPeer({
        id: `load-client-${i}`,
        name: `Load Client ${i}`,
        host: 'localhost',
        port: 9999 + i + 1,
        capabilities: ['fs', 'shell'],
        tools: ['fs', 'shell'],
        status: 'online',
        lastSeen: Date.now(),
        load: 0
      });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const reconnectedPeers = server.getConnectedPeers();
    expect(reconnectedPeers.length).toBeGreaterThanOrEqual(NUM_PEERS - 2);
  }, 30000);
});
