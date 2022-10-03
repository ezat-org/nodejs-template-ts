import { Controller, Get, Logger, Req } from "@nestjs/common";
import { Request } from "express";
import { PublicApi } from "src/model/decorator/auth.decorator";

@Controller("/dev")
export class DevController {
  private readonly logger = new Logger(DevController.name);

  @Get()
  @PublicApi()
  echo(@Req() req: Request): string | Promise<string> {
    this.logger.log("Request body: %o", req.body);
    return "Success";
  }
}
