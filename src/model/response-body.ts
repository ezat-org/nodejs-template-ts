import { HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import envStore from "./env-store";

@Injectable()
export default class ResponseBody {
  readonly statusCode: HttpStatus;
  readonly message: string;
  readonly data?: object;
  readonly error?: unknown;
  readonly requestId: string;

  constructor({
    statusCode,
    message,
    data,
    error,
    req
  }: {
    statusCode: HttpStatus;
    message: string;
    req: Request;
    data?: object;
    error?: unknown;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = envStore.isProd() ? undefined : error;
    this.requestId = req.requestId;
  }
}
