import { applyDecorators, SetMetadata } from "@nestjs/common";
import {
  CONTROLLER_META_OPERATIONS,
  CONTROLLER_META_PUBLIC_API,
  CONTROLLER_META_SERVICE
} from "../constant";

/**
 * Decorator for controller handlers to indicate service and operations, which are used by the authorization guards to check against permission.
 * @param service
 * @param operations
 */
export const Permission = (service: string, ...operations: string[]) => {
  return applyDecorators(
    SetMetadata(CONTROLLER_META_SERVICE, service),
    SetMetadata(CONTROLLER_META_OPERATIONS, operations)
  );
};

/**
 * Decorator for controller handlers to indicate an API is public, and does not require authentication/authorization
 */
export const PublicApi = () => {
  return applyDecorators(SetMetadata(CONTROLLER_META_PUBLIC_API, true));
};
