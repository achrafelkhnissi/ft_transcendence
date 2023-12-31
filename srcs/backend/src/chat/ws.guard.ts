import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const request = client.request;

    console.log({
      request: request,
      session: request.session,
      isAuthenticated: request.isAuthenticated(),
      user: request.user,
    });

    return request.isAuthenticated();
  }
}
