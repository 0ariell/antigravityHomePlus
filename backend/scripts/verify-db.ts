
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Verification of Database Counts:');

  const tables = [
    'user',
    'notification',
    'review',
    'message',
    'conversation',
    'payment',
    'quote',
    'booking',
    'serviceRequest',
    'service'
  ];

  for (const table of tables) {
    // @ts-ignore
    const count = await prisma[table].count();
    console.log(`${table}: ${count}`);
  }

  await prisma.$disconnect();
}

main();
