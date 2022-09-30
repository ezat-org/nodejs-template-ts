import { Model } from "objection";

export class Wallet extends Model {
  id!: string;
  publicAccountId!: string;
  type!: Wallet.Type;
  publicKey!: string;
  encryptedPrivateKey!: string[];
  status!: Wallet.Status;

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return "wallet";
  }

  static get idColumn() {
    return "id";
  }
}

// Define model specific data type
export namespace Wallet {
  export enum Type {
    EVM = "EVM"
  }

  export enum Status {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED"
  }
}
