import * as dotenv from "dotenv";
import * as path from "path";

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
