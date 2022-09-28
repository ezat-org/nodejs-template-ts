import { Module } from "@nestjs/common";
import { DevController } from "./dev.controller";

@Module({
  controllers: [DevController],
  providers: [],
  exports: []
})
export class DevModule {}
