import { PrismaClient } from '@prisma/client';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { INestApplicationContext, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server, ServerOptions } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';

class SessionAdapter extends IoAdapter {
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
declare module 'http' {
  export interface IncomingMessage {
    user?: any; // Replace `any` with the actual type of `user` if known
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE'], // we only need these two methods for our project TODO: To be tested
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const sessionMiddleware = session({
    secret: process.env.NEST_SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, // 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  });

  app.use(sessionMiddleware);

  // https://stackoverflow.com/questions/51045980/how-to-serve-assets-from-nest-js-and-add-middleware-to-detect-image-request
  app.useStaticAssets(join(__dirname, '/uploads'));

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('api');

  app.useWebSocketAdapter(new SessionAdapter(sessionMiddleware, app));

  await app.listen(process.env.NEST_PORT || 3000);
}
bootstrap();
