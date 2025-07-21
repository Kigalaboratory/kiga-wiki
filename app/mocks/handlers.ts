import { http, HttpResponse } from 'msw';
import { PrismaClient } from '@prisma/client';
import { CommentWithChildren, DishWithComments } from '../types';

const prisma = new PrismaClient();

export const handlers = [
  // /api/visitorsへのGETリクエストをインターセプト
  http.get('/api/visitors', async () => {
    const visitor = await prisma.visitor.findFirst();
    return HttpResponse.json({ count: visitor?.count ?? 0 });
  }),

  // /api/visitorsへのPOSTリクエストをインターセプト
  http.post('/api/visitors', async () => {
    const visitor = await prisma.visitor.upsert({
      where: { id: 1 },
      update: { count: { increment: 1 } },
      create: { id: 1, count: 1 },
    });
    return HttpResponse.json({ count: visitor.count });
  }),

  // /api/dishesへのGETリクエストをインターセプト
  http.get('/api/dishes', async () => {
    const dishes = await prisma.dish.findMany({
      include: {
        comments: {
          include: {
            children: true,
          },
        },
      },
    });
    return HttpResponse.json(dishes);
  }),

  // /api/dishesへのPOSTリクエストをインターセプト
  http.post('/api/dishes', async ({ request }) => {
    const { name, author, content } = (await request.json()) as { name: string; author: string; content: string };
    const newDish = await prisma.dish.create({
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
    });
    return HttpResponse.json(newDish, { status: 201 });
  }),

  // /api/commentsへのGETリクエストをインターセプト
  http.get('/api/comments', async ({ request }) => {
    const url = new URL(request.url);
    const dishId = url.searchParams.get('dishId');
    const comments = await prisma.comment.findMany({
      where: {
        dishId: dishId ? parseInt(dishId) : null,
      },
      include: {
        children: true,
      },
    });
    return HttpResponse.json(comments);
  }),

  // /api/commentsへのPOSTリクエストをインターセプト
  http.post('/api/comments', async ({ request }) => {
    const { content, author, dishId, parentId } = (await request.json()) as { content: string; author: string; dishId?: number; parentId?: number };
    const newComment = await prisma.comment.create({
      data: {
        content,
        author,
        dishId: dishId ?? null,
        parentId: parentId ?? null,
      },
    });
    return HttpResponse.json(newComment, { status: 201 });
  }),
];
