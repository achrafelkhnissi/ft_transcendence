import { UsersService } from 'src/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';

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
    let user;
    try {
      user = await this.usersService.findByEmail(email);
    } catch (error) {
      this.logger.warn(error.message);

      const avatar = await this.usersService.getAvatarFrom42API(
        'https://api.intra.42.fr/v2/me',
        accessToken,
      );

      user = await this.usersService.create({
        email,
        username,
        url,
        avatar,
      });
      user.justCreated = true;
    }
    return user;
  }
}
