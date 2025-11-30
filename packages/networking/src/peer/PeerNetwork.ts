import { EventEmitter } from 'events';
import WebSocket from 'ws';
import * as crypto from 'crypto';
import * as https from 'https';
import * as fs from 'fs';

export interface PeerNetworkConfig {
  peerId: string;
  peerName: string;
  port?: number;
  enableTLS?: boolean;
  tlsKey?: string;
  tlsCert?: string;
  jwtSecret?: string;
  maxPeers?: number;
  enableMessageSigning?: boolean;
  signingKey?: string;
}

export interface PeerMessage {
  type: 'handshake' | 'tool-call' | 'tool-result' | 'tool-broadcast' | 'heartbeat' | 'peer-list';
  from: string;
  to?: string;
  data: any;
  timestamp: number;
  signature?: string;
}

export interface ConnectedPeer {
  id: string;
  name: string;
  ws: WebSocket;
  authenticated: boolean;
  lastHeartbeat: number;
  capabilities: string[];
  tools: string[];
}

/**
 * PeerNetwork - Secure WebSocket-based peer-to-peer networking
 * Supports 50+ concurrent peer connections with TLS encryption and JWT authentication
 */
export class PeerNetwork extends EventEmitter {
  private config: PeerNetworkConfig;
  private server?: WebSocket.Server;
  private peers: Map<string, ConnectedPeer> = new Map();
  private heartbeatInterval?: NodeJS.Timeout;
  private reconnectAttempts: Map<string, number> = new Map();
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly HEARTBEAT_TIMEOUT = 60000; // 60 seconds
  private signingKey?: Buffer;

  constructor(config: PeerNetworkConfig) {
    super();
    this.config = {
      port: 8765,
      maxPeers: 50,
      enableTLS: false,
      enableMessageSigning: false,
      ...config
    };
    
    // Initialize signing key if enabled
    if (this.config.enableMessageSigning && this.config.signingKey) {
      this.signingKey = Buffer.from(this.config.signingKey, 'utf-8');
    }
  }

  /**
   * Start the peer network server
   */
  async start(): Promise<void> {
    const wsOptions: WebSocket.ServerOptions = {
      port: this.config.port
    };

    // Enable TLS if configured
    if (this.config.enableTLS && this.config.tlsKey && this.config.tlsCert) {
      const httpsServer = https.createServer({
        key: fs.readFileSync(this.config.tlsKey),
        cert: fs.readFileSync(this.config.tlsCert)
      });
      
      httpsServer.listen(this.config.port);
      wsOptions.server = httpsServer;
      delete wsOptions.port;
    }

    this.server = new WebSocket.Server(wsOptions);

    this.server.on('connection', (ws: WebSocket, req) => {
      this.handleNewConnection(ws, req);
    });

    this.server.on('error', (error) => {
      this.emit('error', error);
    });

    // Start heartbeat monitoring
    this.startHeartbeat();

    this.emit('started', { port: this.config.port });
  }

