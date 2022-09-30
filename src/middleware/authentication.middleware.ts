import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
  UnauthorizedException
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as jwkToPem from "jwk-to-pem";
import envStore from "../model/env-store";
import ResponseBody from "../model/response-body";
import { HttpClient } from "../provider/common/http-client";

@Injectable()
export class TokenAuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenAuthenticationMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];
    if (!token) {
      throw new UnauthorizedException(
        new ResponseBody({
          statusCode: new UnauthorizedException().getStatus(),
          message: "missing authorization header",
          req
        })
      );
    }

    const httpClient = new HttpClient();
    const keys = await httpClient
      .get(envStore.awsCognitoAuthUrl)
      .then((res) => res.data.keys)
      .catch((error) => {
        throw new UnauthorizedException(
          new ResponseBody({
            statusCode: new UnauthorizedException().getStatus(),
            message: "failed to download JWKs",
            req,
            error
          })
        );
      });

    let pems = {};
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
      throw new UnauthorizedException(
        new ResponseBody({
          statusCode: new UnauthorizedException().getStatus(),
          message: "invalid token",
          req
        })
      );
    }

    const payload = decodedJwt.payload;
    if (!payload.sub) {
      throw new UnauthorizedException(
        new ResponseBody({
          statusCode: new UnauthorizedException().getStatus(),
          message: "sub not found",
          req
        })
      );
    }

    const kid = decodedJwt.header.kid;
    const pem = kid ? pems[kid] : undefined;
    if (!pem) {
      throw new UnauthorizedException(
        new ResponseBody({
          statusCode: new UnauthorizedException().getStatus(),
          message: "invalid token",
          req
        })
      );
    }
    const ignoreExpiration = envStore.isLocal() ? true : false;

    await jwt.verify(token, pem, { ignoreExpiration }, (error) => {
      if (!error) return;

      if (error.name && error.name === "TokenExpiredError") {
        throw new UnauthorizedException(
          new ResponseBody({
            statusCode: new UnauthorizedException().getStatus(),
            message: "token expired",
            req
          })
        );
      }

      if (error.name && error.name === "JsonWebTokenError") {
        throw new UnauthorizedException(
          new ResponseBody({
            statusCode: new UnauthorizedException().getStatus(),
            message: "invalid token",
            req
          })
        );
      }

      throw new InternalServerErrorException(
        new ResponseBody({
          statusCode: new UnauthorizedException().getStatus(),
          message: "invalid token",
          req,
          error
        })
      );
    });

    this.logger.log(
      `Request: ${req.method} ${req.originalUrl} User=${payload.sub} from Cognito token`
    );

    // TODO - call permission service

    next();
  }
}
