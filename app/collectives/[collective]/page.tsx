"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import GlassContainer from "@/components/molecules/glass-container";
import Faucet from "@/components/organisms/faucet";
import Fundings from "@/components/organisms/fundings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";

interface EcosystemWithId {
  collectiveId: number;
}

interface EcosystemData {
  id: string;
  title: string;
  description: string;
  tokenAmount: string;
  createdBy: string;
  createdAt: Date;
}

const CollectiveHome = () => {
  const { collective: collectiveId } = useParams();

  const [data, setData] = useState<Partial<EcosystemData>>();
  const [activeScreen, setActiveScreen] = useState("ecoFunds");

  useEffect(() => {
    // (async () => {
    //   const ecosystem: EcosystemWithId = await getEcosystemById(
    //     collectiveId as string,
    //   );
    //   const newEcosystem = {
    //     title: ecosystem.name,
    //     description: ecosystem.description,
    //   };
    //   setData(newEcosystem);
    // })();
  }, []);

  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">
        Collective {collectiveId}
      </p>
      <Tabs defaultValue="home">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent className="rounded-2xl bg-[#F8F8F7] p-4" value="home">
          <Fundings />
        </TabsContent>
        <TabsContent className="rounded-2xl bg-[#F8F8F7] p-4" value="about">
          <Faucet />
        </TabsContent>
      </Tabs>
    </GlassContainer>
  );
};

export default CollectiveHome;
