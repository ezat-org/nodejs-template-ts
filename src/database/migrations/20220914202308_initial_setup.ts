import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(
    `CREATE OR REPLACE FUNCTION public.set_updated_at_func()
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
  return knex.schema.raw(`DROP FUNCTION public.set_updated_at_func();`);
}
