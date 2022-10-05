import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import envStore from "src/model/env-store";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const ctxResponse = ctx.getResponse();

    let body;
    let statusCode;

    if (exception instanceof HttpException) {
      body = exception.getResponse();
      statusCode = exception.getStatus();
    } else {
      body = { message: "Internal server error" };
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      ctxResponse.err = exception;
    }

    // Add more info to error in dev environment for debugging
    if (envStore.isDev()) {
      body.error =
        exception instanceof Error
          ? { name: exception.name, message: exception.message, stack: exception.stack }
          : "Unknown error";
    }

    return httpAdapter.reply(ctxResponse, body, statusCode);
  }
}
