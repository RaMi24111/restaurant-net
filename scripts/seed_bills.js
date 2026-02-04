const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding bills...');

  // 1. Get Existing Tables and Staff
  const tables = await prisma.htable.findMany();
  if (tables.length === 0) {
    console.error('No tables found! Please add tables via the Dashboard first.');
    return;
  }
  
  const staff = await prisma.staff.findFirst({ where: { role: 'billing' } });
  const server = await prisma.staff.findFirst({ where: { role: 'serving' } });
  const fallbackStaff = await prisma.staff.findFirst();

  const billingStaffId = staff?.id || fallbackStaff?.id;
  
  if (!billingStaffId) {
      console.error('No staff found! Seed staff first.');
      return;
  }

  // 2. Clear existing bills to avoid duplicates? 
  // User asked for "dummy details... for past one month". 
  // Let's clear to be clean or just add? 
  // "add at least 5 customer history". Let's just add.
  // Actually, to make "Total Revenue" clean, maybe clear old junk if we are re-seeding?
  // Let's keep it additive but maybe delete if we want a fresh state.
  // I will delete OLD bills from this script run to ensure no massive clutter if run multiple times.
  // await prisma.bill.deleteMany({}); // Optional: uncomment if you want fresh start

  // 3. Generate Bills
  const menuItems = [
    { name: 'Masala Dosa', price: 80 },
    { name: 'Chicken Biryani', price: 250 },
    { name: 'Coffee', price: 30 },
    { name: 'Special Thali', price: 300 },
    { name: 'Paneer Tikka', price: 180 },
  ];

  for (let d = 0; d < 30; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    
    // Distribute 5-8 bills per day
    const dailyCount = 5 + Math.floor(Math.random() * 3);

    for (let i = 0; i < dailyCount; i++) {
        const table = tables[Math.floor(Math.random() * tables.length)];
        
        // Random items
        const itemCount = 1 + Math.floor(Math.random() * 3);
        const currentItems = [];
        let totalAmount = 0;

        for(let j=0; j<itemCount; j++) {
            const item = menuItems[Math.floor(Math.random() * menuItems.length)];
            const quantity = 1 + Math.floor(Math.random() * 2);
            const cost = item.price * quantity;
            currentItems.push({
                name: item.name,
                count: quantity,
                price: item.price,
                total: cost
            });
            totalAmount += cost;
        }

        // Random hour matching restaurant hours (e.g., 10 AM to 10 PM)
        const hour = 10 + Math.floor(Math.random() * 12);
        const minute = Math.floor(Math.random() * 60);
        const billDate = new Date(date);
        billDate.setHours(hour, minute, 0, 0);

        await prisma.bill.create({
            data: {
                date: billDate,
                status: 'paid',
                itemsOrdered: currentItems,
                totalAmount: totalAmount,
                tableId: table.id,
                staffId: billingStaffId // Assigned to billing staff
            }
        });
    }
  }

  console.log('Successfully seeded 30 days of bill history!');
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
