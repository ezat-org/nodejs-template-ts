import { Knex } from 'knex';

export const createUpdatedAtFunctionTrigger = (tableName) =>
  `CREATE TRIGGER ${tableName}_updated_at
    BEFORE UPDATE ON "${tableName}"
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at_func();`;

export const createTrimAndUpperConstraint = (tableName, columnName) =>
  `ALTER TABLE "${tableName}" ADD CONSTRAINT ${tableName}_${columnName}_trim_and_upper
    CHECK (TRIM(UPPER(${columnName})) = ${columnName});`;

export const createTrimAndLowerConstraint = (tableName, columnName) =>
  `ALTER TABLE "${tableName}" ADD CONSTRAINT ${tableName}_${columnName}_trim_and_lower
    CHECK (TRIM(LOWER(${columnName})) = ${columnName});`;

export const createNonNegativeNumberConstraint = (tableName, columnName) =>
  `ALTER TABLE "${tableName}" ADD CONSTRAINT ${tableName}_${columnName}_non_negative_number
    CHECK (${columnName} >= 0);`;

export const createPositiveNumberConstraint = (tableName, columnName) =>
  `ALTER TABLE "${tableName}" ADD CONSTRAINT ${tableName}_${columnName}_positive_number
    CHECK (${columnName} > 0);`;

export const dropEnum = (name) => `DROP TYPE ${name} IF EXISTS;`;

export const dropTableIfExistsAndEmpty = async (
  knex: Knex,
  tableName: string,
  force = false,
) => {
  const tableExists = await knex.schema.hasTable(tableName);
  if (!tableExists) return;
  if (!force) {
    const count = (await knex(tableName).count('*'))[0].count;
    if (count > 0) throw new Error(`Dropping non empty table - ${tableName}`);
  }
  return await knex.schema.dropTableIfExists(tableName);
};

export const dropConstraintIfExist = (tableName, constraint) =>
  `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraint};`;

export const uuid = (knex: Knex) => {
  return knex.raw('uuid_generate_v4()');
};
