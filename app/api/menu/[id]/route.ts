import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const item = await prisma.menu.findUnique({
            where: { id }
        });
        if (!item) {
            return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

interface MenuUpdateBody {
    name?: string;
    price?: number;
    category?: string;
    description?: string;
    image?: string;
    available?: boolean;
}

export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json() as MenuUpdateBody;

        // Ensure price is float
        if (body.price) body.price = parseFloat(body.price.toString());

        const item = await prisma.menu.update({
            where: { id },
            data: body
        });
        return NextResponse.json({ success: true, data: item }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        await prisma.menu.delete({
            where: { id }
        });
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
