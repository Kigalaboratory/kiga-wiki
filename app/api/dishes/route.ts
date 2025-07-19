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
    const { name, author, content } = body;

    if (!name || !author || !content) {
      return new NextResponse('Name, author, and content are required', { status: 400 });
    }

    const newDish = await createDish({ name, author, content });
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
    console.error('[API_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
