import { Model } from 'objection';
import { Asset } from './asset.model';
import { User } from './user.model';

/**
 * Model for asset_forwarding table
 */
export class AssetForwarding extends Model {
  id!: string;
  userId!: string;
  status!: AssetForwarding.Status;
  depositAssetCode!: string;
  depositAddress!: string;
  forwardAddress!: string;
  forwardAssetCode!: string;
  provider!: AssetForwarding.Provider;
  referenceId?: string;
  expireAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;

  // joined tables
  user!: User;
  depositAsset!: Asset;
  forwardAsset!: Asset;

  static get tableName() {
    return 'assetForwarding';
  }

  static get idColumn() {
    return 'id';
  }

  // Defines relations with other models
  static get relationMappings() {
    // Importing models here is one way to avoid require loops.
    return {
      user: {
        modelClass: User,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'assetForwarding.userId',
          to: 'user.id',
        },
      },
      depositAsset: {
        modelClass: Asset,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'assetForwarding.depositAssetCode',
          to: 'asset.code',
        },
      },
      forwardAsset: {
        modelClass: Asset,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'assetForwarding.forwardAssetCode',
          to: 'asset.code',
        },
      },
    };
  }
}

// Define model specific data type
export namespace AssetForwarding {
  export enum Status {
    VALID = 'VALID',
    EXPIRED = 'EXPIRED',
  }

  export enum Provider {
    CRYPTO_API = 'CRYPTO_API',
  }
}
