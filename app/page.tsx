import { prisma } from './lib/prisma';
import HomePage from './components/HomePage';
import { CommentWithChildren } from './types';
import type { Comment } from '@prisma/client';

// PrismaのfindManyの返り値の型を再帰的に定義
type CommentFromPrisma = Comment & {
  children?: CommentFromPrisma[];
};

// ネストされたコメントを再帰的に処理するためのヘルパー関数
function processComments(comments: CommentFromPrisma[]): CommentWithChildren[] {
  return comments.map(comment => ({
    ...comment,
    children: comment.children ? processComments(comment.children) : [],
  }));
}

async function getComments() {
  const comments = await prisma.comment.findMany({
    where: {
      parentId: null,
      dishId: null,
    },
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
    orderBy: {
      createdAt: 'desc',
    },
  });
  return processComments(comments);
}

export default async function Page() {
  const initialComments = await getComments();
  return <HomePage initialComments={initialComments} />;
}
