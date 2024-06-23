import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.createSchema("starklens").ifNotExists().execute();

  await db.schema
    .createTable("starklens.swap_intents")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("creator", "text", (col) => col.notNull())
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("created_at", "bigint", (col) => col.notNull())
    .addColumn("updated_at", "bigint", (col) => col.notNull())
    .addColumn("from_address", "text", (col) => col.notNull())
    .addColumn("from_ticker", "text", (col) => col.notNull())
    .addColumn("from_amount", "text", (col) => col.notNull())
    .addColumn("to_address", "text", (col) => col.notNull())
    .addColumn("to_ticker", "text", (col) => col.notNull())
    .addColumn("to_amount", "text", (col) => col.notNull())
    .addColumn("rate", "numeric", (col) => col.notNull())
    .addColumn("gated_account", "text")
    .addColumn("gated_in_collection", "text")
    .addColumn("gated_min_balance_address", "text")
    .addColumn("gated_min_balance_amount", "text")
    .addColumn("gated_token_id_address", "text")
    .addColumn("gated_token_id", "text")
    .addColumn("notes", "text")
    .execute();

  await db.schema
    .createTable("starklens.processed_events")
    .addColumn("event_id", "text", (col) => col.primaryKey())
    .addColumn("swap_intent_id", "text", (col) =>
      col.notNull().references("starklens.swap_intents.id").onDelete("cascade")
    )
    .addColumn("event_type", "text", (col) => col.notNull())
    .addColumn("processed_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("starklens.processed_events").execute();
  await db.schema.dropTable("starklens.swap_intents").execute();

  // Optionally, drop the schema if it's empty
  // await db.schema.dropSchema("starklens").ifExists().execute();
}
