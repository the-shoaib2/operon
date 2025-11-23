import { Agent } from '@repo/types';
import { FileTool, ShellTool } from '@repo/mcp-tools';
import { generateText } from 'ai';

export interface OSAgentConfig {
  model: any; // Vercel AI SDK model (openai, anthropic, etc.)
  allowedPaths?: string[];
  allowedCommands?: string[];
}

export class OSAgent implements Agent {
  public readonly id = 'os-agent';
  public readonly name = 'OS Agent';
  public readonly role = 'os' as const;

  private model: any;
  private fileTool: FileTool;
  private shellTool: ShellTool;
  // private logTool: LogTool;
  private lastAction: string = '';

  constructor(config: OSAgentConfig) {
    this.model = config.model;
    this.fileTool = new FileTool(config.allowedPaths);
    this.shellTool = new ShellTool(config.allowedCommands);
    // this.logTool = new LogTool();
  }

  async think(input: string): Promise<string> {
    const systemPrompt = `You are an OS Agent responsible for system operations.
You have access to:
- File operations (read, write, list, delete)
- Shell commands (safe execution only)
- System logs (read and search)

Analyze the user's request and determine the best action to take.
If you have a final answer, prefix it with "FINAL ANSWER:".
Otherwise, describe the action you want to take.`;

    const { text } = await generateText({
      model: this.model,
      system: systemPrompt,
      prompt: `User request: ${input}\n\nWhat should I do?`,
    });

    return text;
  }

  async act(action: string): Promise<void> {
    this.lastAction = action;

    // Parse action and execute appropriate tool
    if (action.toLowerCase().includes('read file')) {
      const filePathMatch = action.match(/['"]([^'"]+)['"]/);
      if (filePathMatch) {
        const result = await this.fileTool.execute({
          operation: 'read',
          filePath: filePathMatch[1]
        });
        this.lastAction = `Read file: ${result}`;
      }
    } else if (action.toLowerCase().includes('execute') || action.toLowerCase().includes('run command')) {
      const commandMatch = action.match(/['"]([^'"]+)['"]/);
      if (commandMatch) {
        const result = await this.shellTool.execute({
          command: commandMatch[1]
        });
        this.lastAction = `Executed command: ${JSON.stringify(result)}`;
      }
    } else if (action.toLowerCase().includes('list')) {
      const dirMatch = action.match(/['"]([^'"]+)['"]/);
      if (dirMatch) {
        const result = await this.fileTool.execute({
          operation: 'list',
          filePath: dirMatch[1]
        });
        this.lastAction = `Listed directory: ${JSON.stringify(result)}`;
      }
    }
  }

  async observe(): Promise<string> {
    return this.lastAction || 'No action taken yet';
  }
}
