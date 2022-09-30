import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "../provider/service/app.service";
import { CommonModule } from "./common/common.module";
import { WalletModule } from "./wallet/wallet.module";
import { TokenAuthenticationMiddleware } from "../middleware/authentication.middleware";

@Module({
  imports: [CommonModule, WalletModule],
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
