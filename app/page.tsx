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
          <IntentsFeed />
        </TabsContent>
      </Tabs>
    </GlassContainer>
  );
};

export default IntentsHome;
