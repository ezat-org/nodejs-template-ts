import { logger, loggerPino } from "../utility/common";
import ExpressPinoLogger from "express-pino-logger";
import { v4 as uuidv4 } from "uuid";
import { clsProxifyExpressMiddleware } from "cls-proxify/integration/express";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to generate an UUID request Id if not passed in by caller
 */
export const requestIdGenerator = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.get("x-requested-id") || uuidv4();
  req.requestId = requestId;
  next();
};

/**
 * Middleware to create a child logger with requestId for each request
 */
export const requestIdLogger = clsProxifyExpressMiddleware((req: Request) => {
  const requestId = req.requestId;
  return loggerPino.child({ requestId });
});

/**
 * Middleware to format request log
 */
export const requestLogger = ExpressPinoLogger({
  logger: logger,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      requestId: req.raw.requestId,
      ip: req.raw.headers["x-forwarded-for"] || req.raw.connection.remoteAddress,
      body: req.raw.body
    }),
    res: (res) => ({
      statusCode: res.statusCode
    }),
    err: (err) => ({ ...err })
  }
});
