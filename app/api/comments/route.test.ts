import { GET, POST } from './route';
import { prisma } from '../../lib/prisma';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    comment: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/comments', () => {
  it('should return a nested list of comments from the database', async () => {
    const mockDate = new Date();
    const mockComments = [
      { id: 1, author: '親コメント', content: 'これが親です', createdAt: mockDate, parentId: null, children: [
        { id: 2, author: '子コメント', content: 'これが子です', createdAt: mockDate, parentId: 1, children: [] }
      ]}
    ];
    (prisma.comment.findMany as any).mockResolvedValue(mockComments);

    const response = await GET();
    const data = await response.json();

    // DateオブジェクトをISO文字列に変換する再帰関数
    const stringifyDates = (comments: any[]): any[] => {
      return comments.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        children: c.children ? stringifyDates(c.children) : [],
      }));
    };
    const expectedComments = stringifyDates(mockComments);

    expect(response.status).toBe(200);
    expect(data).toEqual(expectedComments);
    expect(prisma.comment.findMany).toHaveBeenCalledWith({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  });
});

describe('POST /api/comments', () => {
  it('should create a new root comment and return it', async () => {
    const newComment = { author: '新人研究員', content: 'コメント失礼します！' };
    const createdComment = { ...newComment, id: 3, createdAt: new Date(), parentId: null };
    
    (prisma.comment.create as any).mockResolvedValue(createdComment);

    const req = new NextRequest('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify(newComment),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ ...createdComment, createdAt: createdComment.createdAt.toISOString() });
    expect(prisma.comment.create).toHaveBeenCalledWith({ data: newComment });
    expect(prisma.comment.create).toHaveBeenCalledTimes(1);
  });

  it('should create a new reply comment and return it', async () => {
    const newReply = { author: '返信者', content: '返信です', parentId: 1 };
    const createdReply = { ...newReply, id: 4, createdAt: new Date() };

    (prisma.comment.create as any).mockResolvedValue(createdReply);

    const req = new NextRequest('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify(newReply),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ ...createdReply, createdAt: createdReply.createdAt.toISOString() });
    expect(prisma.comment.create).toHaveBeenCalledWith({ data: newReply });
  });
});
