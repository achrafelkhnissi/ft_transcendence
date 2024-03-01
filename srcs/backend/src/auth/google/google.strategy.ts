import { UsersService } from 'src/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const username = profile.displayName.replace(/ /g, '').toLowerCase();
    const email = profile.emails[0].value;
    const avatar = profile.photos[0].value;
    const url = '';

    try {
      return await this.usersService.findByEmail(email);
    } catch (error) {
      const user = await this.usersService.create({
        email,
        username,
        url,
        avatar,
      });

      return {
        ...user,
        isNew: true,
      };
    }
  }
}
