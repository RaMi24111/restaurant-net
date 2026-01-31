import dbConnect from '@/lib/db';
import Table from '@/models/Table';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const table = await Table.findByIdAndUpdate(id, body, { new: true });
    if (!table) return NextResponse.json({ error: 'Table not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: table }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const table = await Table.findByIdAndDelete(id);
    if (!table) return NextResponse.json({ error: 'Table not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
