"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { toast } from "sonner";

export type Collector = {
  id: string;
  name: string;
  creator: string;
  status: string;
  created_at: number;
  updated_at: number;
  rate: number;
};

const CollectorHead = ({ item }: { item: Collector }) => {
  const { status, name } = item;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center">
        <div className="relative w-fit">
          <img src={`/tokens/usdc.svg`} className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      </div>
      <div className="flex gap-2 bg-slate-200 p-1 rounded-lg text-gray-700">
        <p className="text-sm w-fit">{status}</p>
        <p className="text-sm w-fit">@ 3,000,000,000</p>
        <p className="text-sm w-fit">@ {item.rate.toFixed(4)}</p>
      </div>
    </div>
  );
};

const CollectorBody = ({ item }: { item: Collector }) => {
  const { rate, creator, id } = item;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canComplete, setCanComplete] = useState(true);
  const [warning, setWarning] = useState("");
  const [info, setInfo] = useState("Happy");

  const { primaryWallet } = useDynamicContext();

  const handleButtonClick = async () => {
    setIsSubmitting(true);

    if (!primaryWallet) {
      toast.error("Please connect your wallet first.");
      setIsSubmitting(false);
      return;
    }

    const connector = primaryWallet?.connector;

    if (!connector) {
      toast.error("Wallet connector not found.");
      setIsSubmitting(false);
      return;
    }

    try {
      await connector.connect();
      const signer = await connector.getSigner();

      if (!signer) {
        throw new Error("Failed to get signer");
      }

      const contractAddress =
        process.env.NEXT_PUBLIC_STARKLENS_SWAPERC20_CONTRACT;
      if (!contractAddress) {
        throw new Error("Contract address not found in environment variables");
      }

      toast.success("Transaction sent. Waiting for confirmation...");

      toast.success("Swap completed successfully!");
    } catch (error) {
      console.error("Error interacting with swap:", error);
      toast.error(
        `Failed to ${"complete"} swap: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* nft cards */}
      <div>NFT 1</div>
      <div>NFT 2</div>
      <div>NFT 3</div>
      <div>NFT 4</div>
    </div>
  );
};

export { CollectorBody, CollectorHead };
