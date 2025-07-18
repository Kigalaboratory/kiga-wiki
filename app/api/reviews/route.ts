import { NextResponse, NextRequest } from 'next/server';
import { createReview } from '../../lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dishId, chef, comment } = body;

    if (!dishId || !chef || !comment) {
      return new NextResponse('dishId, chef, and comment are required', { status: 400 });
    }

    const newReview = await createReview({ dishId, chef, comment });

    return new NextResponse(JSON.stringify(newReview), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return new NextResponse('Invalid JSON', { status: 400 });
    }
    console.error('[API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
