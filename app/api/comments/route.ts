import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';


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
  const { author, content, parentId, replyAuthor } = await req.json();

  if (parentId && !replyAuthor) {
    // 返信なのに返信者名がない
    return NextResponse.json({ error: 'Reply author is required for replies' }, { status: 400 });
  }
  if (!parentId && !author) {
    // 新規コメントなのに投稿者名がない
    return NextResponse.json({ error: 'Author is required for new comments' }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const newComment = await prisma.comment.create({
    data: {
      author: parentId ? '' : author, // 返信の場合はauthorを空にするか、親のauthorを引き継ぐか決める
      content,
      parentId,
      replyAuthor,
    },
  });
  return NextResponse.json(newComment, { status: 201 });
}
