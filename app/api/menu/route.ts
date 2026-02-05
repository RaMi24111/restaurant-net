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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

interface MenuCreateBody {
    name: string;
    price: number;
    category?: string;
    description?: string;
    image?: string;
    available?: boolean;
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as MenuCreateBody;

        const item = await prisma.menu.create({
            data: {
                name: body.name,
                price: parseFloat(body.price.toString()),
                category: body.category || 'Main Course',
                description: body.description,
                image: body.image,
                available: body.available !== undefined ? body.available : true,
            },
        });
        return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
