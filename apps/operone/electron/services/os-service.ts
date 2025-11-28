import { ipcMain } from 'electron';
import fs from 'fs/promises';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execAsync = util.promisify(exec);

export class OSService {
  constructor() {
    this.initializeIPC();
  }

  private initializeIPC() {
    // File System Operations
    ipcMain.handle('os:fs:read', async (_, path: string) => {
      try {
        return await fs.readFile(path, 'utf-8');
      } catch (error: any) {
        throw new Error(`Failed to read file: ${error.message}`);
      }
    });

    ipcMain.handle('os:fs:write', async (_, path: string, content: string) => {
      try {
        await fs.writeFile(path, content, 'utf-8');
        return true;
      } catch (error: any) {
        throw new Error(`Failed to write file: ${error.message}`);
      }
    });

    ipcMain.handle('os:fs:list', async (_, path: string) => {
      try {
        const entries = await fs.readdir(path, { withFileTypes: true });
        return entries.map(entry => ({
          name: entry.name,
          isDirectory: entry.isDirectory(),
          path: require('path').join(path, entry.name)
        }));
      } catch (error: any) {
        throw new Error(`Failed to list directory: ${error.message}`);
      }
    });

    // Shell Operations
    ipcMain.handle('os:shell:execute', async (_, command: string) => {
      try {
        const { stdout, stderr } = await execAsync(command);
        return { stdout, stderr, exitCode: 0 };
      } catch (error: any) {
        return { stdout: '', stderr: error.message, exitCode: error.code || 1 };
      }
    });

    // System Monitoring
    ipcMain.handle('os:system:metrics', async () => {
      const cpus = os.cpus();
      const cpuUsage = cpus.reduce((acc: number, cpu: any) => {
        const times = cpu.times as { user: number; nice: number; sys: number; idle: number; irq: number };
        const total = Object.values(times).reduce((a: number, b: number) => a + b, 0);
        const idle = times.idle;
        return acc + ((total - idle) / total) * 100;
      }, 0) / cpus.length;

      return {
        cpu: {
          usage: cpuUsage,
          count: cpus.length,
          model: cpus[0]?.model || 'Unknown'
        },
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem()
        },
        uptime: os.uptime(),
        platform: os.platform() + ' ' + os.release()
      };
    });

    console.log('OS Service initialized');
  }
}
