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
      password: faker.internet.password(),
      avatar: faker.image.avatar(),
    },
  });

  return prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
}

async function main() {
  await clean();

  const users = await Promise.all(
    Array.from({ length: 10 }).map(() => generateRandomUser()),
  );

  console.log('Users created ✅');
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
