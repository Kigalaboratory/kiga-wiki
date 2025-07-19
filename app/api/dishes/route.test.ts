import { GET, POST } from './route';
import { prisma } from '../../lib/prisma';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { NextRequest } from 'next/server';
import { Dish, Review } from '@prisma/client';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    dish: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  dish: {
    findMany: Mock;
    create: Mock;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/dishes', () => {
  it('should return a list of dishes from the database', async () => {
    const mockDate = new Date();
    const mockDishes: (Dish & { reviews: Review[] })[] = [
      { id: 1, name: 'モック料理1', createdAt: mockDate, reviews: [] },
      { id: 2, name: 'モック料理2', createdAt: mockDate, reviews: [] },
    ];
    mockPrisma.dish.findMany.mockResolvedValue(mockDishes);

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
    // `createDish`は`reviews`を含んだDishを返すため、モックの戻り値もそれに合わせる
    const createdDish: Dish & { reviews: Review[] } = { 
      id: 3, 
      name: newDish.name, 
      createdAt: new Date(),
      reviews: [
        { id: 1, dishId: 3, chef: newDish.chef, comment: newDish.comment, createdAt: new Date() }
      ] 
    };
    
    mockPrisma.dish.create.mockResolvedValue(createdDish);

    const req = new NextRequest('http://localhost/api/dishes', {
      method: 'POST',
      body: JSON.stringify(newDish),
    });

    const response = await POST(req);
    const data = await response.json();

    const { name, chef, comment } = newDish;
    const expectedPrismaArgs = {
      data: {
        name,
        reviews: {
          create: {
            chef,
            comment,
          },
        },
      },
      include: {
        reviews: true,
      },
    };

    expect(response.status).toBe(201);
    // JSONシリアライズを考慮して期待値を生成
    const expectedResponse = { 
      ...createdDish, 
      createdAt: createdDish.createdAt.toISOString(),
      reviews: createdDish.reviews.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    };
    // レスポンスの`data`が期待値と一致するか確認
    expect(data).toEqual(expectedResponse);
    expect(mockPrisma.dish.create).toHaveBeenCalledWith(expectedPrismaArgs);
    expect(mockPrisma.dish.create).toHaveBeenCalledTimes(1);
  });
});
