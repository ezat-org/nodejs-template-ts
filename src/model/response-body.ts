import { HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import envStore from "./env-store";

@Injectable()
export default class ResponseBody {
  readonly statusCode: HttpStatus;
  readonly message: String;
  readonly data?: Object;
  readonly error?: unknown;
  readonly requestId: String;

  constructor({
    statusCode,
    message,
    data,
    error,
    req
  }: {
    statusCode: HttpStatus;
    message: String;
    req: Request;
    data?: Object;
    error?: unknown;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = envStore.isProd() ? undefined : error;
    this.requestId = req.requestId;
  }
}
