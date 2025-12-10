export interface Tool {
  name: string;
  description: string;
  execute: (args: any) => Promise<string>;
  schema: any;
}

export class MockMCPServer {
  name: string;
  tools: Map<string, Tool> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  registerTool(tool: Tool) {
    this.tools.set(tool.name, tool);
  }

  async callTool(toolName: string, args: any): Promise<string> {
    const tool = this.tools.get(toolName);
    if (!tool) throw new Error(`Tool ${toolName} not found on server ${this.name}`);
    return tool.execute(args);
  }

  listTools() {
    return Array.from(this.tools.values()).map(t => ({
      name: t.name,
      description: t.description,
      schema: t.schema
    }));
  }
}
