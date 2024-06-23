import { NextRequest, NextResponse } from "next/server";
import { getInstanceDetails, getERC20Details } from "@/utils/contract";
import { db } from "@/db";

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

export async function POST(request: NextRequest) {
  try {
    const events = await request.json();

    for (const event of events.items) {
      // Check if we've already processed this event
      const existingEvent = await db
        .selectFrom("starklens.processed_events")
        .where("event_id", "=", event.eventId)
        .executeTakeFirst();

      if (existingEvent) {
        console.log(`Event ${event.eventId} already processed. Skipping.`);
        continue;
      }

      const id = event.keyDecoded.find(
        (key: { name: string }) => key.name === "id"
      )?.value;
      if (!id) {
        console.error(
          `Invalid event data: missing id for event ${event.eventId}`
        );
        continue;
      }

      // Begin a transaction
      await db.transaction().execute(async (trx) => {
        if (event.name === "Begun") {
          // Fetch additional details from the contract
          const instanceDetails = await getInstanceDetails(
            event.fromAddress,
            parseInt(id, 16)
          );

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

          await trx
            .insertInto("starklens.swap_intents")
            .values(swapIntent)
            .execute();
        } else if (event.name === "Finished" || event.name === "Cancelled") {
          // Update the status of an existing swap intent
          const newStatus =
            event.name === "Finished" ? "Completed" : "Cancelled";
          await trx
            .updateTable("starklens.swap_intents")
            .set({
              status: newStatus,
              updated_at: event.timestamp,
            })
            .where("id", "=", id)
            .execute();
        }

        // Record the processed event
        const processedEvent: ProcessedEventsTable = {
          event_id: event.eventId,
          swap_intent_id: id,
          event_type: event.name,
          processed_at: new Date().toISOString(),
        };

        await trx
          .insertInto("starklens.processed_events")
          .values(processedEvent)
          .execute();
      });
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
