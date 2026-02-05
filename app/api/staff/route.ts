import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

interface StaffCreateBody {
    name: string;
    phone: string;
    role: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as StaffCreateBody;
        const { name, phone, role } = body;

        // Generate specific prefix based on role
        const prefix = role === 'billing' ? 'BILL' : 'SERV';
        const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
        const username = `${prefix}-${uniqueSuffix}`;
        const rawPassword = Math.random().toString(36).slice(-8);

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

        return NextResponse.json({ success: true, data: { ...staff, tempPassword: rawPassword } });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}

interface StaffUpdateBody {
    id: number;
    name?: string;
    phone?: string;
    role?: string;
    password?: string;
}

export async function PUT(request: Request) {
    try {
        const body = await request.json() as StaffUpdateBody;
        const { id, ...updateData } = body;

        // If updating password, hash it
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const staff = await prisma.staff.update({
            where: { id: parseInt(id.toString()) },
            data: updateData
        });

        return NextResponse.json({ success: true, data: staff });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedStaff = await prisma.staff.delete({
            where: { id: parseInt(id || '0') }
        });
        return NextResponse.json({ success: true, data: deletedStaff });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}
