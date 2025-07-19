import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dishId = searchParams.get('dishId');

  const whereClause = {
    parentId: null,
    dishId: dishId ? parseInt(dishId, 10) : null,
  };

  const comments = await prisma.comment.findMany({
    where: whereClause,
    include: includeChildren,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const { author, content, parentId, replyAuthor, dishId } = await req.json();

  const finalAuthor = parentId ? replyAuthor : author;

  if (!finalAuthor) {
    return NextResponse.json({ error: 'Author is required' }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const newComment = await prisma.comment.create({
    data: {
      author: finalAuthor,
      content,
      parentId,
      dishId,
    },
  });
  return NextResponse.json(newComment, { status: 201 });
}
