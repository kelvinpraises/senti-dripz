import { NextRequest, NextResponse } from "next/server";
import { getInstanceDetails, getERC20Details } from "@/utils/contract";
import { db } from "@/db";

interface Event {
  eventId: string;
  blockNumber: number;
  transactionHash: string;
  name: string;
  timestamp: number;
  fromAddress: string;
  keys: string[];
  keyDecoded: { name: string; value: string; type: string }[];
  data: any[];
  dataDecoded: any[];
}

interface SwapIntentsTable {
  id: string;
  creator: string;
  status: string;
  created_at: number;
  updated_at: number;
  from_address: string;
  from_ticker: string;
  from_amount: string;
  to_address: string;
  to_ticker: string;
  to_amount: string;
  rate: number;
  gated_account: string | null;
  gated_in_collection: string | null;
  gated_min_balance_address: string | null;
  gated_min_balance_amount: string | null;
  gated_token_id_address: string | null;
  gated_token_id: string | null;
  notes: string | null;
}

interface ProcessedEventsTable {
  event_id: string;
  swap_intent_id: string;
  event_type: string;
  processed_at: string;
}

async function swapIntentExists(id: string): Promise<boolean> {
  const result = await db
    .selectFrom("starklens.swap_intents")
    .select("id")
    .where("id", "=", id)
    .executeTakeFirst();
  return !!result;
}

export async function POST(request: NextRequest) {
  try {
    const { items: events }: { items: Event[] } = await request.json();

    for (const event of events) {
      console.log(`Processing event: ${event.eventId}`);

      // Check if we've already processed this event
      const existingEvent = await db
        .selectFrom("starklens.processed_events")
        .where("event_id", "=", event.eventId)
        .executeTakeFirst();

      if (existingEvent) {
        console.log(`Event ${event.eventId} already processed. Skipping.`);
        continue;
      }

      let id = event.keyDecoded.find(
        (key: { name: string }) => key.name === "id"
      )?.value;
      id = Number(id).toString();

      if (!id) {
        console.error(
          `Invalid event data: missing id for event ${event.eventId}`
        );
        continue;
      }

      if (event.name === "Begun") {
        console.log(`Processing 'Begun' event for swap intent ${id}`);
        try {
          // Fetch additional details from the contract
          const instanceDetails = await getInstanceDetails(
            event.fromAddress,
            parseInt(id, 16)
          );

          console.log(instanceDetails);

          // Fetch ERC20 details
          const [fromTokenDetails, toTokenDetails] = await Promise.all([
            getERC20Details(instanceDetails.initiator_erc20),
            getERC20Details(instanceDetails.counter_party_erc20),
          ]);

          const swapIntent: SwapIntentsTable = {
            id: id,
            creator: instanceDetails.initiator,
            status: "Open",
            created_at: event.timestamp,
            updated_at: event.timestamp,
            from_address: instanceDetails.initiator_erc20,
            from_ticker: fromTokenDetails.symbol,
            from_amount: instanceDetails.initiator_amount,
            to_address: instanceDetails.counter_party_erc20,
            to_ticker: toTokenDetails.symbol,
            to_amount: instanceDetails.counter_party_amount,
            rate:
              parseFloat(instanceDetails.counter_party_amount) /
              parseFloat(instanceDetails.initiator_amount),
            gated_account: instanceDetails.gating.gated_account,
            gated_in_collection: instanceDetails.gating.in_collection,
            gated_min_balance_address: instanceDetails.gating.min_balance
              ? instanceDetails.gating.min_balance[0]
              : null,
            gated_min_balance_amount: instanceDetails.gating.min_balance
              ? instanceDetails.gating.min_balance[1]
              : null,
            gated_token_id_address: instanceDetails.gating.token_id
              ? instanceDetails.gating.token_id[0]
              : null,
            gated_token_id: instanceDetails.gating.token_id
              ? instanceDetails.gating.token_id[1]
              : null,
            notes: null,
          };

          await db
            .insertInto("starklens.swap_intents")
            .values(swapIntent)
            .execute();

          console.log(`Inserted new swap intent: ${id}`);
        } catch (error) {
          console.error(`Error processing 'Begun' event: ${error}`);
          continue; // Skip to the next event
        }
      } else if (event.name === "Finished" || event.name === "Cancelled") {
        console.log(`Processing '${event.name}' event for swap intent ${id}`);
        // Check if the swap intent exists before updating
        if (await swapIntentExists(id)) {
          const newStatus =
            event.name === "Finished" ? "Completed" : "Cancelled";
          await db
            .updateTable("starklens.swap_intents")
            .set({
              status: newStatus,
              updated_at: event.timestamp,
            })
            .where("id", "=", id)
            .execute();

          console.log(`Updated swap intent ${id} status to ${newStatus}`);
        } else {
          console.log(`Swap intent ${id} not found. Skipping update.`);
          continue; // Skip to the next event
        }
      }

      // Record the processed event
      const processedEvent: ProcessedEventsTable = {
        event_id: event.eventId,
        swap_intent_id: id,
        event_type: event.name,
        processed_at: new Date().toISOString(),
      };

      await db
        .insertInto("starklens.processed_events")
        .values(processedEvent)
        .execute();

      console.log(`Recorded processed event: ${event.eventId}`);
    }

    return NextResponse.json({ message: "Events processed successfully" });
  } catch (error) {
    console.error("Error processing events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
