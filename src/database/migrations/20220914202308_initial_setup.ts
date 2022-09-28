import { Knex } from "knex";
import envStore from "../../model/env-store";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(
    `CREATE OR REPLACE FUNCTION ${envStore.dbSchema}.set_updated_at_func()
        RETURNS TRIGGER
        LANGUAGE plpgsql AS
        '
        BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
        END;
        ';
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.raw(`DROP FUNCTION ${envStore.dbSchema}.set_updated_at_func();`);
}
