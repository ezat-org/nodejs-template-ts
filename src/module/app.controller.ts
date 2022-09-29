import { Controller, Get, HttpCode } from "@nestjs/common";
import { logger } from "../utility/common";
import { AppService } from "../provider/service/app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    logger.info("Hello!");
    return this.appService.getHello();
  }

  @Get("/health")
  @HttpCode(200)
  healthCheck(): string {
    return "Success";
  }
}
