import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "../provider/service/app.service";
import { CommonModule } from "./common/common.module";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [CommonModule, WalletModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
