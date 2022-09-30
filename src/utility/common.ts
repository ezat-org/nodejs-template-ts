import pino from "pino";
import { clsProxify } from "cls-proxify";
import * as dotenv from "dotenv";
import * as path from "path";
import { Response } from "express";
import { HttpStatus } from "@nestjs/common";

export const initDotEnv = () => {
  dotenv.config({
    path: path.resolve(process.cwd(), "config/.env")
  });
  return true;
};

export const readEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not provided in .env file`);
  return value;
};

export const readEnvArray = (key: string): string[] => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not provided in .env file`);
  return value.split(",");
};

export const loggerPino = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: false,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss Z"
    }
  }
});

export const logger = clsProxify(loggerPino);
