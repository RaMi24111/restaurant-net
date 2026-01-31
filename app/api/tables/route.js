import dbConnect from '@/lib/db';
import Table from '@/models/Table';
import QRCode from 'qrcode';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const tables = await Table.find({}).sort({ tableNo: 1 });
    return NextResponse.json({ success: true, data: tables }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Bulk Setup
    if (body.count) {
      // Clear existing? Or just add?
      // "ask first how many tables... display that many" implies initialization.
      // Let's clear and create for simplicity of the prompt's flow, or check if we should append.
      // User says "admin can also add/remove/update". 
      // Let's support both: if 'count' is passed and 'reset' is true, wipe and create.
      
      const count = parseInt(body.count);
      const createdTables = [];
      
      // If we are initializing, we might want to start from table 1
      // Check validation
      if (body.reset) {
        await Table.deleteMany({});
      }

      const existingCount = await Table.countDocuments();
      
      for (let i = 1; i <= count; i++) {
        const tableNo = existingCount + i;
        // Generate QR Code
        // content: just json or a url? "it will give the table QR... when admin clicks on that particular QR then it will give order details"
        // The QR should probably contain the table ID/Number so the scanner knows which table it is.
        // For admin dashboard usage, the admin clicks a date -> sees tables -> clicks QR -> sees orders.
        // This means the QR is 'displayed'. 
        // The prompt says "it will generate a unique QR code for each of the tables".
        const qrContent = JSON.stringify({ tableNo, type: 'restaurant-table' });
        const qrCodeDataURL = await QRCode.toDataURL(qrContent);

        const table = await Table.create({
          tableNo,
          qrCode: qrCodeDataURL,
          status: 'Empty'
        });
        createdTables.push(table);
      }
      return NextResponse.json({ success: true, data: createdTables }, { status: 201 });
    }
    
    // Single Create
    if (body.tableNo) {
      const qrContent = JSON.stringify({ tableNo: body.tableNo, type: 'restaurant-table' });
      const qrCodeDataURL = await QRCode.toDataURL(qrContent);
      const table = await Table.create({ ...body, qrCode: qrCodeDataURL });
      return NextResponse.json({ success: true, data: table }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
