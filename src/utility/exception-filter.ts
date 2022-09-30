import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import ResponseBody from "../model/response-body";

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

    if (exception instanceof HttpException && exception.getResponse() instanceof ResponseBody) {
      return httpAdapter.reply(ctxResponse, exception.getResponse(), exception.getStatus());
    }
    this.logger.error(exception);
    ctxResponse.err = exception;
    return httpAdapter.reply(
      ctxResponse,
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
