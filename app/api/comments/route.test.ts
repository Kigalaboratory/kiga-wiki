import { GET, POST } from './route';
import { prisma } from '../../lib/prisma';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import type { Comment } from '@prisma/client';

// Comment型にchildrenプロパティを追加した拡張型
type CommentWithChildren = Comment & { children: CommentWithChildren[] };

// createdAt を string に変換した CommentWithChildren 型
type StringifiedCommentWithChildren = Omit<CommentWithChildren, 'createdAt' | 'children'> & {
  createdAt: string;
  children: StringifiedCommentWithChildren[];
};

// prismaモジュール全体をモック化
vi.mock('../../lib/prisma', () => ({
  prisma: {
    comment: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// vi.mockedを使用して型安全なモックを取得
const mockedPrisma = vi.mocked(prisma, true);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/comments', () => {
  // DateオブジェクトをISO文字列に変換する再帰関数
  const stringifyDates = (comments: CommentWithChildren[]): StringifiedCommentWithChildren[] => {
    return comments.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      children: c.children ? stringifyDates(c.children) : [],
    }));
  };

  it('should return comments for the homepage when dishId is not provided', async () => {
    const mockDate = new Date();
    const mockHomepageComments: CommentWithChildren[] = [
      { id: 1, author: 'Homepage Commenter', content: 'This is a homepage comment.', createdAt: mockDate, parentId: null, children: [], dishId: null, replyAuthor: null },
    ];
    mockedPrisma.comment.findMany.mockResolvedValue(mockHomepageComments);

    const req = new NextRequest('http://localhost/api/comments');
    const response = await GET(req);
    const data = await response.json();

    const expectedComments = stringifyDates(mockHomepageComments);

    expect(response.status).toBe(200);
    expect(data).toEqual(expectedComments);
    expect(mockedPrisma.comment.findMany).toHaveBeenCalledWith({
      where: { parentId: null, dishId: null },
      include: expect.any(Object),
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should return comments for a specific dish when dishId is provided', async () => {
    const mockDate = new Date();
    const mockDishComments: CommentWithChildren[] = [
      { id: 2, author: 'Dish Commenter', content: 'This is a dish comment.', createdAt: mockDate, parentId: null, children: [], dishId: 1, replyAuthor: null },
    ];
    mockedPrisma.comment.findMany.mockResolvedValue(mockDishComments);

    const req = new NextRequest('http://localhost/api/comments?dishId=1');
    const response = await GET(req);
    const data = await response.json();

    const expectedComments = stringifyDates(mockDishComments);

    expect(response.status).toBe(200);
    expect(data).toEqual(expectedComments);
    expect(mockedPrisma.comment.findMany).toHaveBeenCalledWith({
      where: { parentId: null, dishId: 1 },
      include: expect.any(Object),
      orderBy: { createdAt: 'desc' },
    });
  });
});

describe('POST /api/comments', () => {
  it('should create a new root comment and return it', async () => {
    const newComment = { author: '新人研究員', content: 'コメント失礼します！' };
    // モックデータに型を適用
    const createdComment: Comment = { ...newComment, id: 3, createdAt: new Date(), parentId: null };
    
    mockedPrisma.comment.create.mockResolvedValue(createdComment);

    const req = new NextRequest('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify(newComment),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ ...createdComment, createdAt: createdComment.createdAt.toISOString() });
    expect(mockedPrisma.comment.create).toHaveBeenCalledWith({ data: newComment });
    expect(mockedPrisma.comment.create).toHaveBeenCalledTimes(1);
  });

  it('should create a new reply comment and return it', async () => {
    const newReplyRequest = { replyAuthor: '返信者', content: '返信です', parentId: 1 };
    const createdReply: Comment = { id: 4, author: '返信者', content: '返信です', parentId: 1, createdAt: new Date(), replyAuthor: '返信者', dishId: null };

    mockedPrisma.comment.create.mockResolvedValue(createdReply);

    const req = new NextRequest('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify(newReplyRequest),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ ...createdReply, createdAt: createdReply.createdAt.toISOString() });
    expect(mockedPrisma.comment.create).toHaveBeenCalledWith({
      data: {
        author: '返信者',
        content: '返信です',
        parentId: 1,
        dishId: undefined,
      },
    });
  });
});
