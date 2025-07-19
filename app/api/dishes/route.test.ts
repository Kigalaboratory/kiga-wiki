import { GET, POST } from './route';
import { prisma } from '../../lib/prisma';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { NextRequest } from 'next/server';
import { Dish, Comment } from '@prisma/client';

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
    const mockDishes: (Dish & { comments: Comment[] })[] = [
      { id: 1, name: 'モック料理1', createdAt: mockDate, comments: [] },
      { id: 2, name: 'モック料理2', createdAt: mockDate, comments: [] },
    ];
    mockPrisma.dish.findMany.mockResolvedValue(mockDishes);

    const response = await GET();
    const data = await response.json();

    // JSONシリアライズによりDateオブジェクトは文字列になるため、比較対象も文字列に変換する
    const expectedDishes = mockDishes.map(d => ({ 
      ...d, 
      createdAt: d.createdAt.toISOString(),
      comments: [],
    }));

    expect(response.status).toBe(200);
    expect(data).toEqual(expectedDishes);
    expect(prisma.dish.findMany).toHaveBeenCalledTimes(1);
  });
});

describe('POST /api/dishes', () => {
  it('should create a new dish with the first comment and return it', async () => {
    const newDishRequest = { name: '新作ラボ飯', author: '新人研究員', content: '美味しかったです！' };
    const createdDishWithComment: Dish & { comments: Comment[] } = { 
      id: 3, 
      name: newDishRequest.name, 
      createdAt: new Date(),
      comments: [
        { id: 1, dishId: 3, author: newDishRequest.author, content: newDishRequest.content, createdAt: new Date(), parentId: null, replyAuthor: null }
      ] 
    };
    
    mockPrisma.dish.create.mockResolvedValue(createdDishWithComment);

    const req = new NextRequest('http://localhost/api/dishes', {
      method: 'POST',
      body: JSON.stringify(newDishRequest),
    });

    const response = await POST(req);
    const data = await response.json();

    const { name, author, content } = newDishRequest;
    const expectedPrismaArgs = {
      data: {
        name,
        comments: {
          create: {
            author,
            content,
          },
        },
      },
      include: {
        comments: true,
      },
    };

    expect(response.status).toBe(201);
    const expectedResponse = { 
      ...createdDishWithComment, 
      createdAt: createdDishWithComment.createdAt.toISOString(),
      comments: createdDishWithComment.comments.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    };
    expect(data).toEqual(expectedResponse);
    expect(mockPrisma.dish.create).toHaveBeenCalledWith(expectedPrismaArgs);
    expect(mockPrisma.dish.create).toHaveBeenCalledTimes(1);
  });
});
