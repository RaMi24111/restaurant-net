import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

interface LoginBody {
    phone?: string;
    otp?: string;
    userId?: string;
    password?: string;
    type?: string;
}

export async function POST(request: Request) {
    try {
        const { phone, otp, userId, password, type } = await request.json() as LoginBody;

        // STAFF LOGIN
        if (userId && password) {
            const staff = await prisma.staff.findFirst({
                where: {
                    OR: [
                        { username: userId },
                        { phone: userId }
                    ]
                }
            });

            if (!staff) {
                return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
            }

            const isMatch = await bcrypt.compare(password, staff.password);
            if (!isMatch) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            return NextResponse.json({ success: true, data: staff, role: staff.role }, { status: 200 });
        }

        // ADMIN LOGIN
        if (phone && (otp || password)) {
            const pwd = otp || password;

            if (!pwd) {
                return NextResponse.json({ error: 'Password or OTP required' }, { status: 400 });
            }

            const admin = await prisma.admin.findUnique({
                where: { phone }
            });

            if (!admin) {
                return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
            }

            // Verify password
            const isMatch = await bcrypt.compare(pwd, admin.password);
            if (!isMatch) {
                if (pwd === '1234') {
                    // Fallback for demo - not recommended in production
                } else {
                    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
                }
            }

            return NextResponse.json({ success: true, data: admin, role: 'admin' }, { status: 200 });
        }

        return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
