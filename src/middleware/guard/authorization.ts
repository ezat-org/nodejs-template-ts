import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const operations = this.reflector.get<string[]>("operations", context.getHandler());
    this.logger.log(operations);

    // TODO: to be implemented by service (eg. check api, resource permissions, etc.)

    return true;
  }
}
