import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();

    const table = await prisma.htable.update({
      where: { id },
      data: body
    });
    
    // Map id to tableNo for frontend compatibility
    const mappedTable = { ...table, tableNo: table.id };
    
    return NextResponse.json({ success: true, data: mappedTable }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    
    await prisma.htable.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
