import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";

@Module({
  controllers: [WalletController],
  providers: [],
  exports: []
})
export class WalletModule {}
