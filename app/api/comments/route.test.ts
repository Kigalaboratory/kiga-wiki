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
  it('should return a nested list of comments from the database', async () => {
    const mockDate = new Date();
    // モックデータに型を適用
    const mockComments: CommentWithChildren[] = [
      { 
        id: 1, 
        author: '親コメント', 
        content: 'これが親です', 
        createdAt: mockDate, 
        parentId: null, 
        children: [
          { 
            id: 2, 
            author: '子コメント', 
            content: 'これが子です', 
            createdAt: mockDate, 
            parentId: 1, 
            children: [] 
          }
        ] 
      }
    ];
    mockedPrisma.comment.findMany.mockResolvedValue(mockComments);

    const response = await GET();
    const data = await response.json();

    // DateオブジェクトをISO文字列に変換する再帰関数
    const stringifyDates = (comments: CommentWithChildren[]): StringifiedCommentWithChildren[] => {
      return comments.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        children: c.children ? stringifyDates(c.children) : [],
      }));
    };
    const expectedComments = stringifyDates(mockComments);

    expect(response.status).toBe(200);
    expect(data).toEqual(expectedComments);
    expect(mockedPrisma.comment.findMany).toHaveBeenCalledWith({
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
