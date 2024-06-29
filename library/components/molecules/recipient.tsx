"use client";

import Image from "next/image";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "../atoms/scroll-area";

export type Recipient = {
  id: string;
  name: string;
  creator: string;
  status: string;
  created_at: number;
  updated_at: number;
  rate: number;
};

const RecipientHead = ({ item }: { item: Recipient }) => {
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

export interface Artwork {
  artist: string;
  art: string;
}

export const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
];

const RecipientBody = ({ item }: { item: Recipient }) => {
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
      <ScrollArea className="rounded-md border w-full">
        <div className="flex space-x-4 p-4">
          {works.map((artwork) => (
            <figure key={artwork.artist} className="shrink-0">
              <div className="overflow-hidden rounded-md">
                <Image
                  src={artwork.art}
                  alt={`Photo by ${artwork.artist}`}
                  className="aspect-[3/4] h-fit w-fit object-cover"
                  width={300}
                  height={400}
                />
              </div>
              <figcaption className="pt-2 text-xs text-muted-foreground">
                Photo by{" "}
                <span className="font-semibold text-foreground">
                  {artwork.artist}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export { RecipientBody, RecipientHead };
