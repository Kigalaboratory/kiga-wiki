import { GET, POST } from './route';
import { prisma } from '../../lib/prisma';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    visitor: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/visitors', () => {
  it('should return the current visitor count', async () => {
    const mockVisitorCount = { id: 1, count: 1337 };
    (prisma.visitor.findFirst as any).mockResolvedValue(mockVisitorCount);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ count: mockVisitorCount.count });
    expect(prisma.visitor.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should return 0 if no visitor count is found', async () => {
    (prisma.visitor.findFirst as any).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ count: 0 });
    expect(prisma.visitor.findFirst).toHaveBeenCalledTimes(1);
  });
});

describe('POST /api/visitors', () => {
  it('should increment the visitor count and return the new count', async () => {
    const initialCount = { id: 1, count: 1337 };
    const updatedCount = { ...initialCount, count: initialCount.count + 1 };

    // findFirst is called first to get the current count
    (prisma.visitor.findFirst as any).mockResolvedValue(initialCount);
    // then update is called to increment it
    (prisma.visitor.update as any).mockResolvedValue(updatedCount);

    const req = new NextRequest('http://localhost/api/visitors', {
      method: 'POST',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ count: updatedCount.count });
    expect(prisma.visitor.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.visitor.update).toHaveBeenCalledWith({
      where: { id: initialCount.id },
      data: { count: updatedCount.count },
    });
    expect(prisma.visitor.update).toHaveBeenCalledTimes(1);
  });

  it('should initialize the count if it does not exist', async () => {
    (prisma.visitor.findFirst as any).mockResolvedValue(null);
    const newCount = { id: 1, count: 1 };
    (prisma.visitor.create as any).mockResolvedValue(newCount);

    const req = new NextRequest('http://localhost/api/visitors', {
      method: 'POST',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ count: newCount.count });
    expect(prisma.visitor.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.visitor.create).toHaveBeenCalledWith({ data: { count: 1 } });
    expect(prisma.visitor.create).toHaveBeenCalledTimes(1);
  });
});
