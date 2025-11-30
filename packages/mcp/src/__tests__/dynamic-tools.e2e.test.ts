import { describe, it, expect, beforeEach } from 'vitest';
import { MCPBroker } from '../Broker';
import { FileSystemTool } from '@operone/fs/src/FileSystemTool';
import { ShellExecutionTool } from '@operone/shell/src/ShellExecutionTool';

describe('Dynamic Tool Discovery E2E Tests', () => {
  let broker: MCPBroker;

  beforeEach(() => {
    broker = new MCPBroker({
      enablePeerNetwork: true,
      peerId: 'test-broker',
      peerName: 'Test Broker'
    });
  });

  it('should register tools dynamically', () => {
    const fsTool = new FileSystemTool();
    const shellTool = new ShellExecutionTool();

    broker.registerTool(fsTool);
    broker.registerTool(shellTool);

    const tools = broker.getTools();
    expect(tools.length).toBeGreaterThanOrEqual(2);
    
    const toolNames = tools.map(t => t.name);
    expect(toolNames).toContain('fs');
    expect(toolNames).toContain('shell');
  });

  it('should support both registration syntaxes', () => {
    const fsTool = new FileSystemTool();
    
    // Test object registration
    broker.registerTool(fsTool);
    expect(broker.getTool('fs')).toBeDefined();

    // Test name + tool registration
    const customTool = {
      name: 'custom',
      description: 'Custom tool',
      execute: async () => ({ success: true })
    };
    
    broker.registerTool('custom', customTool);
    expect(broker.getTool('custom')).toBeDefined();
  });

  it('should discover local tools', async () => {
    const fsTool = new FileSystemTool();
    broker.registerTool(fsTool);

    const tools = await broker.discoverTools(false);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some(t => t.name === 'fs')).toBe(true);
  });

  it('should discover remote tools when peers are registered', async () => {
    // Register a remote peer
    broker.registerPeer({
      id: 'remote-1',
      name: 'Remote Peer 1',
      host: 'remote.example.com',
      port: 8765,
      capabilities: ['fs', 'shell'],
      tools: ['fs', 'shell', 'custom-remote-tool'],
      status: 'online',
      lastSeen: Date.now(),
      load: 20
    });

    const tools = await broker.discoverTools(true);
    const remoteTools = tools.filter(t => t.peerId === 'remote-1');
    
    expect(remoteTools.length).toBe(3);
    expect(remoteTools.map(t => t.name)).toContain('custom-remote-tool');
  });

  it('should manage peer registry', () => {
    const peer1 = {
      id: 'peer-1',
      name: 'Peer 1',
      host: 'localhost',
      port: 8765,
      capabilities: ['fs'],
      tools: ['fs'],
      status: 'online' as const,
      lastSeen: Date.now(),
      load: 10
    };

    broker.registerPeer(peer1);
    
    expect(broker.getPeer('peer-1')).toEqual(peer1);
    expect(broker.getPeers().length).toBe(1);

    broker.unregisterPeer('peer-1');
    expect(broker.getPeer('peer-1')).toBeUndefined();
    expect(broker.getPeers().length).toBe(0);
  });

  it('should update peer status and load', () => {
    const peer = {
      id: 'peer-1',
      name: 'Peer 1',
      host: 'localhost',
      port: 8765,
      capabilities: ['fs'],
      tools: ['fs'],
      status: 'online' as const,
      lastSeen: Date.now(),
      load: 10
    };

    broker.registerPeer(peer);
    
    const initialLastSeen = broker.getPeer('peer-1')!.lastSeen;
    
    // Wait a bit
    setTimeout(() => {
      broker.updatePeerStatus('peer-1', 'busy', 80);
      
      const updatedPeer = broker.getPeer('peer-1')!;
      expect(updatedPeer.status).toBe('busy');
      expect(updatedPeer.load).toBe(80);
      expect(updatedPeer.lastSeen).toBeGreaterThan(initialLastSeen);
    }, 100);
  });

  it('should emit events on tool registration', async () => {
    const eventPromise = new Promise((resolve) => {
      broker.once('tool:registered', (data: any) => {
        expect(data.name).toBe('fs');
        expect(data.tool).toBeDefined();
        resolve(true);
      });
    });

    const fsTool = new FileSystemTool();
    broker.registerTool(fsTool);
    await eventPromise;
  });

  it('should emit events on peer registration', async () => {
    const eventPromise = new Promise((resolve) => {
      broker.once('peer:registered', (peerInfo: any) => {
        expect(peerInfo.id).toBe('peer-1');
        expect(peerInfo.name).toBe('Peer 1');
        resolve(true);
      });
    });

    broker.registerPeer({
      id: 'peer-1',
      name: 'Peer 1',
      host: 'localhost',
      port: 8765,
      capabilities: [],
      tools: [],
      status: 'online',
      lastSeen: Date.now(),
      load: 0
    });
    await eventPromise;
  });
});
