import { MCPTool } from '@repo/types';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface FileToolArgs {
  operation: 'read' | 'write' | 'list' | 'delete' | 'metadata';
  filePath: string;
  content?: string;
}

export class FileTool implements MCPTool {
  public readonly name = 'file';
  public readonly description = 'Read, write, list, and manage files on the local system';

  private readonly allowedPaths: string[] = [];

  constructor(allowedPaths?: string[]) {
    this.allowedPaths = allowedPaths || [process.cwd()];
  }

  /**
   * Check if a path is within allowed directories
   */
  private isPathAllowed(filePath: string): boolean {
    const absolutePath = path.resolve(filePath);
    return this.allowedPaths.some(allowedPath => 
      absolutePath.startsWith(path.resolve(allowedPath))
    );
  }

  public async execute(args: Record<string, any>): Promise<any> {
    const { operation, filePath, content } = args as FileToolArgs;

    if (!this.isPathAllowed(filePath)) {
      throw new Error(`Access denied: ${filePath} is outside allowed paths`);
    }

    switch (operation) {
      case 'read':
        return await this.readFile(filePath);
      
      case 'write':
        if (!content) throw new Error('Content required for write operation');
        return await this.writeFile(filePath, content);
      
      case 'list':
        return await this.listDirectory(filePath);
      
      case 'delete':
        return await this.deleteFile(filePath);
      
      case 'metadata':
        return await this.getMetadata(filePath);
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  private async writeFile(filePath: string, content: string): Promise<{ success: boolean; path: string }> {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true, path: filePath };
  }

  private async listDirectory(dirPath: string): Promise<string[]> {
    const entries = await fs.readdir(dirPath);
    return entries;
  }

  private async deleteFile(filePath: string): Promise<{ success: boolean }> {
    await fs.unlink(filePath);
    return { success: true };
  }

  private async getMetadata(filePath: string): Promise<any> {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    };
  }
}
