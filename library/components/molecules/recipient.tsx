"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "../atoms/scroll-area";
import { Recipient } from "@/types";

const RecipientHead = ({ item }: { item: Recipient }) => {
  const { name, type, profileLogoUrl } = item;
  return (
    <div className="flex items-center justify-between gap-4">
      <Image
        src={profileLogoUrl}
        alt={`${name} logo`}
        className="w-10 h-10 rounded-full object-cover"
        width={40}
        height={40}
      />
      <div className="flex flex-col">
        <h3 className="text-lg w-fit font-semibold text-gray-800">{name}</h3>
        <span className="text-sm w-fit text-gray-600 capitalize">{type}</span>
      </div>
    </div>
  );
};

const RecipientBody = ({ item }: { item: Recipient }) => {
  const { fundingFlows } = item;

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="rounded-md border">
        <div className="flex space-x-4 p-4">
          {fundingFlows.length > 0 ? (
            fundingFlows.map((flow) => (
              <div key={flow.id} className="shrink-0">
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={flow.imageUrl}
                    alt={flow.name}
                    className="aspect-[3/4] h-fit w-fit object-cover"
                    width={300}
                    height={400}
                  />
                </div>
                <p className="text-sm mt-2 text-center">{flow.name}</p>
                <p className="text-sm font-bold">${flow.amount.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <div className="w-[200px] h-[250px] flex flex-col items-center justify-center border rounded-md">
              <p className="text-gray-400 mb-2">No funding flow</p>
              <p className="text-sm">This recipient has no active flows</p>
              <p className="text-sm font-bold">$0</p>
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export { RecipientBody, RecipientHead };
