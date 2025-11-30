import { MCPTool } from '@repo/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ShellToolArgs {
  command: string;
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  peerId?: string; // For distributed execution
}

/**
 * ShellExecutionTool - Pipeline-compatible shell operations
 * Implements MCPTool interface for dynamic discovery
 */
export class ShellExecutionTool implements MCPTool {
  public readonly name = 'shell';
  public readonly description = 'Execute shell commands locally or remotely';
  public readonly capabilities = ['local', 'remote', 'distributed'];

  private readonly allowedCommands: RegExp[];
  private readonly blockedCommands: RegExp[];

  constructor() {
    // Define security patterns
    this.allowedCommands = [
      /^ls\s/,
      /^pwd$/,
      /^echo\s/,
      /^cat\s/,
      /^grep\s/,
      /^find\s/,
      /^npm\s/,
      /^node\s/,
      /^git\s/
    ];

    this.blockedCommands = [
      /rm\s+-rf\s+\//,  // Dangerous rm commands
      />\s*\/dev\/sd/,  // Direct disk writes
      /mkfs/,           // Format filesystem
      /dd\s+if=/        // Disk operations
    ];
  }

  public async execute(args: Record<string, any>): Promise<any> {
    const { command, cwd, env, timeout } = args as ShellToolArgs;

    // Security check
    if (!this.isCommandAllowed(command)) {
      throw new Error(`Command blocked for security reasons: ${command}`);
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: cwd || process.cwd(),
        env: { ...process.env, ...env },
        timeout: timeout || 30000
      });

      return {
        success: true,
        stdout,
        stderr,
        exitCode: 0
      };
    } catch (error: any) {
      return {
        success: false,
        stdout: '',
        stderr: error.message,
        exitCode: error.code || 1
      };
    }
  }

  private isCommandAllowed(command: string): boolean {
    // Check blocked patterns first
    for (const pattern of this.blockedCommands) {
      if (pattern.test(command)) {
        return false;
      }
    }

    // For now, allow all commands that aren't explicitly blocked
    // In production, you might want to be more restrictive
    return true;
  }
}
