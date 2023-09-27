import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO: use env variable (nestjs config module) to make port configurable
  await app.listen(3000);
}
bootstrap();
