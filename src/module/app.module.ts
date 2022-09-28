import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "../provider/service/app.service";
import { CommonModule } from "./common/common.module";
import { DevModule } from "./dev/dev.module";

@Module({
  imports: [CommonModule, DevModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
