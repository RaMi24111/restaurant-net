import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

interface RegisterBody {
    name: string;
    phone: string;
    password: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as RegisterBody;

        // Simple validation
        if (!body.name || !body.phone || !body.password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingAdmin = await prisma.admin.findUnique({
            where: { phone: body.phone }
        });

        if (existingAdmin) {
            return NextResponse.json({ error: 'Admin with this phone already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const admin = await prisma.admin.create({
            data: {
                name: body.name,
                phone: body.phone,
                password: hashedPassword,
            }
        });

        return NextResponse.json({ success: true, data: admin }, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
