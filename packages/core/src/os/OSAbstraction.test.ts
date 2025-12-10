import { describe, it, expect, beforeEach } from 'vitest';
import { OSAbstraction } from '../os/OSAbstraction';

describe('OSAbstraction', () => {
  let osAbstraction: OSAbstraction;

  beforeEach(() => {
    osAbstraction = new OSAbstraction();
  });

  describe('Platform Detection', () => {
    it('should detect current platform', () => {
      const platform = osAbstraction.getPlatform();
      expect(['win32', 'darwin', 'linux']).toContain(platform);
    });

    it('should correctly identify platform type', () => {
      const platform = osAbstraction.getPlatform();
      
      if (platform === 'win32') {
        expect(osAbstraction.isWindows()).toBe(true);
        expect(osAbstraction.isMacOS()).toBe(false);
        expect(osAbstraction.isLinux()).toBe(false);
      } else if (platform === 'darwin') {
        expect(osAbstraction.isWindows()).toBe(false);
        expect(osAbstraction.isMacOS()).toBe(true);
        expect(osAbstraction.isLinux()).toBe(false);
      } else {
        expect(osAbstraction.isWindows()).toBe(false);
        expect(osAbstraction.isMacOS()).toBe(false);
        expect(osAbstraction.isLinux()).toBe(true);
      }
    });
  });

  describe('System Information', () => {
    it('should get CPU count', () => {
      const cpuCount = osAbstraction.getCPUCount();
      expect(cpuCount).toBeGreaterThan(0);
    });

    it('should get total memory', () => {
      const totalMemory = osAbstraction.getTotalMemory();
      expect(totalMemory).toBeGreaterThan(0);
    });

    it('should get free memory', () => {
      const freeMemory = osAbstraction.getFreeMemory();
      expect(freeMemory).toBeGreaterThan(0);
    });

    it('should get system uptime', () => {
      const uptime = osAbstraction.getUptime();
      expect(uptime).toBeGreaterThanOrEqual(0);
    });

    it('should get complete system info', () => {
      const sysInfo = osAbstraction.getSystemInfo();
      
      expect(sysInfo).toHaveProperty('platform');
      expect(sysInfo).toHaveProperty('arch');
      expect(sysInfo).toHaveProperty('cpus');
      expect(sysInfo).toHaveProperty('totalMemory');
      expect(sysInfo).toHaveProperty('freeMemory');
      expect(sysInfo).toHaveProperty('uptime');
      expect(sysInfo).toHaveProperty('hostname');
    });
  });

  describe('Path Operations', () => {
    it('should get temp directory', () => {
      const tempDir = osAbstraction.getTempDir();
      expect(tempDir).toBeTruthy();
      expect(typeof tempDir).toBe('string');
    });

    it('should get home directory', () => {
      const homeDir = osAbstraction.getHomeDir();
      expect(homeDir).toBeTruthy();
      expect(typeof homeDir).toBe('string');
    });

    it('should get correct path separator', () => {
      const separator = osAbstraction.getPathSeparator();
      
      if (osAbstraction.isWindows()) {
        expect(separator).toBe('\\');
      } else {
        expect(separator).toBe('/');
      }
    });
  });

  describe('Shell Detection', () => {
    it('should get default shell', () => {
      const shell = osAbstraction.getDefaultShell();
      expect(shell).toBeTruthy();
      expect(typeof shell).toBe('string');
    });

    it('should get platform-specific shell', () => {
      const shell = osAbstraction.getDefaultShell();
      
      if (osAbstraction.isWindows()) {
        expect(shell).toMatch(/cmd\.exe|powershell\.exe/i);
      } else if (osAbstraction.isMacOS()) {
        expect(shell).toMatch(/zsh|bash/);
      } else {
        expect(shell).toMatch(/bash|sh/);
      }
    });
  });

  describe('Process Spawning', () => {
    it('should spawn a simple process', async () => {
      const command = osAbstraction.isWindows() ? 'echo' : 'echo';
      const args = ['test'];
      
      const childProcess = osAbstraction.spawnProcess(command, args);
      
      expect(childProcess).toBeDefined();
      expect(childProcess.pid).toBeGreaterThan(0);
      
      // Cleanup
      childProcess.kill();
    });
  });
});
