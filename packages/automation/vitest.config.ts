import { defineConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.mts';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    name: '@operone/automation',
    environment: 'node',
    testTimeout: 20000, // Longer timeout for browser automation
  },
});
