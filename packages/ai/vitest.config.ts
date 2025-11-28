import { defineConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.mts';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    name: '@operone/ai',
    environment: 'node',
    testTimeout: 15000, // Longer timeout for AI operations
  },
});
