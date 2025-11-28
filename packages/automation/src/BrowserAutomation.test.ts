import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrowserAutomation } from './BrowserAutomation';

// Mock puppeteer
vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        goto: vi.fn().mockResolvedValue(undefined),
        click: vi.fn().mockResolvedValue(undefined),
        type: vi.fn().mockResolvedValue(undefined),
        $eval: vi.fn().mockResolvedValue('mocked text'),
        screenshot: vi.fn().mockResolvedValue(Buffer.from('screenshot')),
      }),
      close: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

describe('BrowserAutomation', () => {
  let automation: BrowserAutomation;

  beforeEach(() => {
    automation = new BrowserAutomation({ headless: true });
  });

  afterEach(async () => {
    await automation.close();
  });

  describe('initialization', () => {
    it('should create instance with default options', () => {
      const auto = new BrowserAutomation();
      expect(auto).toBeInstanceOf(BrowserAutomation);
    });

    it('should create instance with custom options', () => {
      const auto = new BrowserAutomation({ headless: false, slowMo: 100 });
      expect(auto).toBeInstanceOf(BrowserAutomation);
    });
  });

  describe('browser lifecycle', () => {
    it('should launch browser', async () => {
      await automation.launch();
      expect(automation['browser']).toBeDefined();
      expect(automation['page']).toBeDefined();
    });

    it('should close browser', async () => {
      await automation.launch();
      await automation.close();
      expect(automation['browser']).toBeNull();
      expect(automation['page']).toBeNull();
    });

    it('should handle close when browser not launched', async () => {
      await expect(automation.close()).resolves.not.toThrow();
    });
  });

  describe('navigation', () => {
    beforeEach(async () => {
      await automation.launch();
    });

    it('should navigate to URL', async () => {
      await automation.navigate('https://example.com');
      expect(automation['page']?.goto).toHaveBeenCalledWith(
        'https://example.com',
        { waitUntil: 'networkidle0' }
      );
    });

    it('should throw error when browser not launched', async () => {
      const auto = new BrowserAutomation();
      await expect(auto.navigate('https://example.com')).rejects.toThrow(
        'Browser not launched'
      );
    });
  });

  describe('element interactions', () => {
    beforeEach(async () => {
      await automation.launch();
    });

    it('should click element', async () => {
      await automation.click('.button');
      expect(automation['page']?.click).toHaveBeenCalledWith('.button');
    });

    it('should type text', async () => {
      await automation.type('#input', 'test text');
      expect(automation['page']?.type).toHaveBeenCalledWith('#input', 'test text');
    });

    it('should get text from element', async () => {
      const text = await automation.getText('.element');
      expect(text).toBe('mocked text');
    });

    it('should throw error for click when browser not launched', async () => {
      const auto = new BrowserAutomation();
      await expect(auto.click('.button')).rejects.toThrow('Browser not launched');
    });

    it('should throw error for type when browser not launched', async () => {
      const auto = new BrowserAutomation();
      await expect(auto.type('#input', 'text')).rejects.toThrow(
        'Browser not launched'
      );
    });

    it('should throw error for getText when browser not launched', async () => {
      const auto = new BrowserAutomation();
      await expect(auto.getText('.element')).rejects.toThrow(
        'Browser not launched'
      );
    });
  });

  describe('screenshot', () => {
    beforeEach(async () => {
      await automation.launch();
    });

    it('should take screenshot without path', async () => {
      const screenshot = await automation.screenshot();
      expect(screenshot).toBeInstanceOf(Buffer);
    });

    it('should take screenshot with path', async () => {
      const screenshot = await automation.screenshot('/tmp/screenshot.png');
      expect(screenshot).toBeInstanceOf(Buffer);
      expect(automation['page']?.screenshot).toHaveBeenCalledWith({
        path: '/tmp/screenshot.png',
      });
    });

    it('should throw error when browser not launched', async () => {
      const auto = new BrowserAutomation();
      await expect(auto.screenshot()).rejects.toThrow('Browser not launched');
    });
  });

  describe('complete workflow', () => {
    it('should execute complete automation workflow', async () => {
      await automation.launch();
      await automation.navigate('https://example.com');
      await automation.click('.button');
      await automation.type('#input', 'test');
      const text = await automation.getText('.result');
      await automation.screenshot();
      await automation.close();

      expect(text).toBe('mocked text');
    });
  });
});
