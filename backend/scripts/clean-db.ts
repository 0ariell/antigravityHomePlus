
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting database cleanup (preserving Users)...');

  try {
    const counts = {
      notifications: await prisma.notification.deleteMany({}),
      reviews: await prisma.review.deleteMany({}),
      messages: await prisma.message.deleteMany({}),
      conversations: await prisma.conversation.deleteMany({}),
      payments: await prisma.payment.deleteMany({}),
      quotes: await prisma.quote.deleteMany({}),
      bookings: await prisma.booking.deleteMany({}),
      serviceRequests: await prisma.serviceRequest.deleteMany({}),
      services: await prisma.service.deleteMany({}),
    };

    console.log('Results:');
    console.table(Object.entries(counts).map(([table, result]) => ({ table, deleted: result.count })));

    console.log('✅ Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
