import { Knex } from "knex";
import * as queryBuilders from "../query-builder";
import envStore from "../../model/env-store";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .withSchema(envStore.dbSchema)
    .createTable("wallet", function (table) {
      table.uuid("id").primary().defaultTo(queryBuilders.uuid(knex));
      table.uuid("public_account_id").notNullable();
      table.string("type").notNullable();
      table.string("public_key").notNullable();
      table.specificType("encrypted_private_key", "text[]").notNullable();
      table.string("status").notNullable();

      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    })
    .raw(queryBuilders.createUpdatedAtFunctionTrigger("wallet", envStore.dbSchema));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema(envStore.dbSchema).then(async () => {
    await queryBuilders.dropTableIfExistsAndEmpty(knex, "wallet", envStore.dbSchema);
  });
}
