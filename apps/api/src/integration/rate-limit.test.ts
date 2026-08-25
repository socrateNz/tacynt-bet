import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { createApp } from '../app';
import '../models';
import { clearTestDb, startTestDb, stopTestDb } from './test-db';

const app = createApp();

beforeAll(async () => {
  await startTestDb();
}, 300000);

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await stopTestDb();
});

describe('authRateLimiter', () => {
  it('blocks with 429 after the configured threshold on a sensitive auth endpoint', async () => {
    // authRateLimiter allows 20 requests / 15min window; the 21st must be rejected.
    let lastStatus = 0;
    for (let i = 0; i < 21; i += 1) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: `nobody-${i}@example.test`, password: 'WrongPassword1' });
      lastStatus = res.status;
    }

    expect(lastStatus).toBe(429);
  }, 30000);
});
