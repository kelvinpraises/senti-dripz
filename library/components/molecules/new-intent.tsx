"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectorType } from "@dynamic-labs/starknet";
import React, { useState } from "react";
import { toast } from "sonner";
import { Call, uint256 } from "starknet";

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
import TokenSelect from "@/components/molecules/token-select";

export type Token = {
  symbol: string;
  name: string;
  address: string;
};

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

const NewSwapIntent = () => {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [gatedAddress, setGatedAddress] = useState<string>("");
  const [gatedType, setGatedType] = useState<string>("none");
  const [gatedAmount, setGatedAmount] = useState<string>("");
  const [gatedTokenId, setGatedTokenId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { primaryWallet } = useDynamicContext();

  const rate = parseFloat(toAmount || "0") / parseFloat(fromAmount || "0") || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!primaryWallet) {
      toast.error("Please connect your wallet first.");
      setIsSubmitting(false);
      return;
    }

    const connector = primaryWallet?.connector as StarknetWalletConnectorType;

    if (!connector) {
      toast.error("Wallet connector not found.");
      setIsSubmitting(false);
      return;
    }

    if (!fromToken || !toToken || !fromAmount || !toAmount) {
      toast.error("Please fill in all required fields.");
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

      const fromAmountBN = uint256.bnToUint256(fromAmount);
      console.log(fromAmountBN);
      const toAmountBN = uint256.bnToUint256(toAmount);

      const calls: Call[] = [
        {
          contractAddress: contractAddress as string,
          entrypoint: "begin",
          calldata: [
            fromToken.address,
            fromAmountBN.low,
            fromAmountBN.high,
            toToken.address,
            toAmountBN.low,
            toAmountBN.high,
            gatedAddress || "0x0",
            gatedType === "in_collection" ? gatedAddress : "0x1",
            gatedType === "min_balance" ? gatedAmount : "0x1",
            gatedType === "token_id" ? gatedTokenId : "0x1",
          ],
        },
      ];

      // const calls: Call[] = [{
      //   contractAddress: contractAddress as string,
      //   entrypoint: "begin",
      //   calldata: [
      //     fromToken.address,
      //     uint256.bnToUint256(fromAmount).low,
      //     uint256.bnToUint256(fromAmount).high,
      //     toToken.address,
      //     uint256.bnToUint256(toAmount).low,
      //     uint256.bnToUint256(toAmount).high,
      //     gatedAddress || "0x0",
      //     gatedType === "in_collection" ? gatedAddress : "0x1",
      //     gatedType === "min_balance" ? gatedAddress : "0x1",
      //     gatedType === "min_balance" ? uint256.bnToUint256(gatedAmount || "0").low : "0x1",
      //     gatedType === "min_balance" ? uint256.bnToUint256(gatedAmount || "0").high : "0x1",
      //     gatedType === "token_id" ? gatedAddress : "0x1",
      //     gatedType === "token_id" ? gatedTokenId || "0x1" : "0x1"
      //   ],

      const transaction = await signer.execute(calls);
      console.log("Transaction hash:", transaction.transaction_hash);

      toast.success("Transaction sent. Waiting for confirmation...");

      await signer.waitForTransaction(transaction.transaction_hash);
      toast.success("Swap intent created successfully!");
    } catch (error) {
      console.error("Error creating swap intent:", error);
      if (
        error instanceof Error &&
        error.message.includes("Input too long for arguments")
      ) {
        toast.error("Input values are too large. Please try smaller amounts.");
      } else {
        toast.error(
          `Failed to create swap intent: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="bg-zinc-800 text-white hover:bg-zinc-700"
          >
            New Swap Intent
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Swap Intent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex space-x-2">
              <TokenSelect
                tokens={tokens}
                selectedToken={fromToken}
                onSelectToken={setFromToken}
              />
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="Amount"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <div className="flex space-x-2">
              <TokenSelect
                tokens={tokens}
                selectedToken={toToken}
                onSelectToken={setToToken}
              />
              <Input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="Amount"
              />
            </div>
          </div>

          <div className="text-gray-500 font-bold text-xs">
            <p>Swap Rate: {rate.toFixed(6)}</p>
          </div>

          <div className="space-y-2">
            <Label>Gating</Label>
            <select
              value={gatedType}
              onChange={(e) => setGatedType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="none">No Gating</option>
              <option value="account">Account</option>
              <option value="in_collection">In Collection</option>
              <option value="min_balance">Minimum Balance</option>
              <option value="token_id">Token ID</option>
            </select>
            {gatedType !== "none" && (
              <Input
                value={gatedAddress}
                onChange={(e) => setGatedAddress(e.target.value)}
                placeholder="Address"
              />
            )}
            {gatedType === "min_balance" && (
              <Input
                type="number"
                value={gatedAmount}
                onChange={(e) => setGatedAmount(e.target.value)}
                placeholder="Minimum Amount"
              />
            )}
            {gatedType === "token_id" && (
              <Input
                type="number"
                value={gatedTokenId}
                onChange={(e) => setGatedTokenId(e.target.value)}
                placeholder="Token ID"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-800 text-white hover:bg-zinc-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Swap Intent..." : "Create Swap Intent"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSwapIntent;



