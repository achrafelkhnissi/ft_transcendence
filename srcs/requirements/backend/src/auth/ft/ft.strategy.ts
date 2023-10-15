import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
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
    console.log('\n\n');
    console.log('--------- FtStrategy.validate ---------');
    console.log({
      username,
      email,
      url,
    });
    console.log('\n');

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email,
        username,
        url,
      });
    }

    return user || null;
  }
}
