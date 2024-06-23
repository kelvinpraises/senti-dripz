import { createKysely } from "@vercel/postgres-kysely";
import "dotenv/config";

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<
  string,
  bigint | number | string,
  bigint | number | string
>;

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface StarklensProcessedEvents {
  event_id: string;
  event_type: string;
  processed_at: Generated<Timestamp>;
  swap_intent_id: string;
}

export interface StarklensSwapIntents {
  created_at: Int8;
  creator: string;
  from_address: string;
  from_amount: string;
  from_ticker: string;
  gated_account: string | null;
  gated_in_collection: string | null;
  gated_min_balance_address: string | null;
  gated_min_balance_amount: string | null;
  gated_token_id: string | null;
  gated_token_id_address: string | null;
  id: string;
  notes: string | null;
  rate: Numeric;
  status: string;
  to_address: string;
  to_amount: string;
  to_ticker: string;
  updated_at: Int8;
}

export interface DB {
  "starklens.processed_events": StarklensProcessedEvents;
  "starklens.swap_intents": StarklensSwapIntents;
}

export const db = createKysely<DB>();
export { sql } from "kysely";
