import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { Server, ServerOptions } from 'socket.io';
import * as express from 'express';
import * as passport from 'passport';

declare module 'http' {
  export interface IncomingMessage {
    user?: any; // TODO: Replace `any` with the actual type of `user` if known
  }
}

export class SessionAdapter extends IoAdapter {
  private session: express.RequestHandler;

  constructor(session: express.RequestHandler, app: INestApplicationContext) {
    super(app);
    this.session = session;
  }

  create(port: number, options?: ServerOptions): Server {
    const server: Server = super.create(port, options);

    const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);

    server.use((socket, next) => {
      socket.data.username = 'test'; //passing random property to see if use method is working
      socket.data.user = socket.request.user;
      socket.data.session = this.session;
      next();
    });

    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
    return server;
  }
}
