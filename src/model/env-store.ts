import { Injectable } from "@nestjs/common";
import { initDotEnv } from "../utility/common";

const readEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not provided in .env file`);
  return value;
};

const readEnvArray = (key: string): string[] => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not provided in .env file`);
  return value.split(",");
};

@Injectable()
export class EnvStore {
  // initialize dotenv
  private readonly init = initDotEnv();

  // service
  readonly env: string = readEnv("ENV");
  readonly port: string = readEnv("PORT");
  readonly corsOrigins: string[] = readEnvArray("CORS_ORIGINS");

  // database
  readonly dbHost: string = readEnv("DATABASE_HOST");
  readonly dbPort: string = readEnv("DATABASE_PORT");
  readonly dbName: string = readEnv("DATABASE_NAME");
  readonly dbUser: string = readEnv("DATABASE_USER");
  readonly dbPassword: string = readEnv("DATABASE_PASSWORD");
  readonly dbSchema: string = readEnv("DATABASE_SCHEMA");

  // aws
  readonly awsCognitoAuthUrl: string = readEnv("AWS_COGNITO_AUTH_URL");

  isProd() {
    return this.env?.toLowerCase() === "prod";
  }

  isDev() {
    return (
      this.env?.toLowerCase() === "local" ||
      this.env?.toLowerCase() === "dev" ||
      this.env?.toLowerCase() === "uat"
    );
  }

  isLocal() {
    return this.env?.toLowerCase() === "local";
  }
}

export default new EnvStore();
