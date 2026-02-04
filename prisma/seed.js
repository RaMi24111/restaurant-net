const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { phone: '1234' },
    update: {},
    create: {
      phone: '1234',
      password: adminPassword,
      name: 'admin',
    },
  });
  console.log({ admin });

  // 2. Staff
  const staffPassword = await bcrypt.hash('staff123', 10);
  
  const staff1 = await prisma.staff.upsert({
    where: { phone: '789' },
    update: {},
    create: {
      name: 'Rahul',
      phone: '789',
      username: 'BILL-789',
      role: 'billing',
      password: staffPassword,
    },
  });

  const staff2 = await prisma.staff.upsert({
    where: { phone: '678' },
    update: {},
    create: {
      name: 'Suresh',
      phone: '678',
      username: 'SERV-678',
      role: 'serving',
      password: staffPassword,
    },
  });
  console.log({ staff1, staff2 });

  // 3. Menu
  const menuItems = [
    { name: 'Masala Dosa', price: 80, category: 'veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=60' },
    { name: 'Chicken Biryani', price: 250, category: 'non veg', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=60' },
    { name: 'Coffee', price: 30, category: 'beverages', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=60' },
    { name: 'Special Thali', price: 300, category: 'todays special', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=60' },
  ];

  for (const item of menuItems) {
    await prisma.menu.create({
      data: item,
    });
  }
  console.log('Menu seeded');

  // 4. Tables
  for (let i = 1; i <= 5; i++) {
    await prisma.htable.create({
      data: {
        capacity: 4,
        status: i === 1 ? 'Occupied' : 'Empty',
      },
    });
  }
  console.log('Tables seeded');

  // Generate bills for past 30 days (5 per day)
  const tables = await prisma.htable.findMany();
  const staffMembers = [staff1, staff2];
  
  for (let d = 0; d < 30; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    
    for (let i = 0; i < 5; i++) {
        const randomTable = tables[Math.floor(Math.random() * tables.length)];
        const randomStaff = staffMembers[Math.floor(Math.random() * staffMembers.length)];

        await prisma.bill.create({
            data: {
            date: date,
            status: 'paid',
            itemsOrdered: [
                { name: 'Masala Dosa', count: 2, price: 80, total: 160 },
                { name: 'Coffee', count: 2, price: 30, total: 60 }
            ],
            totalAmount: 220,
            tableId: randomTable.id,
            staffId: randomStaff.id,
            }
        });
    }
  }
  
  console.log('Bills seeded');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
