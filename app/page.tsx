import GlassContainer from "@/components/molecules/glass-container";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules/tabs";
import IntentsFeed from "@/components/organisms/intents-feed";
import QueryIntents from "@/components/organisms/query-intents";

const IntentsHome = () => {
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
          id: 5,
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
          id: 6,
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
          id: 3,
        },
      },
      notes: "This is a sample swap intent",
    },
  ];
  return (
    <GlassContainer>
      <p className="pt-4 px-4 pb-2 font-semibold text-xl">Intents</p>
      <Tabs defaultValue="query">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="query">Query</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
        </TabsList>
        <TabsContent className="rounded-2xl bg-[#F8F8F7] p-4" value="query">
          <QueryIntents />
        </TabsContent>
        <TabsContent className="rounded-2xl bg-[#F8F8F7] p-4" value="feed">
          <IntentsFeed swapIntents={attachments} />
        </TabsContent>
      </Tabs>
    </GlassContainer>
  );
};

export default IntentsHome;
