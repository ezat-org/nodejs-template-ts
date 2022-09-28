import { Model } from "objection";

/**
 * Model for asset table
 */
export class Asset extends Model {
  code!: string;
  name!: string;
  type!: Asset.Type;
  address?: string;
  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return "asset";
  }

  static get idColumn() {
    return "code";
  }

  isCrypto() {
    return this.type === Asset.Type.CRYPTO_COIN || this.type === Asset.Type.CRYPTO_TOKEN;
  }
}

// Define model specific data type
export namespace Asset {
  export enum Type {
    CRYPTO_COIN = "CRYPTO_COIN",
    CRYPTO_TOKEN = "CRYPTO_TOKEN"
  }
}
