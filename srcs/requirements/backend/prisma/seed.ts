import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function clean() {
  // await prisma.user.deleteMany();
}

async function generateRandomUser() {
  const user = await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      // password: faker.internet.password(),
      // avatar: faker.image.avatar(),
      // twoFactorEnabled: faker.datatype.boolean(),
      // twoFactorSecret: faker.string.hexadecimal(),
    },
  });

  // return prisma.user.findUnique({
  //   where: {
  //     id: user.id,
  //   },
  // });
  return user;
}

async function createFriendship(userId, friendUserId) {
  const friend = await prisma.friend.create({
    data: {
      user: {
        connect: { id: friendUserId },
      },
    },
  });
  return friend;
}

async function main() {
  await clean();

  // const users = await Promise.all(
  //   Array.from({ length: 10 }).map(() => generateRandomUser()),
  // );

  const user1 = await generateRandomUser();

  console.log('User1 created ✅');
  console.log({ user1 });

  const user2 = await generateRandomUser();
  console.log('User2 created ✅');
  console.log({ user2 });

  const friend = await createFriendship(user1.id, user2.id);
  console.log('Friendship created ✅');
  console.log({ friend });
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
