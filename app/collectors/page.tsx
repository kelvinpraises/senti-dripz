import GlassContainer from "@/components/molecules/glass-container";
import CollectorMetrics from "@/components/organisms/collector-metrics";
import Collectors from "@/components/organisms/collectors";
import { Collector, Recipient } from "@/types";

const demoRecipients: Recipient[] = [
  {
    id: "1",
    name: "Local Community Center",
    type: "organization",
    profileLogoUrl:
      "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
    fundingFlows: [
      {
        id: "flow1",
        name: "Community Fund A",
        amount: 500,
        imageUrl:
          "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "flow2",
        name: "Education Grant B",
        amount: 1000,
        imageUrl:
          "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  // ... (other recipients)
];

const demoCollectors: Collector[] = [
  {
    id: "happy",
    emojiCodePoint: "1f34e",
    name: "Fresh Produce Market",
    creator: "0x1234...5678",
    acceptedToken: {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USD Coin",
      symbol: "USDC",
    },
    shopItems: [
      { id: "1", name: "Apple", emojiCodePoint: "1f34e", price: 1.99 },
      { id: "2", name: "Banana", emojiCodePoint: "1f34c", price: 0.99 },
      { id: "3", name: "Orange", emojiCodePoint: "1f34a", price: 1.49 },
      { id: "4", name: "Grapes", emojiCodePoint: "1f347", price: 2.99 },
    ],
  },
  // ... (other collectors)
];

const metrics = [
  { title: "Intent volume", value: "$18,746,443.74" },
  { title: "Intents Transmitted", value: "5,690" },
  { title: "Active Swaps", value: "560" },
];

const CollectorsHome = () => {
  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">Collectors</p>
      <p className="px-4 pb-2 text-sm text-gray-700">
        Sample flow collectors (uses sdk under the hood)
      </p>
      <div className="flex flex-col rounded-2xl bg-[#F8F8F7] p-4 gap-4">
        {/* <CollectorMetrics metrics={metrics} /> */}
        <Collectors collectors={demoCollectors} recipients={demoRecipients} />
      </div>
    </GlassContainer>
  );
};

export default CollectorsHome;
