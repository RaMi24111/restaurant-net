const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Connecting to DB ---');
  try {
    const staff = await prisma.staff.findMany();
    console.log('--- STAFF RECORDS ---');
    console.log(JSON.stringify(staff, null, 2));
    
    const admin = await prisma.admin.findMany();
    console.log('--- ADMIN RECORDS ---');
    console.log(JSON.stringify(admin, null, 2));

  } catch (e) {
    console.error('DB Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
