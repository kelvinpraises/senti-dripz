"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Separator } from "@radix-ui/react-separator";
import { Checkbox } from "../atoms/checkbox";
import { ScrollArea, ScrollBar } from "../atoms/scroll-area";
import TokenSelect, { Token } from "./token-select";

type TimeUnit = "minutes" | "hours" | "days" | "weeks";

const tokens: Token[] = [
  {
    symbol: "SLTT1",
    name: "Starklens TToken 1",
    address:
      "0x05528e1787f89bd1c9ed07dd25df7a0a6abe406fb1228ce44a185256b7162049",
  },
  {
    symbol: "SLTT2",
    name: "Starklens TToken 2",
    address:
      "0x041766ce8357f8e21c3bec97f3d1490095613df4ee6b39385b43ee37a2d0fd60",
  },
];

const NewCollector = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [startValue, setStartValue] = useState(1);
  const [startUnit, setStartUnit] = useState<TimeUnit>("hours");
  const [endValue, setEndValue] = useState(10);
  const [endUnit, setEndUnit] = useState<TimeUnit>("minutes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);

  const { primaryWallet } = useDynamicContext();

  const timeUnits: TimeUnit[] = ["minutes", "hours", "days", "weeks"];

  const getMilliseconds = (value: number, unit: TimeUnit) => {
    const multipliers = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000,
    };
    return value * multipliers[unit];
  };

  const getUnixTimestamps = () => {
    const now = Date.now();
    const startOffset = getMilliseconds(startValue, startUnit);
    const endOffset = getMilliseconds(endValue, endUnit);

    const startTimestamp = Math.floor((now + startOffset) / 1000);
    const endTimestamp = Math.floor((now + startOffset + endOffset) / 1000);

    return { startTimestamp, endTimestamp };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    if (!name || !token || !amount) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { startTimestamp, endTimestamp } = getUnixTimestamps();

      toast.success("Creating Collective Fund...");

      // Here you would typically call a function to create the collective fund
      // For example: await createCollectiveFund(name, description, startTimestamp, endTimestamp, selectedMerchants);

      console.log("Fund Details:", {
        name,
        description,
        startTimestamp,
        endTimestamp,
        selectedMerchants,
      });

      toast.success("Collective Fund created successfully!");
    } catch (error) {
      console.error("Error creating collective fund:", error);
      toast.error(
        `Failed to create collective fund: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMerchantToggle = (merchant: string) => {
    setSelectedMerchants((prev) =>
      prev.includes(merchant)
        ? prev.filter((m) => m !== merchant)
        : [...prev, merchant],
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-lg py-3 px-4">
          New Collector
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white sm:rounded-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Collective Fund</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>General</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fund Name"
            />
            <div className="flex space-x-2">
              <TokenSelect
                tokens={tokens}
                selectedToken={token}
                onSelectToken={setToken}
              />
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
              />
            </div>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Registration Time</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="1"
                value={startValue}
                onChange={(e) => setStartValue(parseInt(e.target.value))}
                className="w-20"
              />
              <Select
                value={startUnit}
                onValueChange={(value: TimeUnit) => setStartUnit(value)}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {timeUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>from now, it starts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="1"
                value={endValue}
                onChange={(e) => setEndValue(parseInt(e.target.value))}
                className="w-20"
              />
              <Select
                value={endUnit}
                onValueChange={(value: TimeUnit) => setEndUnit(value)}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {timeUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <span>later, it ends</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span>
              <h4 className="text-sm font-medium leading-none">Merchants</h4>
              <h6 className="text-xs">
                (optional collectors to gate recipients funds to)
              </h6>
            </span>
            <ScrollArea className="h-32 rounded-md border">
              <div className="p-4">
                {tags.map((tag) => (
                  <React.Fragment key={tag}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={tag}
                        checked={selectedMerchants.includes(tag)}
                        onCheckedChange={() => handleMerchantToggle(tag)}
                      />
                      <label htmlFor={tag} className="text-sm cursor-pointer">
                        {tag}
                      </label>
                    </div>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Fund..." : "Create Fund"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export default NewCollector;
