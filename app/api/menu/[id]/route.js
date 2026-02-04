import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    
    // Ensure price is float
    if(body.price) body.price = parseFloat(body.price);

    const item = await prisma.menu.update({
      where: { id },
      data: body
    });
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const item = await prisma.menu.delete({
      where: { id }
    });
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

