import { prisma } from './prisma';
import { cache } from 'react';

export const getAllDishes = cache(async () => {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        comments: {
          where: { parentId: null },
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
      },
    });
    return dishes;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dishes.');
  }
});

type CreateDishData = {
  name: string;
  author: string;
  content: string;
};

export async function createDish(data: CreateDishData) {
  try {
    const { name, author, content } = data;
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
    return newDish;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create dish.');
  }
}
