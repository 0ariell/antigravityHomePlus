
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, role: true }
  });
  console.log('Users in DB:');
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

main();
