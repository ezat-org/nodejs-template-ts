import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import Knex from "knex";
import { knexSnakeCaseMappers, Model } from "objection";
import knexConfig from "../knexfile";
import envStore from "./model/env-store"; // init dotenv
import { AppModule } from "./module/app.module";
import { requestIdGenerator, requestIdLogger, requestLogger } from "./middleware/logger.middleware";
import { logger } from "./utility/common";
import { AllExceptionsFilter } from "./utility/exception-filter";

async function bootstrap() {
  // init db connection
  const knex = Knex({ ...knexConfig, ...knexSnakeCaseMappers() });
  Model.knex(knex);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: { origin: envStore.corsOrigins },
    logger: false
  });

  app.use(cookieParser());
  app.use(helmet());

  // Request logger
  app.use(requestIdGenerator, requestIdLogger, requestLogger);

  // Global error handler
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(envStore.port).then((_) => logger.info(`Server started on ${envStore.port}`));
}

bootstrap();
