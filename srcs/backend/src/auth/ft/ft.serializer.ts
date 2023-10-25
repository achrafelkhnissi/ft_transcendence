import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FtSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: CallableFunction) {
    console.log('\n\n');
    console.log('--------- FtSerializer.serializeUser ---------');
    console.log({
      user: user.username,
    });
    console.log('\n');

    done(null, user.id);
  }

  async deserializeUser(userId: number, done: CallableFunction) {
    console.log('\n\n');
    console.log('--------- FtSerializer.deserializeUser ---------');

    const user = await this.usersService.findById(userId);
    console.log({
      user: user.username,
    });
    console.log('\n');
    done(null, user);
  }
}
