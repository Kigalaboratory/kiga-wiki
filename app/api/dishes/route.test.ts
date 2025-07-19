import { GET, POST } from './route';
import { prisma } from '../../lib/prisma';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    dish: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/dishes', () => {
  it('should return a list of dishes from the database', async () => {
    const mockDate = new Date();
    const mockDishes = [
      { id: 1, name: 'モック料理1', chef: 'シェフ1', comment: 'コメント1', createdAt: mockDate },
      { id: 2, name: 'モック料理2', chef: 'シェフ2', comment: 'コメント2', createdAt: mockDate },
    ];
    const mockFindMany = vi.mocked(prisma.dish.findMany);
    mockFindMany.mockResolvedValue(mockDishes);

    const response = await GET();
    const data = await response.json();

    // JSONシリアライズによりDateオブジェクトは文字列になるため、比較対象も文字列に変換する
    const expectedDishes = mockDishes.map(d => ({ ...d, createdAt: d.createdAt.toISOString() }));

    expect(response.status).toBe(200);
    expect(data).toEqual(expectedDishes);
    expect(prisma.dish.findMany).toHaveBeenCalledTimes(1);
  });
});

describe('POST /api/dishes', () => {
  it('should create a new dish and return it', async () => {
    const newDish = { name: '新作ラボ飯', chef: '新人研究員', comment: '美味しかったです！' };
    const createdDish = { ...newDish, id: 3, createdAt: new Date() };
    
    const mockCreate = vi.mocked(prisma.dish.create);
    mockCreate.mockResolvedValue(createdDish);

    const req = new NextRequest('http://localhost/api/dishes', {
      method: 'POST',
      body: JSON.stringify(newDish),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ ...createdDish, createdAt: createdDish.createdAt.toISOString() });
    expect(prisma.dish.create).toHaveBeenCalledWith({ data: newDish });
    expect(prisma.dish.create).toHaveBeenCalledTimes(1);
  });
});
