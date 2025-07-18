import { NextResponse, NextRequest } from 'next/server';
import { getAllDishes, createDish } from '../../lib/data';

export async function GET() {
  try {
    const dishes = await getAllDishes();
    return NextResponse.json(dishes);
  } catch (error) {
    console.error('[API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, chef, comment } = body;

    if (!name || !chef) {
      return new NextResponse('Name and chef are required', { status: 400 });
    }

    const newDish = await createDish({ name, chef, comment });
    return new NextResponse(JSON.stringify(newDish), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return new NextResponse('Invalid JSON', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
