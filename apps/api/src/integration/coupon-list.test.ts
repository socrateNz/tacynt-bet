import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { createApp } from '../app';
import { Competition, Coupon, CouponSelection, Match, SavedCoupon, Sport, Team } from '../models';
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

async function seedCouponWithSelections(userId: string, generationBatchId: string, selectionCount: number) {
  const sport = await Sport.create({ name: 'Football', slug: `football-${generationBatchId}-${selectionCount}` });
  const competition = await Competition.create({
    name: 'League',
    slug: `league-${generationBatchId}-${selectionCount}`,
    sportId: sport._id,
  });

  const coupon = await Coupon.create({
    userId,
    targetOdds: 3,
    actualOdds: 3.1,
    differenceFromTarget: 0.1,
    riskProfile: 'EQUILIBRE',
    risk: 'MEDIUM',
    averageConfidence: 70,
    generationBatchId,
  });

  for (let i = 0; i < selectionCount; i += 1) {
    const home = await Team.create({ name: `Home ${i}`, slug: `home-${generationBatchId}-${i}`, sportId: sport._id });
    const away = await Team.create({ name: `Away ${i}`, slug: `away-${generationBatchId}-${i}`, sportId: sport._id });
    const match = await Match.create({
      sportId: sport._id,
      competitionId: competition._id,
      homeTeamId: home._id,
      awayTeamId: away._id,
      kickoffAt: new Date(),
      status: 'SCHEDULED',
    });

    await CouponSelection.create({
      couponId: coupon._id,
      matchId: match._id,
      market: 'MATCH_WINNER',
      selection: 'HOME',
      odds: 1.5,
      confidence: 70,
      reason: 'test',
    });
  }

  return coupon;
}

describe('GET /api/coupons (list)', () => {
  it('returns each coupon with only its own selections and its own saved status', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Coupon Owner',
      email: 'owner@example.test',
      password: 'CorrectHorse1',
    });
    const token = registerRes.body.data.accessToken as string;
    const userId = registerRes.body.data.user.id as string;

    // Coupon A has 3 selections, Coupon B has 1 - if the batch grouping mixed them up,
    // one of these counts would be wrong.
    const couponA = await seedCouponWithSelections(userId, 'batch-a', 3);
    const couponB = await seedCouponWithSelections(userId, 'batch-b', 1);

    await SavedCoupon.create({ userId, couponId: couponA._id });
    // Coupon B is intentionally left unsaved.

    const res = await request(app).get('/api/coupons').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(2);

    const dtoA = res.body.data.items.find((item: { id: string }) => item.id === couponA.id);
    const dtoB = res.body.data.items.find((item: { id: string }) => item.id === couponB.id);

    expect(dtoA.selections).toHaveLength(3);
    expect(dtoA.isSaved).toBe(true);
    expect(dtoA.savedCouponId).toEqual(expect.any(String));

    expect(dtoB.selections).toHaveLength(1);
    expect(dtoB.isSaved).toBe(false);
    expect(dtoB.savedCouponId).toBeUndefined();
  });

  it('does not leak another users saved coupons into isSaved', async () => {
    const owner = await request(app).post('/api/auth/register').send({
      name: 'Owner',
      email: 'owner2@example.test',
      password: 'CorrectHorse1',
    });
    const other = await request(app).post('/api/auth/register').send({
      name: 'Other',
      email: 'other@example.test',
      password: 'CorrectHorse1',
    });

    const ownerId = owner.body.data.user.id as string;
    const otherToken = other.body.data.accessToken as string;
    const otherId = other.body.data.user.id as string;

    const coupon = await seedCouponWithSelections(ownerId, 'batch-c', 1);
    // Give the coupon to "other" too, saved only by "other".
    await Coupon.updateOne({ _id: coupon._id }, { userId: otherId });
    await SavedCoupon.create({ userId: otherId, couponId: coupon._id });

    const res = await request(app).get('/api/coupons').set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items[0].isSaved).toBe(true);
  });
});
