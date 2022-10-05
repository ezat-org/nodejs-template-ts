import { applyDecorators, SetMetadata } from "@nestjs/common";
import { CONTROLLER_META_OPERATIONS, CONTROLLER_META_PUBLIC_API } from "../constant";

/**
 * Decorator for controller handlers to indicate operations, which are used by the authorization guards to check against permission.
 * @param operations
 */
export const Permission = (...operations: string[]) => {
  return applyDecorators(SetMetadata(CONTROLLER_META_OPERATIONS, operations));
};

/**
 * Decorator for controller handlers to indicate an API is public, and does not require authentication/authorization
 */
export const PublicApi = () => {
  return applyDecorators(SetMetadata(CONTROLLER_META_PUBLIC_API, true));
};
