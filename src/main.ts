import { Logger as NestjsLogger } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import Knex from "knex";
import { Logger } from "nestjs-pino";
import { knexSnakeCaseMappers, Model } from "objection";
import knexConfig from "../knexfile";
import envStore from "./model/env-store"; // init dotenv
import { AppModule } from "./module/app.module";
import { AllExceptionsFilter } from "./utility/exception-filter";

async function bootstrap() {
  // init db connection
  const knex = Knex({ ...knexConfig, ...knexSnakeCaseMappers() });
  Model.knex(knex);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: { origin: envStore.corsOrigins }
  });
  app.useLogger(app.get(Logger));
  const logger = new NestjsLogger("Main");

  app.use(cookieParser());
  app.use(helmet());
  // Global error handler
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(envStore.port);
  logger.log(`Server started on ${envStore.port}`);
}

bootstrap();
