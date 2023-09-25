import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function clean() {
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
}

async function createUserWithProfile() {
  // await clean();

  const user = await prisma.user.create({
    data: {},
  });

  const profile = await prisma.profile.create({
    data: {
      name: faker.person.firstName(),
      userId: user.id,
    },
  });

  console.log({
    user,
    profile,
  });

  return prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
}

async function main() {
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() => createUserWithProfile()),
  );

  console.log({ users });
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
