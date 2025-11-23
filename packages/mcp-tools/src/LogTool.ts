import { MCPTool } from '@repo/types';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface LogToolArgs {
  operation: 'read' | 'tail' | 'search';
  logPath?: string;
  lines?: number;
  searchTerm?: string;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export class LogTool implements MCPTool {
  public readonly name = 'log';
  public readonly description = 'Read and search system logs';

  private readonly logPaths: string[] = [];

  constructor(logPaths?: string[]) {
    // Default log paths for macOS/Linux
    this.logPaths = logPaths || [
      '/var/log',
      path.join(process.cwd(), 'logs'),
      path.join(process.cwd(), '.logs')
    ];
  }

  /**
   * Check if log path is allowed
   */
  private isLogPathAllowed(logPath: string): boolean {
    const absolutePath = path.resolve(logPath);
    return this.logPaths.some(allowed => 
      absolutePath.startsWith(path.resolve(allowed))
    );
  }

  public async execute(args: Record<string, any>): Promise<any> {
    const { operation, logPath, lines = 100, searchTerm } = args as LogToolArgs;

    if (!logPath) {
      throw new Error('logPath is required');
    }

    if (!this.isLogPathAllowed(logPath)) {
      throw new Error(`Access denied: ${logPath} is not an allowed log path`);
    }

    switch (operation) {
      case 'read':
        return await this.readLog(logPath, lines);
      
      case 'tail':
        return await this.tailLog(logPath, lines);
      
      case 'search':
        if (!searchTerm) throw new Error('searchTerm required for search operation');
        return await this.searchLog(logPath, searchTerm);
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async readLog(logPath: string, maxLines: number): Promise<string[]> {
    const content = await fs.readFile(logPath, 'utf-8');
    const lines = content.split('\n');
    return lines.slice(0, maxLines);
  }

  private async tailLog(logPath: string, numLines: number): Promise<string[]> {
    const content = await fs.readFile(logPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(-numLines);
  }

  private async searchLog(logPath: string, searchTerm: string): Promise<string[]> {
    const content = await fs.readFile(logPath, 'utf-8');
    const lines = content.split('\n');
    return lines.filter(line => 
      line.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Get allowed log paths
   */
  public getAllowedPaths(): string[] {
    return [...this.logPaths];
  }
}
