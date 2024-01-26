import { UsersService } from 'src/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';

// TODO: Remove this after testing
import { ConversationType, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const conversationType = [
  ConversationType.DM,
  ConversationType.PRIVATE,
  ConversationType.PUBLIC,
  ConversationType.PROTECTED,
];

async function createConversation(users) {
  if (users.length < 2) {
    return;
  }

  const randomUser = () => users[Math.floor(Math.random() * users.length)];
  const type =
    users.length == 2
      ? ConversationType.DM
      : conversationType[randomNumber(0, conversationType.length)];

  const conversationName =
    users.length > 2
      ? faker.lorem
          .word()
          .toLowerCase()
          .replace(/[^a-z]/g, '')
          .substring(0, 8)
      : users[0].username + ' & ' + users[1].username;

  const image = faker.image.avatar();

  const conversation = await prisma.conversation.create({
    data: {
      type: type,
      ownerId: type == ConversationType.DM ? null : randomUser().id,
      name: users.length > 2 ? conversationName : faker.lorem.word(),
      password: type == ConversationType.PROTECTED ? 'password' : null,
      image,
    },
  });

  // If the conversation is a DM, add the users as participants to the conversation
  if (type == ConversationType.DM) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        participants: {
          connect: [
            {
              id: users[0].id,
            },
            {
              id: users[1].id,
            },
          ],
        },
      },
    });
  } else {
    const participantCount = randomNumber(2, users.length);
    for (let i = 0; i < participantCount; i++) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          participants: {
            connect: [
              {
                id: randomUser().id,
              },
            ],
          },
        },
      });
    }

    const adminCount = randomNumber(1, 3);
    for (let i = 0; i < adminCount; i++) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          admins: {
            connect: [
              {
                id: randomUser().id,
              },
            ],
          },
        },
      });
    }
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

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  private readonly logger = new Logger(FtStrategy.name);

  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: process.env.FT_REDIRECT_URI,
      Scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { username } = profile;
    const email = profile.emails[0].value;
    const url = process.env.FT_PROFILE_URL + username;

    this.logger.debug(`validating user ${username}`);

    try {
      return await this.usersService.findByEmail(email);
    } catch (error) {
      this.logger.warn(error.message);

      const avatar = await this.usersService.getAvatarFrom42API(
        'https://api.intra.42.fr/v2/me',
        accessToken,
      );

      const user = await this.usersService.create({
        email,
        username,
        url,
        avatar,
      });

      const numberOfUsers = randomNumber(1, 20);
      for (let i = 0; i < numberOfUsers; i++) {
        const username = faker.internet
          .userName()
          .toLowerCase()
          .replace(/[^a-z]/g, '')
          .substring(0, 8);

        await this.usersService.create({
          email: faker.internet.email(),
          username,
          url: faker.internet.url(),
          avatar: faker.image.avatar(),
        });
      }

      const users = await prisma.user.findMany();

      for (let i = 0; i < 5; i++) {
        await createConversation(users);
      }

      for (let i = 0; i < 5; i++) {
        await createConversation([
          user,
          users[Math.floor(Math.random() * users.length)],
        ]);
      }

      return {
        ...user,
        isNew: true,
      };
    }
  }
}
