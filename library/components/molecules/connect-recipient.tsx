"use client";

import Image from "next/image";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Label } from "@/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { ScrollArea, ScrollBar } from "../atoms/scroll-area";

interface FundingFlow {
  id: string;
  name: string;
  amount: number;
  imageUrl: string;
}

interface Recipient {
  id: string;
  name: string;
  type: "organization" | "individual";
  fundingFlows: FundingFlow[];
}

interface ConnectRecipientProps {
  selectedRecipient: Recipient | null;
  setSelectedRecipient: React.Dispatch<React.SetStateAction<Recipient | null>>;
  demoRecipients: Recipient[];
}

const ConnectRecipient: React.FC<ConnectRecipientProps> = ({
  selectedRecipient,
  setSelectedRecipient,
  demoRecipients,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient) {
      toast.error("Please select a recipient.");
      return;
    }
    try {
      console.log("Connecting recipient:", selectedRecipient);
      toast.success("Recipient connected successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error connecting recipient:", error);
      toast.error(
        `Failed to connect recipient: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3 px-4"
        >
          {selectedRecipient
            ? `Connected: ${selectedRecipient.name}`
            : "Connect Recipient"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white sm:rounded-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Connect Recipient To Collectors (Demo)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Select a Recipient</Label>
            <ScrollArea className="h-40 rounded-md border">
              <RadioGroup
                value={selectedRecipient?.id}
                onValueChange={(value) =>
                  setSelectedRecipient(
                    demoRecipients.find((r) => r.id === value) || null,
                  )
                }
                className="space-y-1 p-1"
              >
                {demoRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center space-x-2 px-2 py-1"
                  >
                    <RadioGroupItem value={recipient.id} id={recipient.id} />
                    <Label htmlFor={recipient.id} className="text-sm">
                      {recipient.name} ({recipient.type})
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Funding Flows</Label>
            <ScrollArea className="rounded-md border w-full">
              <div className="flex space-x-4 p-4">
                {selectedRecipient ? (
                  selectedRecipient.fundingFlows.map((flow) => (
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
                      <p className="text-sm font-bold">${flow.amount}</p>
                    </div>
                  ))
                ) : (
                  <div className="w-[200px] h-[250px] flex flex-col items-center justify-center border rounded-md">
                    <p className="text-gray-400 mb-2">No funding flow</p>
                    <p className="text-sm">Select a recipient</p>
                    <p className="text-sm font-bold">$0</p>
                  </div>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
            disabled={!selectedRecipient}
          >
            Connect Recipient
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectRecipient;
