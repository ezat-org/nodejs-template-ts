import { Controller, Get, Logger, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("/dev")
export class DevController {
  private readonly logger = new Logger(DevController.name);

  @Get()
  echo(@Req() req: Request): string {
    this.logger.log("Request body: %o", req.body);
    return "Success";
  }
}
