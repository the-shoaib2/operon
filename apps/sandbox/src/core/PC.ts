import { FileSystem } from './FileSystem';
import { MockMCPServer } from './MockMCP';

export class PC {
  id: string;
  hostname: string;
  ip: string;
  fs: FileSystem;
  mcpServer: MockMCPServer;
  status: 'online' | 'offline' | 'booting';
  logs: string[] = [];

  constructor(id: string, hostname: string, ip: string) {
    this.id = id;
    this.hostname = hostname;
    this.ip = ip;
    this.status = 'online';
    
    this.fs = new FileSystem();
    this.mcpServer = new MockMCPServer('system-server');
    
    // Add default tools
    this.addDefaultTools();
    this.log(`System initialized. IP: ${ip}`);
  }

  private addDefaultTools() {
    this.mcpServer.registerTool({
      name: 'echo',
      description: 'Echo back the input',
      schema: { type: 'object', properties: { message: { type: 'string' } } },
      execute: async ({ message }) => `ECHO: ${message}`
    });
    
    this.mcpServer.registerTool({
      name: 'read_file',
      description: 'Read a file from the simulated FS',
      schema: { type: 'object', properties: { path: { type: 'string' } } },
      execute: async ({ path }) => {
        const content = this.fs.readFile(path);
        return content || `Error: File ${path} not found`;
      }
    });

    this.mcpServer.registerTool({
      name: 'list_files',
      description: 'List files in directory',
      schema: { type: 'object', properties: { path: { type: 'string' } } },
      execute: async ({ path }) => {
         return this.fs.ls(path).join('\n');
      }
    });
  }

  log(message: string) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
  }

  async executeCommand(command: string): Promise<string> {
    this.log(`Command received: ${command}`);
    // Very basic command parsing
    if (command === 'status') return `Host: ${this.hostname}\nIP: ${this.ip}\nStatus: ${this.status}`;
    if (command.startsWith('echo ')) return command.substring(5);
    if (command === 'ls') return this.fs.ls('/').join('\n');
    return `Unknown command: ${command}`;
  }
}
