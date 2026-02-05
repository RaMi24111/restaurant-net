import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteParams {
    params: Promise<{ id: string }>;
}

interface TableUpdateBody {
    status?: string;
    capacity?: number;
    qrCode?: string;
}

export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json() as TableUpdateBody;

        const table = await prisma.htable.update({
            where: { id },
            data: body
        });

        const mappedTable = { ...table, tableNo: table.id };

        return NextResponse.json({ success: true, data: mappedTable }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);

        await prisma.htable.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
