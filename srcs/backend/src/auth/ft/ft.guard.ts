import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext) {
    console.log('\n\n');
    console.log('--------- FtAuthGuard.canActivate ---------');
    try {
      const request = context.switchToHttp().getRequest();
      const result = (await super.canActivate(context)) as boolean;
      console.log({
        result,
      });
      await super.logIn(request);
      return result;
    } catch (e) {
      // TODO: test this case
      console.log({
        error: e,
      });
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
        {
          cause: e,
        },
      );
    }
  }
}
