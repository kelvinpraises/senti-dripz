import GlassContainer from "@/components/molecules/glass-container";
import IntentsFeed from "@/components/organisms/intents-feed";
import QueryIntents from "@/components/organisms/query-intents";
import React from "react";

const Home = () => {
  return (
    <div>
      <GlassContainer>
        <p className="p-4 font-semibold">Intents</p>
        <div className="rounded-2xl bg-[#F8F8F7] p-4">
          <IntentsFeed />
          <QueryIntents />
        </div>
      </GlassContainer>
    </div>
  );
};

export default Home;
