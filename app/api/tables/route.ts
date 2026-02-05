import prisma from '@/lib/prisma';
import QRCode from 'qrcode';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const tables = await prisma.htable.findMany({
            orderBy: { id: 'asc' },
        });

        const mappedTables = tables.map(t => ({
            ...t,
            tableNo: t.id
        }));
        return NextResponse.json({ success: true, data: mappedTables }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

interface TableBulkCreateBody {
    count: number;
    reset?: boolean;
}

interface TableSingleCreateBody {
    tableNo?: number;
    capacity?: number;
}

type TableCreateBody = TableBulkCreateBody | TableSingleCreateBody;

export async function POST(request: Request) {
    try {
        const body = await request.json() as TableCreateBody;

        // Bulk Setup
        if ('count' in body && body.count) {
            const count = parseInt(body.count.toString());

            if (body.reset) {
                // Use TRUNCATE to reset IDs (PostgreSQL)
                await prisma.$executeRawUnsafe('TRUNCATE TABLE "Htable" RESTART IDENTITY CASCADE;');
            }

            const createdTables = [];

            for (let i = 1; i <= count; i++) {
                const table = await prisma.htable.create({
                    data: {
                        status: 'Empty',
                        capacity: 4
                    }
                });

                // Update with QR code based on the REAL ID
                const qrContent = JSON.stringify({ tableNo: table.id, type: 'restaurant-table' });
                const qrCodeDataURL = await QRCode.toDataURL(qrContent);

                const updatedTable = await prisma.htable.update({
                    where: { id: table.id },
                    data: { qrCode: qrCodeDataURL }
                });

                createdTables.push({ ...updatedTable, tableNo: updatedTable.id });
            }
            return NextResponse.json({ success: true, data: createdTables }, { status: 201 });
        }

        // Single Create
        if ('capacity' in body || 'tableNo' in body) {
            const table = await prisma.htable.create({
                data: {
                    status: 'Empty',
                    capacity: body.capacity || 4
                }
            });

            // Generate QR with real ID
            const qrContent = JSON.stringify({ tableNo: table.id, type: 'restaurant-table' });
            const qrCodeDataURL = await QRCode.toDataURL(qrContent);

            const finalTable = await prisma.htable.update({
                where: { id: table.id },
                data: { qrCode: qrCodeDataURL }
            });

            return NextResponse.json({ success: true, data: { ...finalTable, tableNo: finalTable.id } }, { status: 201 });
        }

        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
