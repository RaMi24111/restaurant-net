import { NextResponse } from 'next/server';

// This seed route was using MongoDB models which have been removed
// Keeping as placeholder or can be removed entirely
export async function POST() {
    return NextResponse.json({
        error: 'Seed functionality has been removed. Use prisma/seed.js instead.'
    }, { status: 410 });
}
