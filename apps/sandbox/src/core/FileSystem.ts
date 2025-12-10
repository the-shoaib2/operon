export class FileSystem {
  private files: Map<string, string>;
  private directories: Set<string>;

  constructor() {
    this.files = new Map();
    this.directories = new Set(['/home', '/tmp', '/var']);
    // Default files
    this.files.set('/home/readme.txt', 'Welcome to the simulation!');
  }

  writeFile(path: string, content: string) {
    this.files.set(path, content);
  }

  readFile(path: string): string | null {
    return this.files.get(path) || null;
  }

  deleteFile(path: string): boolean {
    return this.files.delete(path);
  }

  ls(path: string): string[] {
    // Simple filter for simulation
    const results: string[] = [];
    // If path is root '/'
    if (path === '/') {
      return Array.from(this.directories).map(d => d.replace('/', ''))
    }

    // Check virtual directories
    for (const [filePath] of this.files) {
      if (filePath.startsWith(path)) {
        const relative = filePath.replace(path, '');
        const parts = relative.split('/').filter(Boolean);
        if (parts.length > 0) results.push(parts[0]);
      }
    }
    return [...new Set(results)]; // unique
  }
}
