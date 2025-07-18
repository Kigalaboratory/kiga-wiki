import { prisma } from './prisma';
import { cache } from 'react';

export const getAllDishes = cache(async () => {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        reviews: true,
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
  chef: string;
  comment: string;
};

export async function createDish(data: CreateDishData) {
  try {
    const { name, chef, comment } = data;
    const newDish = await prisma.dish.create({
      data: {
        name,
        reviews: {
          create: {
            chef,
            comment,
          },
        },
      },
      include: {
        reviews: true,
      },
    });
    return newDish;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create dish.');
  }
}

type CreateReviewData = {
  dishId: number;
  chef: string;
  comment: string;
};

export async function createReview(data: CreateReviewData) {
  try {
    const newReview = await prisma.review.create({
      data,
    });
    return newReview;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create review.');
  }
}
