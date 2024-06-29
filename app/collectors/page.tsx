import Card from "@/components/atoms/card";
import GlassContainer from "@/components/molecules/glass-container";
import MetricBox from "@/components/molecules/metric-box";
import { CollectorBody, CollectorHead } from "@/components/molecules/collector";
import Collectors from "@/components/organisms/collectors";
import CollectorMetrics from "@/components/organisms/collector-metrics";

const CollectorsHome = () => {
  const metrics = [
    { title: "Intent volume", value: "$18,746,443.74" },
    { title: "Intents Transmitted", value: "5,690" },
    { title: "Active Swaps", value: "560" },
  ];

  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">Collectors</p>
      <p className="px-4 pb-2 text-sm text-gray-700">
        Sample flow collectors (uses sdk under the hood)
      </p>
      <div className="flex flex-col rounded-2xl bg-[#F8F8F7] p-4 gap-4">
        <CollectorMetrics metrics={metrics} />
        <Collectors />
      </div>
    </GlassContainer>
  );
};

export default CollectorsHome;
