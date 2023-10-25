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
      // twoFactorEnabled: faker.datatype.boolean(),
      // twoFactorSecret: faker.string.hexadecimal(),
    },
  });

  return user;
}

async function main() {
  // await clean();
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
