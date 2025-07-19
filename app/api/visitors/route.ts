import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  const visitor = await prisma.visitor.findFirst();
  return NextResponse.json({ count: visitor?.count ?? 0 });
}

export async function POST() {
  const visitor = await prisma.visitor.findFirst();

  if (visitor) {
    const updatedVisitor = await prisma.visitor.update({
      where: { id: visitor.id },
      data: { count: visitor.count + 1 },
    });
    return NextResponse.json({ count: updatedVisitor.count });
  } else {
    const newVisitor = await prisma.visitor.create({
      data: { count: 1 },
    });
    return NextResponse.json({ count: newVisitor.count }, { status: 201 });
  }
}
