

import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

async function testApi() {
  console.log('--- TESTING API DIRECTLY ---');

  // 1. Get Ariel
  const ariel = await prisma.user.findFirst({
    where: { 
        OR: [
            { firstName: { contains: 'Ariel', mode: 'insensitive' } },
            { lastName: { contains: 'Rivero', mode: 'insensitive' } }
        ]
    }
  });

  if (!ariel) { console.log('Ariel not found'); return; }
  console.log(`User: ${ariel.firstName} (${ariel.id})`);

  // 2. Generate Token (Bypass login)
  const payload = { sub: ariel.id, email: ariel.email, role: ariel.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  console.log('Generated Test Token.');

  // 3. Call API
  try {
    const response = await fetch('http://localhost:3000/api/service-requests/all-open', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`\nAPI Status: ${response.status}`);
    const data = await response.json();
    console.log(`Items returned: ${data.length}`);
    
    if (data.length > 0) {
      console.log('First Item:', data[0].title);
    } else {
      console.log('API returned EMPTY ARRAY.');
    }

  } catch (error: any) {
    console.error('API Call Failed:', error.message);
  }

  await prisma.$disconnect();
}

testApi();
