import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
  private readonly logger = new Logger(FtAuthGuard.name);

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const result = (await super.canActivate(context)) as boolean;
      await super.logIn(request);
      return result;
    } catch (e) {
      this.logger.error(`Error authenticating user: ${e.message}`);
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
        {
          cause: e,
        },
      );
    }
  }
}
