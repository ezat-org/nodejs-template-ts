import { NestFactory } from '@nestjs/core';
import Knex from 'knex';
import { Logger } from 'nestjs-pino';
import { knexSnakeCaseMappers, Model } from 'objection';
import knexConfig from '../knexfile';
import { AppModule } from './modules/app.module';
import { EnvStore } from './model/env-store';

// console.log(knexConfig);

async function bootstrap() {
  // init dotenv
  const envStore = new EnvStore();

  // init db connection
  const knex = Knex({ ...knexConfig, ...knexSnakeCaseMappers() });
  Model.knex(knex);

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // use pino logger instead of default logger in NestJs
  app.useLogger(app.get(Logger));

  await app.listen(envStore.port);
}

bootstrap();
