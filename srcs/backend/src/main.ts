import { PrismaClient } from '@prisma/client';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SessionAdapter } from './common/adapters/socket-session.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure Cross-Origin Resource Sharing (CORS)
  app.enableCors({
    origin: process.env.FRONTEND,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Configure global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown properties
      transform: true, // transform payloads to be objects typed according to their DTO classes
      enableDebugMessages: true, // enable debug messages. TODO: remove in production
    }),
  );

  // Configure global middlewares
  app.use(express.json()); // parse application/json
  app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded (extended: true allows parsing of nested objects)
  app.use(cookieParser());

  const sessionMiddleware = session({
    name: 'pong-time.sid', // Session ID cookie name
    secret: process.env.NEST_SESSION_SECRET || 'secret', // Used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Only save session if a property has been added to req.session
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, // Check for expired sessions every 2 minutes to clean up
      dbRecordIdIsSessionId: false, // Don't use the database record ID as the session ID
      dbRecordIdFunction: () => `pong-time.sid.${Date.now()}`,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: true, // Prevents client side JS from reading the cookie
      secure: false, // Sent over HTTP and HTTPS
    },
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
