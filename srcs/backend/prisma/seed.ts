import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function clean() {
  await prisma.user.deleteMany();
}

async function generateRandomUser() {
  const user = await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      url: faker.internet.url(),
      // Create stats nested record
      stats: {
        create: {
          level: faker.datatype.number(),
          wins: faker.datatype.number(),
          losses: faker.datatype.number(),
          exp: faker.datatype.number(),
        },
      },
      // Create settings nested record
      settings: {
        create: {
          twoFactorEnabled: faker.datatype.boolean(),
          verified: faker.datatype.boolean(),
        },
      },
    },
  });

  return user;
}

async function main() {
  await clean();
  for (let i = 0; i < 10; i++) {
    await generateRandomUser();
  }
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
