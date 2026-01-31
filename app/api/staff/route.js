import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'billing' or 'serving'

  try {
    const query = type ? { role: type } : {};
    const staff = await Staff.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { name, phone, role } = body;

    // Generate specific prefix based on role
    const prefix = role === 'billing' ? 'BILL' : 'SERV';
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${prefix}-${uniqueSuffix}`;
    const password = Math.random().toString(36).slice(-8); // Simple random password

    const staff = await Staff.create({
      name,
      phone,
      role,
      username,
      password
    });

    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        
        const staff = await Staff.findByIdAndUpdate(id, updateData, { new: true });
        if (!staff) {
             return NextResponse.json({ success: false, error: "Staff not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: staff });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedStaff = await Staff.findByIdAndDelete(id);
        if (!deletedStaff) {
             return NextResponse.json({ success: false, error: "Staff not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: deletedStaff });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
