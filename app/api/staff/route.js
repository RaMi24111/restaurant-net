import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'billing' or 'serving'

  try {
    const where = type ? { role: type } : {};
    const staff = await prisma.staff.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, role } = body;

    // Generate specific prefix based on role
    const prefix = role === 'billing' ? 'BILL' : 'SERV';
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${prefix}-${uniqueSuffix}`;
    const rawPassword = Math.random().toString(36).slice(-8); // Simple random password
    
    // Hash password
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const staff = await prisma.staff.create({
      data: {
        name,
        phone,
        role,
        username,
        password: hashedPassword 
      }
    });

    // Return the raw password ONLY ONCE so the admin can see it?
    // The prompt says "password should be in hashed format and not be visible...".
    // But "generated ... should directly be entered into the staff login".
    // Usually we return the raw password in the response of creation so the admin can give it to the staff.
    // I will attach it to the response data but it's not in DB.
    
    return NextResponse.json({ success: true, data: { ...staff, tempPassword: rawPassword } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        
        // If updating password, hash it
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const staff = await prisma.staff.update({
            where: { id: parseInt(id) }, // ID is Int in Prisma
            data: updateData
        });
        
        return NextResponse.json({ success: true, data: staff });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedStaff = await prisma.staff.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true, data: deletedStaff });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
