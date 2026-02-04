import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const items = await prisma.menu.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Validate required fields if necessary, but Prisma throws if missing
    const item = await prisma.menu.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        category: body.category || 'Main Course',
        description: body.description,
        image: body.image,
        available: body.available !== undefined ? body.available : true,
      },
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
