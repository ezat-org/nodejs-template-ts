import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TokenAuthenticationMiddleware } from "src/middleware/authentication.middleware";
import envStore from "src/model/env-store";
import { AppService } from "../provider/service/app.service";
import { AppController } from "./app.controller";
import { CommonModule } from "./common/common.module";
import { DevModule } from "./dev/dev.module";

@Module({
  imports: [CommonModule, DevModule.register(envStore)],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenAuthenticationMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL
    });
  }
}
