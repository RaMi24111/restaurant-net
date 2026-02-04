import prisma from '@/lib/prisma';
import QRCode from 'qrcode';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tables = await prisma.htable.findMany({
      orderBy: { id: 'asc' }, // Order by ID since tableNo/id are synced in logic? 
      // User schema I defined `id` and `status`, `capacity`. 
      // In the seed, I used `id` as auto-increment.
      // The original code had `tableNo`.
      // I should expose `id` as `tableNo` or add a `tableNo` field if strict compatibility is needed.
      // But `Htable` defined `id` @autoincrement which is basically `tableNo`.
    });
    // Map id to tableNo for frontend compatibility if needed
    const mappedTables = tables.map(t => ({
      ...t,
      tableNo: t.id
    }));
    return NextResponse.json({ success: true, data: mappedTables }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Bulk Setup
    if (body.count) {
      const count = parseInt(body.count);
      
      if (body.reset) {
        // Use TRUNCATE to reset IDs (PostgreSQL)
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "Htable" RESTART IDENTITY CASCADE;');
        await prisma.bill.deleteMany({}); // Bills are deleted by CASCADE but good to be explicit or let CASCADE handle it.
        // Note: CASCADE in TRUNCATE handles foreign keys content, but Prisma might have its own checks. 
        // With CASCADE, bills linked to tables are gone.
      }

      // If we didn't reset, we continue from valid sequence
      const createdTables = [];
      const tables = []; 
      
      // We can use createMany, but we need QR codes per table.
      // createMany doesn't return created records with IDs in all DBs (Postgres returns count).
      // So loop is okay for small numbers.
      
      for (let i = 1; i <= count; i++) {
        // We can't easily predict ID here if not reset.
        // It's better to create first, get ID, then update QR? 
        // Or just assume ID if we just reset.
        // If not reset, we might have gaps.
        // Let's create with temp QR, then update? Or just generate QR with "Table N".
        // The previous logic generated `tableNo` using `existingCount`.
        // Let's stick to simple creation. QR code might mismatch ID if not reset. 
        // But for "Reset" case (most common for setup), it will match 1..N.
        
        const table = await prisma.htable.create({
            data: {
                status: 'Empty',
                capacity: 4
                // Delay QR generation or put placeholder?
                // Depending on requirement, let's put generic.
            }
        });

        // Update with QR code based on the REAL ID
        const qrContent = JSON.stringify({ tableNo: table.id, type: 'restaurant-table' });
        const qrCodeDataURL = await QRCode.toDataURL(qrContent);
        
        const updatedTable = await prisma.htable.update({
            where: { id: table.id },
            data: { qrCode: qrCodeDataURL }
        });
        
        createdTables.push({ ...updatedTable, tableNo: updatedTable.id });
      }
      return NextResponse.json({ success: true, data: createdTables }, { status: 201 });
    }
    
    // Single Create
    if (body.tableNo || body.capacity) { // tableNo param is ignored for DB ID, but used for intent
        const table = await prisma.htable.create({
            data: {
                status: 'Empty',
                capacity: body.capacity || 4
            }
        });
        
        // Generate QR with real ID
        const qrContent = JSON.stringify({ tableNo: table.id, type: 'restaurant-table' });
        const qrCodeDataURL = await QRCode.toDataURL(qrContent);
        
        const finalTable = await prisma.htable.update({
             where: { id: table.id },
             data: { qrCode: qrCodeDataURL }
        });
        
        return NextResponse.json({ success: true, data: { ...finalTable, tableNo: finalTable.id } }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
