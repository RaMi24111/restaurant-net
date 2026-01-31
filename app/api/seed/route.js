import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Table from '@/models/Table';
import Menu from '@/models/Menu';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await dbConnect();
    
    // Check if we have tables and menu items
    const tables = await Table.find({});
    const menuItems = await Menu.find({});
    
    if (tables.length === 0 || menuItems.length === 0) {
      return NextResponse.json({ error: 'Please setup tables and menu first.' }, { status: 400 });
    }

    // Clear existing orders? Maybe not, just append.
    // Requirement: "every table must have minimum 3 parties in that table in any particular day(atleast make it for 1 month details)"
    
    const today = new Date();
    const ordersToInsert = [];

    // Generate for last 30 days
    for (let d = 0; d < 30; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - d);
        
        for (const table of tables) {
            // 3 parties per table
            for (let p = 0; p < 3; p++) {
                // Random items
                const orderItems = [];
                let totalAmount = 0;
                const itemCount = Math.floor(Math.random() * 5) + 1; // 1-5 items
                
                for (let i = 0; i < itemCount; i++) {
                    const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
                    orderItems.push({
                        menuId: randomItem._id,
                        name: randomItem.name,
                        price: randomItem.price,
                        quantity: 1
                    });
                    totalAmount += randomItem.price;
                }

                ordersToInsert.push({
                    tableId: table._id,
                    date: new Date(date.setHours(12 + p, 0, 0)), // Spread them out (lunch/dinner)
                    items: orderItems,
                    totalAmount,
                    customerPhone: `+1555000${Math.floor(Math.random() * 9999)}`
                });
            }
        }
    }

    if (ordersToInsert.length > 0) {
        await Order.insertMany(ordersToInsert);
    }

    return NextResponse.json({ success: true, count: ordersToInsert.length }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
