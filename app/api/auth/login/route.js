import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP are required' }, { status: 400 });
    }

    // Dummy OTP check
    // In a real app, verify OTP against a stored value or external service
    if (otp !== '1234') { 
       // For demo, let's accept '1234' or maybe just proceed if phone exists? 
       // User requirement: "dummy otp is fine"
       // Let's enforce 1234 for "security" simulation
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    const admin = await Admin.findOne({ phone });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found. Please register.' }, { status: 404 });
    }

    // In a real app, generate a JWT token here
    // For this simple demo, we might just return success and handle session on client 
    // or return the admin object
    return NextResponse.json({ success: true, data: admin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
