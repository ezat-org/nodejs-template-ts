import { Module } from "@nestjs/common";
import { EnvStore } from "../../model/env-store";

// @Global()
@Module({
  imports: [],
  controllers: [],
  providers: [EnvStore],
  exports: [EnvStore]
})
export class CommonModule {}
