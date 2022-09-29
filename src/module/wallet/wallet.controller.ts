import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { logger } from "../../utility/common";

@Controller("/wallet")
export class WalletController {
  @Get("/")
  echo(@Req() req: Request): Object {
    logger.info("Request body: %o", req.body);
    return { a: 123 };
  }
}
