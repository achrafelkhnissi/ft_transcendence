import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { MachineToMachineInstance } from 'twilio/lib/rest/api/v2010/account/availablePhoneNumber/machineToMachine';

@Injectable()
export class FtSerializer extends PassportSerializer {
  private readonly logger = new Logger(FtSerializer.name);

  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: CallableFunction) {
    this.logger.debug(`serializing user ${user.username}`);
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: CallableFunction) {
    const user = await this.usersService.findById(userId);
    this.logger.debug(`deserializing user ${user.username}`);
    done(null, user);
  }
}
