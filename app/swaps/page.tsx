import GlassContainer from "@/components/molecules/glass-container";
import IntentsFeed from "@/components/organisms/intents-feed";
import { getSwapIntents } from "@/utils/db";

const SwapsHome = async () => {
  const intents = await getSwapIntents({ limit: 25, offset: 0 });
  return (
    <GlassContainer>
      <p className="pt-4 px-4 pb-2 font-semibold text-xl">Swaps</p>
      <div className="rounded-2xl bg-[#F8F8F7] p-4">
        <IntentsFeed swapIntents={intents} isUserSwap />
      </div>
    </GlassContainer>
  );
};

export default SwapsHome;
