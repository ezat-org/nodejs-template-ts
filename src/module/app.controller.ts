import { Controller, Get, HttpCode, Logger, Req } from "@nestjs/common";
import { Request } from "express";
import { AppService } from "../provider/service/app.service";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request): string {
    this.logger.log("Hello!");
    this.logger.log("Auth: %o", req.auth);
    return this.appService.getHello();
  }

  @Get("/health")
  @HttpCode(200)
  healthCheck(): string {
    return "Success";
  }
}
