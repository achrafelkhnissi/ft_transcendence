import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function clean() {
  await prisma.user.deleteMany();
  await prisma.conversation.deleteMany();
}

async function generateRandomUser() {
  const user = await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      url: faker.internet.url(),
      stats: {
        create: {
          level: faker.number.int({ min: 1, max: 100 }),
          wins: faker.number.int({ min: 0, max: 100 }),
          losses: faker.number.int({ min: 0, max: 100 }),
        },
      },
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

async function createConversation(users) {
  const randomUser = () => users[Math.floor(Math.random() * users.length)];

  const conversation = await prisma.conversation.create({
    data: {
      type: 'PUBLIC', // Or 'PRIVATE', as needed
      ownerId: randomUser().id,
      // Other fields as necessary
      // ...
    },
  });

  // Add participants
  for (const user of users) {
    await prisma.participant.create({
      data: {
        userId: user.id,
        conversationId: conversation.id,
      },
    });
  }

  // Add a random number of messages to the conversation
  const messageCount = faker.number.int({ min: 5, max: 20 }); // Adjust range as needed
  for (let i = 0; i < messageCount; i++) {
    await prisma.message.create({
      data: {
        content: faker.lorem.sentence(),
        conversationId: conversation.id,
        senderId: randomUser().id,
        receiverId: randomUser().id,
      },
    });
  }

  return conversation;
}

async function main() {
  await clean(); // Produces and error is the database is empty (Ignore it)

  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await generateRandomUser();
    users.push(user);
  }

  for (let i = 0; i < 5; i++) {
    await createConversation(users);
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
