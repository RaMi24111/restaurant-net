import dbConnect from '@/lib/db';
import Menu from '@/models/Menu';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const items = await Menu.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const item = await Menu.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
