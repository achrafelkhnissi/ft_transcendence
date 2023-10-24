import { PrismaClient } from '@prisma/client';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:1337",
    credentials: true
  })

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.NEST_SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000, // 2 minutes
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('api');

  await app.listen(process.env.NEST_PORT || 3000);
}
bootstrap();
