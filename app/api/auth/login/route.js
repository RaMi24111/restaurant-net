import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { phone, otp, userId, password, type } = await request.json();

    // STAFF LOGIN
    if (userId && password) {
       // Ideally `userId` should match `username` or `phone` in Staff table? 
       // In Staff model we have `phone` and `username`.
       // Let's check against `username` first as per prompt "staff id ... entered into staff login" which usually means the generated ID (username).
       
       const staff = await prisma.staff.findFirst({
         where: {
            OR: [
                { username: userId },
                { phone: userId } // Allow phone login too
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
       // User asked for "admin id, phone number, password" for admin table.
       // And "dummy phone number, admin id and password"
       // Frontend sends `phone` and `otp`.
       // Let's treat `otp` as password for now since the frontend uses that field name.
       const pwd = otp || password;
       
       const admin = await prisma.admin.findUnique({
         where: { phone }
       });

       if (!admin) {
         return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
       }
       
       // Verify password
       const isMatch = await bcrypt.compare(pwd, admin.password);
       if (!isMatch) {
          // Fallback for "dummy" check if needed, but we seeded proper hash.
          // If we want to allow the "1234" hardcoded bypass from before:
          if (pwd === '1234') { 
              // allow for demo if strict mode fails? No, let's enforce DB.
          }
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
       }

       return NextResponse.json({ success: true, data: admin, role: 'admin' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