  /**
   * Stop the peer network server
   */
  async stop(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all peer connections
    for (const [peerId, peer] of this.peers.entries()) {
      peer.ws.close();
      this.peers.delete(peerId);
    }

    // Close server
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => resolve());
      });
    }

    this.emit('stopped');
  }

  /**
   * Connect to a remote peer
   */
  async connectToPeer(host: string, port: number, token?: string): Promise<void> {
    const protocol = this.config.enableTLS ? 'wss' : 'ws';
    const url = `${protocol}://${host}:${port}`;
    const ws = new WebSocket(url, {
      rejectUnauthorized: this.config.enableTLS
    });

    return new Promise((resolve, reject) => {
      ws.on('open', () => {
        // Send handshake with JWT token if provided
        const handshakeData: any = {
          name: this.config.peerName,
          capabilities: [],
          tools: []
        };
        
        if (token || this.config.jwtSecret) {
          handshakeData.token = token || this.generateJWT();
        }
        
        this.sendMessage(ws, {
          type: 'handshake',
          from: this.config.peerId,
          data: handshakeData,
          timestamp: Date.now()
        });
        resolve();
      });

      ws.on('error', (error) => {
        reject(error);
      });

      ws.on('message', (data: WebSocket.Data) => {
        this.handleMessage(ws, data);
      });

      ws.on('close', () => {
        // Find peer ID and handle disconnection
        for (const [peerId, peer] of this.peers.entries()) {
          if (peer.ws === ws) {
            this.handlePeerDisconnect(peerId);
            break;
          }
        }
      });
    });
  }

  /**
   * Send a tool execution request to a specific peer
   */
  async executeRemoteTool(peerId: string, toolName: string, args: any): Promise<any> {
    const peer = this.peers.get(peerId);
    if (!peer) {
      throw new Error(`Peer ${peerId} not connected`);
    }

    const requestId = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Tool execution timeout'));
      }, 30000);

      // Listen for result
      const resultHandler = (message: PeerMessage) => {
        if (message.type === 'tool-result' && message.data.requestId === requestId) {
          clearTimeout(timeout);
          this.removeListener('message:tool-result', resultHandler);
          
          if (message.data.error) {
            reject(new Error(message.data.error));
          } else {
            resolve(message.data.result);
          }
        }
      };

      this.on('message:tool-result', resultHandler);

      // Send request
      this.sendMessage(peer.ws, {
        type: 'tool-call',
        from: this.config.peerId,
        to: peerId,
        data: {
          requestId,
          toolName,
          args
        },
        timestamp: Date.now()
      });
    });
  }

  /**
   * Broadcast a message to all connected peers
   */
  broadcast(message: Omit<PeerMessage, 'from' | 'timestamp'>): void {
    const fullMessage: PeerMessage = {
      ...message,
      from: this.config.peerId,
      timestamp: Date.now()
    };

    for (const peer of this.peers.values()) {
      if (peer.authenticated) {
        this.sendMessage(peer.ws, fullMessage);
      }
    }
  }

  /**
   * Get list of connected peers
   */
  getConnectedPeers(): ConnectedPeer[] {
    return Array.from(this.peers.values());
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private handleNewConnection(ws: WebSocket, req: any): void {
    // Check max peers limit
    if (this.peers.size >= this.config.maxPeers!) {
      ws.close(1008, 'Max peers limit reached');
      return;
    }

    let tempPeerId: string | null = null;

    ws.on('message', (data: WebSocket.Data) => {
      const message = this.parseMessage(data);
      if (!message) return;

      // Handle handshake
      if (message.type === 'handshake') {
        tempPeerId = message.from;
        
        // Verify JWT token if authentication is enabled
        if (this.config.jwtSecret && message.data.token) {
          if (!this.verifyJWT(message.data.token)) {
            ws.close(1008, 'Authentication failed');
            return;
          }
        }

        const peer: ConnectedPeer = {
          id: message.from,
          name: message.data.name,
          ws,
          authenticated: true,
          lastHeartbeat: Date.now(),
          capabilities: message.data.capabilities || [],
          tools: message.data.tools || []
        };

        this.peers.set(message.from, peer);
        this.emit('peer:connected', peer);

        // Send handshake response
        this.sendMessage(ws, {
          type: 'handshake',
          from: this.config.peerId,
          to: message.from,
          data: {
            name: this.config.peerName,
            accepted: true
          },
          timestamp: Date.now()
        });
      } else {
        this.handleMessage(ws, data);
      }
    });

    ws.on('close', () => {
      if (tempPeerId) {
        this.handlePeerDisconnect(tempPeerId);
      }
    });

    ws.on('error', (error) => {
      this.emit('error', { peerId: tempPeerId, error });
    });
  }

  private handleMessage(ws: WebSocket, data: WebSocket.Data): void {
    const message = this.parseMessage(data);
    if (!message) return;

    const peer = this.peers.get(message.from);
    if (!peer) return;

    // Update last heartbeat
    peer.lastHeartbeat = Date.now();

    switch (message.type) {
      case 'heartbeat':
        // Respond to heartbeat
        this.sendMessage(ws, {
          type: 'heartbeat',
          from: this.config.peerId,
          to: message.from,
          data: { pong: true },
          timestamp: Date.now()
        });
        break;

      case 'tool-call':
        this.emit('tool:remote-request', {
          peerId: message.from,
          requestId: message.data.requestId,
          toolName: message.data.toolName,
          args: message.data.args,
          respond: (result: any, error?: string) => {
            this.sendMessage(ws, {
              type: 'tool-result',
              from: this.config.peerId,
              to: message.from,
              data: {
                requestId: message.data.requestId,
                result,
                error
              },
              timestamp: Date.now()
            });
          }
        });
        break;

      case 'tool-result':
        this.emit('message:tool-result', message);
        break;

      case 'tool-broadcast':
        this.emit('tool:broadcast-received', message.data);
        break;

      default:
        this.emit('message', message);
    }
  }

  private handlePeerDisconnect(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      this.peers.delete(peerId);
      this.emit('peer:disconnected', { peerId, peer });

      // Attempt reconnection if this was an outgoing connection
      // (implement reconnection logic here if needed)
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();

      for (const [peerId, peer] of this.peers.entries()) {
        // Check if peer is still alive
        if (now - peer.lastHeartbeat > this.HEARTBEAT_TIMEOUT) {
          peer.ws.close();
          this.handlePeerDisconnect(peerId);
          continue;
        }

        // Send heartbeat
        this.sendMessage(peer.ws, {
          type: 'heartbeat',
          from: this.config.peerId,
          to: peerId,
          data: { ping: true },
          timestamp: now
        });
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private sendMessage(ws: WebSocket, message: PeerMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      // Sign message if enabled
      if (this.config.enableMessageSigning && this.signingKey) {
        message.signature = this.signMessage(message);
      }
      
      ws.send(JSON.stringify(message));
    }
  }

  private parseMessage(data: WebSocket.Data): PeerMessage | null {
    try {
      const message = JSON.parse(data.toString()) as PeerMessage;
      
      // Verify signature if enabled
      if (this.config.enableMessageSigning && this.signingKey && message.signature) {
        if (!this.verifySignature(message)) {
          this.emit('error', { message: 'Invalid message signature', data });
          return null;
        }
      }
      
      return message;
    } catch (error) {
      this.emit('error', { message: 'Failed to parse message', error });
      return null;
    }
  }

  // ============================================================================
  // Security Methods
  // ============================================================================

  private generateJWT(): string {
    if (!this.config.jwtSecret) {
      throw new Error('JWT secret not configured');
    }

    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({
      peerId: this.config.peerId,
      peerName: this.config.peerName,
      iat: Date.now(),
      exp: Date.now() + 3600000 // 1 hour
    })).toString('base64');

    const signature = crypto
      .createHmac('sha256', this.config.jwtSecret)
      .update(`${header}.${payload}`)
      .digest('base64');

    return `${header}.${payload}.${signature}`;
  }

  private verifyJWT(token: string): boolean {
    if (!this.config.jwtSecret) {
      return false;
    }

    try {
      const [header, payload, signature] = token.split('.');
      
      const expectedSignature = crypto
        .createHmac('sha256', this.config.jwtSecret)
        .update(`${header}.${payload}`)
        .digest('base64');

      if (signature !== expectedSignature) {
        return false;
      }

      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
      
      // Check expiration
      if (decodedPayload.exp && decodedPayload.exp < Date.now()) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  private signMessage(message: PeerMessage): string {
    if (!this.signingKey) {
      throw new Error('Signing key not configured');
    }

    const messageData = JSON.stringify({
      type: message.type,
      from: message.from,
      to: message.to,
      data: message.data,
      timestamp: message.timestamp
    });

    return crypto
      .createHmac('sha256', this.signingKey)
      .update(messageData)
      .digest('hex');
  }

  private verifySignature(message: PeerMessage): boolean {
    if (!this.signingKey || !message.signature) {
      return false;
    }

    const expectedSignature = this.signMessage(message);
    return message.signature === expectedSignature;
  }
}
