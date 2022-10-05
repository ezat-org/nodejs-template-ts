import { Module } from "@nestjs/common";
import { Request } from "express";
import { LoggerModule } from "nestjs-pino";
import { randomUUID } from "node:crypto";
import { EnvStore } from "../../model/env-store";

const generateRequestId = (req: Request) => {
  const reqId = req.get("X-Request-Id") || randomUUID();
  req.requestId = reqId;
  return reqId;
};

const loggerModule = LoggerModule.forRoot({
  // For more options: https://github.com/pinojs/pino-http#pinohttpopts-stream
  pinoHttp: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss Z",
        messageFormat: "[{context}] {msg}",
        ignore: "context"
      }
    },
    redact: ['headers["x-api-key"]'],
    quietReqLogger: true,
    genReqId: generateRequestId,
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        requestId: req.raw.requestId,
        ip: req.raw.headers["x-forwarded-for"] || req.raw.connection.remoteAddress,
        body: req.raw.body,
        auth: req.raw.auth
      }),
      res: (res) => ({
        statusCode: res.statusCode
      }),
      err: (err) => ({ ...err })
    }
  }
});

// @Global()
@Module({
  imports: [loggerModule],
  controllers: [],
  providers: [EnvStore],
  exports: [EnvStore]
})
export class CommonModule {}
