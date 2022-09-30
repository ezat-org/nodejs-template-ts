import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import ResponseBody from "../model/response-body";
import { logger } from "./common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    if (exception instanceof HttpException && exception.getResponse() instanceof ResponseBody) {
      return httpAdapter.reply(ctx.getResponse(), exception.getResponse(), exception.getStatus());
    }

    logger.error(exception);
    return httpAdapter.reply(
      ctx.getResponse(),
      new ResponseBody({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "internal server error",
        req: ctx.getRequest(),
        error:
          exception instanceof Error
            ? { name: exception.name, message: exception.message, stack: exception.stack }
            : "unknown error"
      }),
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
