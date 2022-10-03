import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class TokenAuthGuard implements CanActivate {
  private readonly logger = new Logger(TokenAuthGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // this.logger.log(this.reflector);
    // console.log(this.reflector);

    // const handler = context.getHandler().name;
    // console.log(handler);
    // this.logger.log(handler);

    const service = this.reflector.get<string>("service", context.getHandler());
    this.logger.log(service);
    // const operations = this.reflector.get<string[]>("operations", context.getHandler());
    // this.logger.log(operations);

    // const test = this.reflector.get<string>("testKey", context.getHandler());
    // this.logger.log(test);
    // const test1 = this.reflector.get<string>("test", context.getHandler());
    // this.logger.log(test1);

    // const httpCtx = context.switchToHttp();
    // const req = httpCtx.getRequest();
    // const res = httpCtx.getResponse();

    // this.logger.log("TokenAuthGuard, req: %o, res: %o", req.headers, res);
    throw new UnauthorizedException("Missing authorization header");
  }
}
