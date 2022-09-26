import { Model } from 'objection';

/**
 * Model for user table
 */
export class User extends Model {
  id!: string;
  email!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'user';
  }

  static get idColumn() {
    return 'id';
  }
}
