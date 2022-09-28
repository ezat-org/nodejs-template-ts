import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import Knex from "knex";
import { Logger } from "nestjs-pino";
import { knexSnakeCaseMappers, Model } from "objection";
import knexConfig from "../knexfile";
import envStore from "./model/env-store"; // init dotenv
import { AppModule } from "./module/app.module";

async function bootstrap() {
  // init db connection
  const knex = Knex({ ...knexConfig, ...knexSnakeCaseMappers() });
  Model.knex(knex);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: { origin: envStore.corsOrigins }
  });
  // use pino logger instead of default logger
  app.useLogger(app.get(Logger));

  app.use(cookieParser());
  app.use(helmet());

  await app.listen(envStore.port);
}

bootstrap();
