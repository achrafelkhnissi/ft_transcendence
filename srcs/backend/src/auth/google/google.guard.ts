import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleAuthGuard.name);

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const result = (await super.canActivate(context)) as boolean;
      await super.logIn(request);
      return result;
    } catch (e) {
      console.log({ e });
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
        {
          cause: e,
        },
      );
    }
  }
}
