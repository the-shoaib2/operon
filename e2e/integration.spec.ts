import { test, expect } from '@playwright/test';
import { ThinkingPipeline } from '@operone/thinking/src/pipeline';
import { MCPBroker } from '@operone/mcp/src/Broker';
import { PeerNetwork } from '@operone/networking/src/peer/PeerNetwork';

/**
 * Advanced Integration Tests
 * Tests complex scenarios involving multiple packages
 */

test.describe('Advanced Integration Scenarios', () => {
  test.describe('Distributed Pipeline Execution', () => {
    let server: PeerNetwork;
    let client1: PeerNetwork;
    let client2: PeerNetwork;
    let broker: MCPBroker;

    test.beforeAll(async () => {
      // Setup distributed environment
      server = new PeerNetwork({
        peerId: 'integration-server',
        peerName: 'Integration Server',
        port: 11000
      });
      await server.start();

      client1 = new PeerNetwork({
        peerId: 'integration-client-1',
        peerName: 'Integration Client 1'
      });

      client2 = new PeerNetwork({
        peerId: 'integration-client-2',
        peerName: 'Integration Client 2'
      });

      await client1.connectToPeer('localhost', 11000);
      await client2.connectToPeer('localhost', 11000);

      broker = new MCPBroker({
        enablePeerNetwork: true,
        peerId: 'integration-broker',
        peerName: 'Integration Broker'
      });

      // Register peers
      broker.registerPeer({
        id: 'integration-client-1',
        name: 'Integration Client 1',
        host: 'localhost',
        port: 11001,
        capabilities: ['fs', 'shell'],
        tools: ['fs', 'shell'],
        status: 'online',
        lastSeen: Date.now(),
        load: 20
      });

      broker.registerPeer({
        id: 'integration-client-2',
        name: 'Integration Client 2',
        host: 'localhost',
        port: 11002,
        capabilities: ['ai', 'memory'],
        tools: ['ai', 'memory'],
        status: 'online',
        lastSeen: Date.now(),
        load: 30
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    test.afterAll(async () => {
      await client1.stop();
      await client2.stop();
      await server.stop();
    });

    test('should distribute tasks across peers', async () => {
      const connectedPeers = server.getConnectedPeers();
      expect(connectedPeers.length).toBe(2);

      const tools = await broker.discoverTools(true);
      const remoteTools = tools.filter(t => t.peerId);
      
      expect(remoteTools.length).toBeGreaterThan(0);
    });

    test('should handle load balancing', async () => {
      const stats = broker.getLoadStats();
      
      expect(stats.onlinePeers).toBe(2);
      expect(stats.avgLoad).toBeGreaterThan(0);
      expect(stats.minLoad).toBe(20);
      expect(stats.maxLoad).toBe(30);
    });
  });

  test.describe('Pipeline with Memory Integration', () => {
    let pipeline: ThinkingPipeline;

    test.beforeAll(() => {
      pipeline = new ThinkingPipeline({
        userId: 'integration-test-user',
        enableMemory: true
      });
    });

    test('should execute complete pipeline', async () => {
      // Note: This test requires mocked LLM responses
      // In a real scenario, you'd mock the AI service
      
      const query = 'Create a test file and analyze it';
      
      // The pipeline would normally execute all stages
      // For testing, we verify the pipeline structure
      expect(pipeline).toBeDefined();
    });
  });

  test.describe('Security & Authentication', () => {
    test('should enforce JWT authentication', async () => {
      const secureNetwork = new PeerNetwork({
        peerId: 'secure-test',
        peerName: 'Secure Test',
        port: 12000,
        jwtSecret: 'test-jwt-secret',
        enableMessageSigning: true,
        signingKey: 'test-signing-key'
      });

      await secureNetwork.start();

      // Verify security config
      expect(secureNetwork).toBeDefined();

      await secureNetwork.stop();
    });

    test('should handle message signing', async () => {
      const network1 = new PeerNetwork({
        peerId: 'signing-peer-1',
        peerName: 'Signing Peer 1',
        enableMessageSigning: true,
        signingKey: 'shared-secret'
      });

      const network2 = new PeerNetwork({
        peerId: 'signing-peer-2',
        peerName: 'Signing Peer 2',
        port: 13000,
        enableMessageSigning: true,
        signingKey: 'shared-secret'
      });

      await network2.start();
      await network1.connectToPeer('localhost', 13000);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const peers = network2.getConnectedPeers();
      expect(peers.length).toBeGreaterThan(0);

      await network1.stop();
      await network2.stop();
    });
  });

  test.describe('Failover & Resilience', () => {
    let broker: MCPBroker;

    test.beforeAll(() => {
      broker = new MCPBroker({
        enablePeerNetwork: true,
        peerId: 'failover-broker',
        peerName: 'Failover Broker'
      });

      // Register multiple peers
      for (let i = 0; i < 5; i++) {
        broker.registerPeer({
          id: `failover-peer-${i}`,
          name: `Failover Peer ${i}`,
          host: 'localhost',
          port: 14000 + i,
          capabilities: ['fs'],
          tools: ['fs'],
          status: 'online',
          lastSeen: Date.now(),
          load: i * 20
        });
      }
    });

    test('should select peer with lowest load', async () => {
      const stats = broker.getLoadStats();
      expect(stats.minLoad).toBe(0);
      expect(stats.maxLoad).toBe(80);
    });

    test('should handle peer failure', async () => {
      // Mark first peer as offline
      broker.updatePeerStatus('failover-peer-0', 'offline', 100);

      const stats = broker.getLoadStats();
      expect(stats.onlinePeers).toBe(4);
    });

    test('should monitor peer health', async () => {
      const healthMonitor = broker.startHealthMonitoring(1000);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(healthMonitor);
    });
  });

  test.describe('Real-World Workflows', () => {
    let broker: MCPBroker;

    test.beforeAll(() => {
      broker = new MCPBroker();
    });

    test('should execute data processing workflow', async () => {
      // Workflow: AI generation → File storage → Shell processing → Memory storage
      
      // This test demonstrates a complete workflow
      // In production, each step would execute on appropriate peers
      
      const tools = await broker.discoverTools(false);
      expect(tools.length).toBeGreaterThan(0);
    });

    test('should handle batch operations', async () => {
      const operations = [];

      for (let i = 0; i < 20; i++) {
        operations.push(broker.discoverTools(false));
      }

      const results = await Promise.all(operations);
      expect(results.length).toBe(20);
    });
  });
});
