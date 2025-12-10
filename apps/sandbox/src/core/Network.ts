import { PC } from './PC';

export class Network {
  pcs: Map<string, PC> = new Map();
  subnet: string = '192.168.1.';

  constructor(initialCount: number = 10) {
    for (let i = 1; i <= initialCount; i++) {
      const ip = `${this.subnet}${i + 10}`; // start at .11
      // Convert 1->A, 2->B, etc.
      const hostname = String.fromCharCode(64 + i);
      const id = crypto.randomUUID();
      const pc = new PC(id, hostname, ip);
      this.pcs.set(id, pc);
      
      // Basic role for first node just to have some variety if needed, 
      // but user asked for specific names. keeping simple for now.
    }
  }

  getAllPCs(): PC[] {
    return Array.from(this.pcs.values());
  }

  getPC(id: string): PC | undefined {
    return this.pcs.get(id);
  }

  getPcByIp(ip: string): PC | undefined {
    for (const pc of this.pcs.values()) {
      if (pc.ip === ip) return pc;
    }
    return undefined;
  }
}
