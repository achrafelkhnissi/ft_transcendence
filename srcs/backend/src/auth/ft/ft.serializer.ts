import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FtSerializer extends PassportSerializer {
  private readonly logger = new Logger(FtSerializer.name);

  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: CallableFunction) {
    try {
      const user = await this.usersService.findById(userId);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
}
