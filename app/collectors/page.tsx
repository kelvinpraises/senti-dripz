import GlassContainer from "@/components/molecules/glass-container";
import MarketTable from "@/components/organisms/market-table";

const MarketsHome = () => {
  const parentComponentData = {
    metrics: [
      { title: "Intent volume", value: "$18,746,443.74" },
      { title: "Intents Transmitted", value: "5,690" },
      { title: "Active Swaps", value: "560" },
    ],
    assets: [
      {
        name: "Wrapped Ether",
        symbol: "WETH",
        iconUrl: "/tokens/aero.svg",
        tvl: {
          amount: "27.61",
          usdValue: "$100,000",
        },
        volume: {
          amount: "15.32",
          usdValue: "$55,000",
        },
        swapFees: "$250.00",
      },
      {
        name: "USD Coin",
        symbol: "USDC",
        iconUrl: "/tokens/usdc.svg",
        tvl: {
          amount: "50,000",
          usdValue: "$50,000",
        },
        volume: {
          amount: "25,000",
          usdValue: "$25,000",
        },
        swapFees: "$125.00",
      },
    ],
  };

  const { metrics, assets } = parentComponentData;

  return (
    <GlassContainer>
      <p className="pt-4 px-4 pb-2 font-semibold text-xl">Markets</p>
      <div className="rounded-2xl bg-[#F8F8F7] p-4">
        <MarketTable metrics={metrics} assets={assets} />
      </div>
    </GlassContainer>
  );
};

export default MarketsHome;
