import { GET, POST } from './route';
import { prisma } from '../../lib/prisma';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Visitor } from '@prisma/client';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    visitor: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const mockedPrisma = vi.mocked(prisma, true);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/visitors', () => {
  it('should return the current visitor count', async () => {
    const mockVisitorCount: Visitor = { id: 1, count: 1337 };
    mockedPrisma.visitor.findFirst.mockResolvedValue(mockVisitorCount);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ count: mockVisitorCount.count });
    expect(mockedPrisma.visitor.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should return 0 if no visitor count is found', async () => {
    mockedPrisma.visitor.findFirst.mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ count: 0 });
    expect(mockedPrisma.visitor.findFirst).toHaveBeenCalledTimes(1);
  });
});

describe('POST /api/visitors', () => {
  it('should increment the visitor count and return the new count', async () => {
    const initialCount: Visitor = { id: 1, count: 1337 };
    const updatedCount: Visitor = { ...initialCount, count: initialCount.count + 1 };

    mockedPrisma.visitor.findFirst.mockResolvedValue(initialCount);
    mockedPrisma.visitor.update.mockResolvedValue(updatedCount);

    const response = await POST(new Request('http://localhost'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ count: updatedCount.count });
    expect(mockedPrisma.visitor.findFirst).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.visitor.update).toHaveBeenCalledWith({
      where: { id: initialCount.id },
      data: { count: updatedCount.count },
    });
    expect(mockedPrisma.visitor.update).toHaveBeenCalledTimes(1);
  });

  it('should initialize the count if it does not exist', async () => {
    mockedPrisma.visitor.findFirst.mockResolvedValue(null);
    const newCount: Visitor = { id: 1, count: 1 };
    mockedPrisma.visitor.create.mockResolvedValue(newCount);

    const response = await POST(new Request('http://localhost'));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ count: newCount.count });
    expect(mockedPrisma.visitor.findFirst).toHaveBeenCalledTimes(1);
    expect(mockedPrisma.visitor.create).toHaveBeenCalledWith({ data: { count: 1 } });
    expect(mockedPrisma.visitor.create).toHaveBeenCalledTimes(1);
  });
});
