import * as dotenv from "dotenv";
import * as path from "path";

export const initDotEnv = () => {
  dotenv.config({
    path: path.resolve(process.cwd(), "config/.env")
  });
  return true;
};
