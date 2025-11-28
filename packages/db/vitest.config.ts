import { defineConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.mts';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    name: '@operone/db',
    environment: 'node',
  },
});
