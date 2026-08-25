import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

// mongodb-memory-server's binary cache dir is resolved via find-cache-dir, which walks up from
// process.cwd() - that differs between `npx vitest run` (cwd = apps/api) and `npm run test`
// invoked from the monorepo root via --workspaces. Pin it to an absolute path so the cached
// mongod binary is always found regardless of how the test command was invoked.
const downloadDir = fileURLToPath(new URL('./node_modules/.cache/mongodb-memory-server', import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    testTimeout: 30000,
    // mongodb-memory-server downloads a mongod binary on first run (cached afterwards) -
    // give integration test suites plenty of room the first time, and run them sequentially
    // so two suites never race to download the same binary at once.
    hookTimeout: 1200000,
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      MONGOMS_DOWNLOAD_DIR: downloadDir,
    },
  },
});
