
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- DATABASE DEBUG ---');
  
  // Test connection and count
  const tables = [
    'user',
    'service',
    'serviceRequest',
    'quote',
    'booking',
    'notification',
    'review',
    'payment',
    'conversation',
    'message'
  ];

  for (const table of tables) {
    try {
      // @ts-ignore
      const count = await prisma[table].count();
      console.log(`[${table}]: ${count} records`);
      if (count > 0) {
         // @ts-ignore
         const items = await prisma[table].findMany({ take: 1 });
         console.log(`  Sample ID: ${items[0].id}`);
      }
    } catch (e) {
      console.log(`[${table}]: ERROR - ${e.message}`);
    }
  }

  console.log('--- END DEBUG ---');
  await prisma.$disconnect();
}

main();
