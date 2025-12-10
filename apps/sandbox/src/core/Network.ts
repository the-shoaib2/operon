import { PC } from './PC';

export class Network {
  pcs: Map<string, PC> = new Map();
  subnet: string = '192.168.1.';

  constructor(initialCount: number = 10) {
    for (let i = 1; i <= initialCount; i++) {
      const ip = `${this.subnet}${i + 10}`; // start at .11
      const hostname = `node-${i.toString().padStart(2, '0')}`;
      const id = crypto.randomUUID();
      const pc = new PC(id, hostname, ip);
      this.pcs.set(id, pc);
      
      // Customize a few
      if (i === 1) {
        pc.hostname = 'gateway-primary';
        pc.fs.writeFile('/etc/config', 'ROLE=GATEWAY');
      }
      if (i === 10) {
        pc.hostname = 'db-server';
        pc.fs.writeFile('/var/data.db', 'BINARY_DATA');
      }
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
