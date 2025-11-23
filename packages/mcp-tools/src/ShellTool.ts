import { MCPTool } from '@repo/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ShellToolArgs {
  command: string;
  cwd?: string;
  timeout?: number;
}

export interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class ShellTool implements MCPTool {
  public readonly name = 'shell';
  public readonly description = 'Execute safe shell commands with restrictions';

  private readonly allowedCommands: string[] = [
    'ls', 'pwd', 'echo', 'cat', 'grep', 'find', 'wc', 'head', 'tail',
    'git', 'npm', 'node', 'python', 'python3'
  ];

  private readonly blockedPatterns: RegExp[] = [
    /rm\s+-rf/i,
    /sudo/i,
    /chmod/i,
    /chown/i,
    />.*\/dev\//i,  // Prevent writing to device files
    /\|\s*sh/i,     // Prevent piping to shell
  ];

  constructor(allowedCommands?: string[]) {
    if (allowedCommands) {
      this.allowedCommands = allowedCommands;
    }
  }

  /**
   * Check if command is safe to execute
   */
  private isCommandSafe(command: string): boolean {
    // Check for blocked patterns
    if (this.blockedPatterns.some(pattern => pattern.test(command))) {
      return false;
    }

    // Extract the base command
    const baseCommand = command.trim().split(' ')[0];
    
    // Check if base command is in allowed list
    if (!baseCommand) return false;
    
    return this.allowedCommands.some(allowed => 
      baseCommand === allowed || baseCommand.endsWith(`/${allowed}`)
    );
  }

  public async execute(args: Record<string, any>): Promise<ShellResult> {
    const { command, cwd, timeout = 5000 } = args as ShellToolArgs;

    if (!this.isCommandSafe(command)) {
      throw new Error(`Command not allowed: ${command}`);
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: cwd || process.cwd(),
        timeout,
        maxBuffer: 1024 * 1024 // 1MB max output
      });

      return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0
      };
    } catch (error: any) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.code || 1
      };
    }
  }

  /**
   * Get list of allowed commands
   */
  public getAllowedCommands(): string[] {
    return [...this.allowedCommands];
  }
}
