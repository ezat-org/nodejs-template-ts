import { DynamicModule, Module } from "@nestjs/common";
import { EnvStore } from "src/model/env-store";
import { DevController } from "./dev.controller";

/**
 * APIs to facilitate development and testing, only available in dev environments
 */
@Module({})
export class DevModule {
  static register(envStore: EnvStore): DynamicModule {
    if (envStore.isDev()) {
      return {
        module: DevModule,
        controllers: [DevController]
      };
    } else {
      return {
        module: DevModule
      };
    }
  }
}
