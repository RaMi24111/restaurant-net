import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');
    
    let where = {};
    if (fromStr && toStr) {
      where.date = {
        gte: new Date(fromStr),
        lte: new Date(toStr)
      };
    } else if (searchParams.get('date')) {
         // Fallback if needed, but we rely on from/to
         const d = new Date(searchParams.get('date'));
         // ...
    }

    const bills = await prisma.bill.findMany({
      where,
      include: {
        table: true, // to get table details
        staff: true  // to get staff details
      },
      orderBy: { date: 'desc' }
    });

    // Transform data to match frontend expectations (itemsOrdered -> items)
    const formattedBills = bills.map(bill => ({
      ...bill,
      _id: bill.id.toString(), // Frontend expects _id for keys/display
      items: bill.itemsOrdered, // Frontend expects items
      tableNo: bill.tableId // or bill.table.id
    }));

    return NextResponse.json({ success: true, data: formattedBills }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

