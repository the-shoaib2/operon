import { defineConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.mts';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test, include: ['**/*.test.ts'],
    name: '@operone/shell',
    environment: 'node',
    pool: 'threads',
    minThreads: 1,
    maxThreads: 1,
  },
});
