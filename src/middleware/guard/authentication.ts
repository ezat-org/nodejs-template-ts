import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import * as jwkToPem from "jwk-to-pem";
import {
  CONTROLLER_META_PUBLIC_API,
  HTTP_HEADER_API_KEY,
  HTTP_HEADER_AUTH_TOKEN
} from "src/model/constant";
import { EnvStore } from "src/model/env-store";
import { HttpClient } from "src/provider/common/http-client";

/**
 * Authenticate incoming requests by either cognito jwt token, or api key
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticationGuard.name);

  constructor(
    private readonly envStore: EnvStore,
    private readonly httpClient: HttpClient,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // bypass authentication for public api
    const isPublicApi = this.reflector.get<boolean>(
      CONTROLLER_META_PUBLIC_API,
      context.getHandler()
    );
    if (isPublicApi) {
      return true;
    }

    const httpCtx = context.switchToHttp();
    const req: Request = httpCtx.getRequest();
    const token = req.headers[HTTP_HEADER_AUTH_TOKEN];
    const apiKeys = req.headers[HTTP_HEADER_API_KEY];

    // authenticate with token
    if (token) {
      return await this.tokenAuth(req, token);
    }

    // authenticate with api key
    if (apiKeys) {
      const apiKey = [...apiKeys][0]; // only consider the first key valid
      return await this.apiKeyAuth(req, apiKey);
    }

    throw new UnauthorizedException("Missing authorization header");
  }

  /**
   * Authenticate request using jwt token
   */
  private async tokenAuth(req: Request, token: string) {
    // TODO: cognito public key should be cached, to defend against DDOS requests with invalid token
    const keys = await this.httpClient
      .get(this.envStore.awsCognitoAuthUrl)
      .then((res) => res.data.keys)
      .catch((error) => {
        throw new UnauthorizedException("Failed to download JWKs");
      });

    const pems = {};
    for (let i = 0; i < keys.length; i++) {
      //Convert each key to PEM
      const key_id = keys[i].kid;
      const modulus = keys[i].n;
      const exponent = keys[i].e;
      const key_type = keys[i].kty;
      const jwk = { kty: key_type, n: modulus, e: exponent };
      const pem = jwkToPem(jwk);
      pems[key_id] = pem;
    }

    //validate the token
    const decodedJwt = jwt.decode(token, { complete: true });
    if (!decodedJwt) {
      throw new UnauthorizedException("Invalid token");
    }

    const payload = decodedJwt.payload;
    if (!payload.sub) {
      throw new UnauthorizedException("Token sub not found");
    }

    const kid = decodedJwt.header.kid;
    const pem = kid ? pems[kid] : undefined;
    if (!pem) {
      throw new UnauthorizedException("Invalid token");
    }

    const ignoreExpiration = this.envStore.isLocal() ? true : false;

    await jwt.verify(token, pem, { ignoreExpiration }, (error) => {
      if (!error) return;

      if (error.name && error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token expired");
      }

      if (error.name && error.name === "JsonWebTokenError") {
        throw new UnauthorizedException("Invalid token");
      }

      throw new UnauthorizedException("Invalid token");
    });

    this.logger.log(
      `Request: ${req.method} ${req.originalUrl} User=${payload.sub} from Cognito token`
    );

    // TODO: set req params for downstream (eg. authorization, controller) consumption

    return true;
  }

  /**
   * Authenticate request using api key
   * @param req
   */
  private async apiKeyAuth(req: Request, apiKey: string) {
    // TODO: set req params for downstream (eg. authorization, controller) consumption
    return true;
  }
}
