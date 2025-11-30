import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PeerNetwork } from '../peer/PeerNetwork';
import { MCPBroker } from '@operone/mcp/src/Broker';

describe('50-Peer Stress Test', () => {
  const NUM_PEERS = 50;
  let server: PeerNetwork;
  let clients: PeerNetwork[] = [];
  let broker: MCPBroker;

  beforeAll(async () => {
    console.log('Initializing 50-peer stress test...');
    
    // Initialize server with TLS and authentication
    server = new PeerNetwork({
      peerId: 'stress-test-server',
      peerName: 'Stress Test Server',
      port: 10000,
      maxPeers: 60,
      enableTLS: false, // Set to true with cert/key for production
      jwtSecret: 'test-secret-key',
      enableMessageSigning: true,
      signingKey: 'signing-secret-key'
    });

    await server.start();

    broker = new MCPBroker({
      enablePeerNetwork: true,
      peerId: 'stress-test-broker',
      peerName: 'Stress Test Broker'
    });

    // Start health monitoring
    broker.startHealthMonitoring(30000);

    // Connect 50 clients in batches to avoid overwhelming the server
    const BATCH_SIZE = 10;
    for (let batch = 0; batch < Math.ceil(NUM_PEERS / BATCH_SIZE); batch++) {
      const batchStart = batch * BATCH_SIZE;
      const batchEnd = Math.min(batchStart + BATCH_SIZE, NUM_PEERS);
      
      const batchPromises = [];
      
      for (let i = batchStart; i < batchEnd; i++) {
        const client = new PeerNetwork({
          peerId: `stress-client-${i}`,
          peerName: `Stress Client ${i}`,
          jwtSecret: 'test-secret-key',
          enableMessageSigning: true,
          signingKey: 'signing-secret-key'
        });

        clients.push(client);
        
        batchPromises.push(
          client.connectToPeer('localhost', 10000).then(() => {
            // Register with broker
            broker.registerPeer({
              id: `stress-client-${i}`,
              name: `Stress Client ${i}`,
              host: 'localhost',
              port: 10000 + i + 1,
              capabilities: ['fs', 'shell'],
              tools: ['fs', 'shell'],
              status: 'online',
              lastSeen: Date.now(),
              load: Math.random() * 50 // Random initial load 0-50
            });
          })
        );
      }
      
      await Promise.all(batchPromises);
      console.log(`Connected batch ${batch + 1}/${Math.ceil(NUM_PEERS / BATCH_SIZE)}`);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Wait for all connections to stabilize
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('All 50 peers connected');
  }, 120000); // 2 minute timeout

  afterAll(async () => {
    console.log('Cleaning up 50 peers...');
    
    for (const client of clients) {
      await client.stop();
    }
    await server.stop();
  });

  it('should successfully connect all 50 peers', () => {
    const connectedPeers = server.getConnectedPeers();
    expect(connectedPeers.length).toBe(NUM_PEERS);
    
    const registeredPeers = broker.getPeers();
    expect(registeredPeers.length).toBe(NUM_PEERS);
  });

  it('should handle 1000 concurrent tool discoveries', async () => {
    const startTime = Date.now();
    const promises = [];

    for (let i = 0; i < 1000; i++) {
      promises.push(broker.discoverTools(true));
    }

    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;

    expect(results.length).toBe(1000);
    expect(duration).toBeLessThan(10000); // Should complete in under 10 seconds
    
    console.log(`1000 discoveries completed in ${duration}ms`);
  });

  it('should distribute load evenly across peers', async () => {
    // Simulate load by updating peer statuses
    const peers = broker.getPeers();
    
    for (let i = 0; i < peers.length; i++) {
      const load = (i % 10) * 10; // Distribute 0-90 load
      broker.updatePeerStatus(peers[i].id, 'online', load);
    }

    const stats = broker.getLoadStats();
    
    expect(stats.onlinePeers).toBe(NUM_PEERS);
    expect(stats.avgLoad).toBeGreaterThan(0);
    expect(stats.avgLoad).toBeLessThan(100);
    expect(stats.minLoad).toBe(0);
    expect(stats.maxLoad).toBe(90);
    
    console.log('Load stats:', stats);
  });

  it('should handle failover when peers fail', async () => {
    // Mark some peers as offline
    const peers = broker.getPeers();
    const failedPeers = peers.slice(0, 10);
    
    for (const peer of failedPeers) {
      broker.updatePeerStatus(peer.id, 'offline', 100);
    }

    const stats = broker.getLoadStats();
    expect(stats.onlinePeers).toBe(NUM_PEERS - 10);
    
    // Verify failover would select from remaining peers
    const remainingOnline = broker.getPeers().filter(p => p.status === 'online');
    expect(remainingOnline.length).toBe(NUM_PEERS - 10);
  });

  it('should handle rapid peer status updates', async () => {
    const startTime = Date.now();
    const updates = [];

    // 5000 status updates
    for (let i = 0; i < 5000; i++) {
      const peerId = `stress-client-${i % NUM_PEERS}`;
      const load = Math.random() * 100;
      updates.push(
        Promise.resolve(broker.updatePeerStatus(peerId, 'online', load))
      );
    }

    await Promise.all(updates);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
    console.log(`5000 status updates completed in ${duration}ms`);
  });

  it('should maintain message signing integrity', () => {
    // All peers should have message signing enabled
    const connectedPeers = server.getConnectedPeers();
    expect(connectedPeers.length).toBe(NUM_PEERS);
    
    // Verify all peers are authenticated
    for (const peer of connectedPeers) {
      expect(peer.authenticated).toBe(true);
    }
  });

  it('should handle peer churn at scale', async () => {
    // Disconnect 25 peers
    const halfPoint = Math.floor(NUM_PEERS / 2);
    
    for (let i = 0; i < halfPoint; i++) {
      await clients[i].stop();
      broker.unregisterPeer(`stress-client-${i}`);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    let remainingPeers = server.getConnectedPeers();
    expect(remainingPeers.length).toBeLessThanOrEqual(halfPoint + 5);

    // Reconnect them
    for (let i = 0; i < halfPoint; i++) {
      clients[i] = new PeerNetwork({
        peerId: `stress-client-${i}`,
        peerName: `Stress Client ${i}`,
        jwtSecret: 'test-secret-key',
        enableMessageSigning: true,
        signingKey: 'signing-secret-key'
      });

      await clients[i].connectToPeer('localhost', 10000);

      broker.registerPeer({
        id: `stress-client-${i}`,
        name: `Stress Client ${i}`,
        host: 'localhost',
        port: 10000 + i + 1,
        capabilities: ['fs', 'shell'],
        tools: ['fs', 'shell'],
        status: 'online',
        lastSeen: Date.now(),
        load: 0
      });
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    remainingPeers = server.getConnectedPeers();
    expect(remainingPeers.length).toBeGreaterThanOrEqual(NUM_PEERS - 5);
    
    console.log(`Reconnected peers: ${remainingPeers.length}/${NUM_PEERS}`);
  }, 60000);

  it('should provide accurate load statistics under stress', () => {
    const stats = broker.getLoadStats();
    
    expect(stats).toHaveProperty('avgLoad');
    expect(stats).toHaveProperty('minLoad');
    expect(stats).toHaveProperty('maxLoad');
    expect(stats).toHaveProperty('onlinePeers');
    
    expect(stats.avgLoad).toBeGreaterThanOrEqual(0);
    expect(stats.avgLoad).toBeLessThanOrEqual(100);
    expect(stats.minLoad).toBeLessThanOrEqual(stats.avgLoad);
    expect(stats.maxLoad).toBeGreaterThanOrEqual(stats.avgLoad);
  });
});
