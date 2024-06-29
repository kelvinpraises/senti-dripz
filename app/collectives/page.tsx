import Link from "next/link";

import Card from "@/components/atoms/card";
import GlassContainer from "@/components/molecules/glass-container";
import NewCollective from "@/components/molecules/new-collective";

const CollectivesHome = async () => {
  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">Collectives</p>
      <p className="px-4 pb-2 text-sm text-gray-700">
        Discover or create decentralised funding flows
      </p>
      <div className="flex flex-col rounded-2xl bg-[#F8F8F7] p-4 gap-4">
        <NewCollective />
        <div className="grid-cols-1 grid md:grid-cols-2 gap-4">
          <Link href={"/collectives/0"}>
            <Card className="rounded-lg">happy</Card>
          </Link>
          <Link href={"/collectives/0"}>
            <Card className="rounded-lg">happy</Card>
          </Link>
          <Link href={"/collectives/0"}>
            <Card className="rounded-lg">happy</Card>
          </Link>
          <Link href={"/collectives/0"}>
            <Card className="rounded-lg">happy</Card>
          </Link>
          <Link href={"/collectives/0"}>
            <Card className="rounded-lg">happy</Card>
          </Link>
        </div>
      </div>
    </GlassContainer>
  );
};

export default CollectivesHome;
