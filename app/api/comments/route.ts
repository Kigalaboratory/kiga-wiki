import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// 再帰的に子コメントを取得するための型定義
type CommentWithChildren = {
  id: number;
  author: string;
  content: string;
  createdAt: Date;
  parentId: number | null;
  children: CommentWithChildren[];
};

const includeChildren = {
  children: {
    include: {
      children: {
        include: {
          children: true, // さらに深い階層が必要な場合はここを増やす
        },
      },
    },
  },
};

export async function GET() {
  const comments = await prisma.comment.findMany({
    where: {
      parentId: null, // 親コメントのみを取得
    },
    include: includeChildren,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const { author, content, parentId } = await req.json();
  const newComment = await prisma.comment.create({
    data: {
      author,
      content,
      parentId,
    },
  });
  return NextResponse.json(newComment, { status: 201 });
}
