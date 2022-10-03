import { Logger as NestjsLogger } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import Knex from "knex";
import { Logger } from "nestjs-pino";
import { knexSnakeCaseMappers, Model } from "objection";
import knexConfig from "../knexfile";
import { AuthenticationGuard } from "./middleware/guard/authentication";
import envStore from "./model/env-store"; // init dotenv
import { AppModule } from "./module/app.module";
import { HttpClient } from "./provider/common/http-client";

async function bootstrap() {
  // init db connection
  const knex = Knex({ ...knexConfig, ...knexSnakeCaseMappers() });
  Model.knex(knex);

  // init app
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: { origin: envStore.corsOrigins }
  });

  // user pino instead of Nestjs default logger
  app.useLogger(app.get(Logger));
  const logger = new NestjsLogger("Main");

  app.use(cookieParser());
  app.use(helmet());

  // Global error handler
  // const httpAdapter = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // app.useGlobalGuards(new TokenAuthGuard(new Reflector()));
  app.useGlobalGuards(new AuthenticationGuard(envStore, new HttpClient(), new Reflector()));

  await app.listen(envStore.port);
  logger.log(`Server started on port ${envStore.port}`);
}

bootstrap();
