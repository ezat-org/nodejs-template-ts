import {
  HttpCode,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import envStore from "../model/env-store";
import { HttpClient } from "../provider/common/http-client";
import { logger } from "../utility/common";
import ResponseBody from "../model/response-body";

@Injectable()
export class TokenAuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // try {

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
    const response = await httpClient.get(envStore.awsCognitoAuthUrl).catch((error) => {
      logger.error(error);
      throw new UnauthorizedException({
        message: "failed to download JWKs",
        error
      });
    });

    next();

    // let pems = {};
    // const keys = responses.data.keys;
    // for (let i = 0; i < keys.length; i++) {
    //   //Convert each key to PEM
    //   const key_id = keys[i].kid;
    //   const modulus = keys[i].n;
    //   const exponent = keys[i].e;
    //   const key_type = keys[i].kty;
    //   const jwk = { kty: key_type, n: modulus, e: exponent };
    //   const pem = jwkToPem(jwk);
    //   pems[key_id] = pem;
    // }
    // //validate the token
    // const decodedJwt = jwt.decode(token, { complete: true });
    // if (!decodedJwt) {
    //   return response(res, 401, "Invalid token");
    // }
    // const aud = decodedJwt.payload.aud;
    // const kid = decodedJwt.header.kid;
    // const pem = pems[kid];
    // if (!pem) {
    //   return response(res, 401, "Invalid token");
    // }
    // if (!aud || aud !== process.env.PERMITTED_APP_ID) {
    //   return response(res, 401, "Unknown App");
    // }
    // const ignoreExpiration = isLocalDev() ? true : false;
    // const payload = await jwt.verify(token, pem, { ignoreExpiration });
    // if (!payload.sub) {
    //   return response(res, 401, "payload.sub not found");
    // }

    // req = setReqFrom({
    //   req,
    //   res,
    //   from: payload.email,
    //   email: payload.email,
    //   firstName: payload.given_name,
    //   lastName: payload.family_name
    // });

    // logger.info(`Request: ${req.method} ${req.originalUrl} User=${req.email} from Cognito token`);
    //   return next();
    // } catch (err) {
    //   if (err.name && err.name === "TokenExpiredError") {
    //     throw new UnauthorizedException({
    //       status: HttpStatus.UNAUTHORIZED,
    //       message: "token expired"
    //     });
    //   }

    //   if (err.name && err.name === "JsonWebTokenError") {
    //     throw new UnauthorizedException({
    //       status: HttpStatus.UNAUTHORIZED,
    //       message: "invalid token"
    //     });
    //   }

    // logger.error(err);
    // return response(res, 500, "Internal Error", null, err);
    // }
    // next();
  }
}
