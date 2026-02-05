import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fromStr = searchParams.get('from');
        const toStr = searchParams.get('to');

        let where: Prisma.BillWhereInput = {};
        if (fromStr && toStr) {
            where.date = {
                gte: new Date(fromStr),
                lte: new Date(toStr)
            };
        }

        const bills = await prisma.bill.findMany({
            where,
            include: {
                table: true,
                staff: true
            },
            orderBy: { date: 'desc' }
        });

        const formattedBills = bills.map(bill => ({
            ...bill,
            _id: bill.id.toString(),
            items: bill.itemsOrdered,
            tableNo: bill.tableId
        }));

        return NextResponse.json({ success: true, data: formattedBills }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
