import { SetMetadata } from "@nestjs/common";

export const ServiceOps = (service: string, ...operations: string[]) => {
  SetMetadata("service", service);
  SetMetadata("operations", operations);
};
