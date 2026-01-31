import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Simple validation
    if (!body.name || !body.phone || !body.restaurantName || !body.restaurantAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingAdmin = await Admin.findOne({ phone: body.phone });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin with this phone already exists' }, { status: 400 });
    }

    const admin = await Admin.create(body);
    return NextResponse.json({ success: true, data: admin }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
