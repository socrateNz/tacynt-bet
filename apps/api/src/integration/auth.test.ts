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

describe('POST /api/auth/register', () => {
  it('creates an account and returns a session', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice Test',
      email: 'alice@example.test',
      password: 'CorrectHorse1',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('alice@example.test');
    expect(res.body.data.user.role).toBe('USER');
    expect(res.body.data.accessToken).toEqual(expect.any(String));
    // The password hash must never leak to the client.
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('rejects a duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Alice Test',
      email: 'alice@example.test',
      password: 'CorrectHorse1',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice Clone',
      email: 'alice@example.test',
      password: 'AnotherPass1',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice Test',
      email: 'shortpass@example.test',
      password: 'short',
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Bob Test',
      email: 'bob@example.test',
      password: 'CorrectHorse1',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'bob@example.test',
      password: 'CorrectHorse1',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toEqual(expect.any(String));
  });

  it('rejects an unknown email with a generic message (no account enumeration)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.test',
      password: 'WhateverPass1',
    });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Email ou mot de passe incorrect.');
  });

  it('rejects a wrong password with the same generic message', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Bob Test',
      email: 'bob@example.test',
      password: 'CorrectHorse1',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'bob@example.test',
      password: 'WrongPassword1',
    });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Email ou mot de passe incorrect.');
  });
});

describe('POST /api/auth/forgot-password', () => {
  it('always returns success, regardless of whether the email exists', async () => {
    const resUnknown = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'ghost@example.test' });
    expect(resUnknown.status).toBe(200);
    expect(resUnknown.body.success).toBe(true);
  });
});

describe('GET /api/auth/me', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns the profile for a valid token', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Carol Test',
      email: 'carol@example.test',
      password: 'CorrectHorse1',
    });
    const token = registerRes.body.data.accessToken;

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('carol@example.test');
  });

  it('rejects a tampered token', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Dave Test',
      email: 'dave@example.test',
      password: 'CorrectHorse1',
    });
    const token = registerRes.body.data.accessToken as string;
    const tampered = token.slice(0, -3) + 'xxx';

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${tampered}`);
    expect(res.status).toBe(401);
  });
});
