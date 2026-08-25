import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { createApp } from '../app';
import { User } from '../models';
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

async function registerAndGetToken(email: string, role?: 'ADMIN' | 'SUPER_ADMIN') {
  const res = await request(app).post('/api/auth/register').send({
    name: email,
    email,
    password: 'CorrectHorse1',
  });
  const token = res.body.data.accessToken as string;
  const userId = res.body.data.user.id as string;

  if (role) {
    await User.findByIdAndUpdate(userId, { role });
  }

  return { token, userId };
}

describe('admin role gating', () => {
  it('rejects an anonymous request', async () => {
    const res = await request(app).get('/api/admin/overview');
    expect(res.status).toBe(401);
  });

  it('rejects a plain USER with 403', async () => {
    const { token } = await registerAndGetToken('user@example.test');
    const res = await request(app).get('/api/admin/overview').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('allows an ADMIN', async () => {
    const { token } = await registerAndGetToken('admin@example.test', 'ADMIN');
    const res = await request(app).get('/api/admin/overview').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalUsers).toBe(1);
  });

  it('allows a SUPER_ADMIN', async () => {
    const { token } = await registerAndGetToken('super@example.test', 'SUPER_ADMIN');
    const res = await request(app).get('/api/admin/overview').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

describe('admin user management permissions', () => {
  it('SUPER_ADMIN can promote another user role', async () => {
    const { token: superToken } = await registerAndGetToken('super@example.test', 'SUPER_ADMIN');
    const { userId: targetId } = await registerAndGetToken('target@example.test');

    const res = await request(app)
      .patch(`/api/admin/users/${targetId}/role`)
      .set('Authorization', `Bearer ${superToken}`)
      .send({ role: 'ADMIN' });

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('ADMIN');
  });

  it('SUPER_ADMIN cannot modify their own account (self-protection)', async () => {
    const { token: superToken, userId: superId } = await registerAndGetToken('super@example.test', 'SUPER_ADMIN');

    const res = await request(app)
      .patch(`/api/admin/users/${superId}/role`)
      .set('Authorization', `Bearer ${superToken}`)
      .send({ role: 'USER' });

    expect(res.status).toBe(403);
  });

  it('a plain ADMIN cannot change anyone role (SUPER_ADMIN only)', async () => {
    const { token: adminToken } = await registerAndGetToken('admin@example.test', 'ADMIN');
    const { userId: targetId } = await registerAndGetToken('target@example.test');

    const res = await request(app)
      .patch(`/api/admin/users/${targetId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'ADMIN' });

    expect(res.status).toBe(403);
  });

  it('a plain ADMIN cannot deactivate another ADMIN/SUPER_ADMIN (hierarchy)', async () => {
    const { token: adminToken } = await registerAndGetToken('admin1@example.test', 'ADMIN');
    const { userId: otherAdminId } = await registerAndGetToken('admin2@example.test', 'ADMIN');

    const res = await request(app)
      .patch(`/api/admin/users/${otherAdminId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });

    expect(res.status).toBe(403);
  });

  it('a plain ADMIN can deactivate a plain USER', async () => {
    const { token: adminToken } = await registerAndGetToken('admin@example.test', 'ADMIN');
    const { userId: userId } = await registerAndGetToken('plainuser@example.test');

    const res = await request(app)
      .patch(`/api/admin/users/${userId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });

  it('a deactivated account cannot log in', async () => {
    const { token: adminToken } = await registerAndGetToken('admin@example.test', 'ADMIN');
    await registerAndGetToken('plainuser@example.test');

    const { userId } = await request(app)
      .post('/api/auth/login')
      .send({ email: 'plainuser@example.test', password: 'CorrectHorse1' })
      .then((res) => ({ userId: res.body.data.user.id as string }));

    await request(app)
      .patch(`/api/admin/users/${userId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'plainuser@example.test', password: 'CorrectHorse1' });

    expect(loginRes.status).toBe(403);
  });
});

describe('admin user search', () => {
  it('finds users by partial name/email match', async () => {
    const { token } = await registerAndGetToken('super@example.test', 'SUPER_ADMIN');
    await registerAndGetToken('findme@example.test');

    const res = await request(app)
      .get('/api/admin/users?search=findme')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].email).toBe('findme@example.test');
  });

  it('treats regex metacharacters in the search term as literal text', async () => {
    const { token } = await registerAndGetToken('super@example.test', 'SUPER_ADMIN');
    await registerAndGetToken('normal@example.test');

    const res = await request(app)
      .get('/api/admin/users')
      .query({ search: '.*' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // A wildcard payload must not match every user - only literal ".*" substrings (none here).
    expect(res.body.data.items).toHaveLength(0);
  });
});
