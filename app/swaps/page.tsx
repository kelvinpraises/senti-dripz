import GlassContainer from "@/components/molecules/glass-container";
import IntentsFeed from "@/components/organisms/intents-feed";

const attachments = [
  {
    id: "swap-intent-1",
    creator: "0x1234567890",
    status: "Open",
    created_at: 1687334400,
    updated_at: 1687334400,
    from: {
      address: "0x1111111111",
      ticker: "usdc",
      amount: 5000,
    },
    to: {
      address: "0x1111111111",
      ticker: "aero",
      amount: 3000,
    },
    rate: 1.67,
    gated: {
      account: {
        address: "0x0987654321",
      },
      in_collection: {
        address: "0x1111111111",
      },
      min_balance: {
        address: "0x2222222222",
        amount: 1000,
      },
      token_id: {
        address: "0x3333333333",
        id: 9,
      },
    },
    // notes: "This is a sample swap intent",
  },
  {
    id: "swap-intent-2",
    creator: "0x1234567890",
    status: "Open",
    created_at: 1687334400,
    updated_at: 1687334400,
    from: {
      address: "0x1111111111",
      ticker: "wblt",
      amount: 5000,
    },
    to: {
      address: "0x1111111111",
      ticker: "usdc",
      amount: 3000,
    },
    rate: 0.6,
    gated: {
      account: {
        address: "0x0987654321",
      },
      in_collection: {
        address: "0x1111111111",
      },
      min_balance: {
        address: "0x2222222222",
        amount: 1000,
      },
      token_id: {
        address: "0x3333333333",
        id: 9,
      },
    },
    notes: "This is a sample swap intent",
  },
  {
    id: "swap-intent-3",
    creator: "0x1234567890",
    status: "Open",
    created_at: 1687334400,
    updated_at: 1687334400,
    from: {
      address: "0x1111111111",
      ticker: "aero",
      amount: 5000,
    },
    to: {
      address: "0x1111111111",
      ticker: "wblt",
      amount: 3000,
    },
    rate: 0.6,
    gated: {
      account: {
        address: "0x0987654321",
      },
      in_collection: {
        address: "0x1111111111",
      },
      min_balance: {
        address: "0x2222222222",
        amount: 1000,
      },
      token_id: {
        address: "0x3333333333",
        id: 0,
      },
    },
    notes: "This is a sample swap intent",
  },
];

const SwapsHome = () => {
  return (
    <GlassContainer>
      <p className="pt-4 px-4 pb-2 font-semibold text-xl">Swaps</p>
      <div className="rounded-2xl bg-[#F8F8F7] p-4">
        <IntentsFeed swapIntents={attachments} />
      </div>
    </GlassContainer>
  );
};

export default SwapsHome;
