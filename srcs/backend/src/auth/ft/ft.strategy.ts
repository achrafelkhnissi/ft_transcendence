import { UsersService } from 'src/users/users.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

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
      user = await this.usersService.findByEmail(email);
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
      user.justCreated = true;

      const users = await prisma.user.findMany();

      for (let i = 0; i < 5; i++) {
        await createConversation(users);
      }
    }
  }
}
