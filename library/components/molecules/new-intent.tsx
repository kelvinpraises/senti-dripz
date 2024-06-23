"use client";

import {
  createWalletClientFromWallet,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/atoms/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/atoms/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Coins } from "lucide-react";

type Token = {
  symbol: string;
  name: string;
  address: string;
};

const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", address: "0x..." },
  { symbol: "USDC", name: "USD Coin", address: "0x..." },
  { symbol: "DAI", name: "Dai Stablecoin", address: "0x..." },
];

export type SwapIntent = {
  id: string;
  creator: string;
  status: string;
  created_at: number;
  updated_at: number;
  from: {
    address: string;
    ticker: string;
    amount: number;
  };
  to: {
    address: string;
    ticker: string;
    amount: number;
  };
  rate: number;
  gated: {
    account?: {
      address: string;
    };
    in_collection?: {
      address: string;
    };
    min_balance?: {
      address: string;
      amount: number;
    };
    token_id?: {
      address: string;
      id: number;
    };
  };
  notes?: string;
};

const NewSwapIntent = () => {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [rate, setRate] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [gatedAddress, setGatedAddress] = useState<string>("");
  const [gatedType, setGatedType] = useState<string>("none");
  const [gatedAmount, setGatedAmount] = useState<string>("");
  const [gatedTokenId, setGatedTokenId] = useState<string>("");

  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    if (fromAmount && toAmount && fromAmount !== "0" && toAmount !== "0") {
      const calculatedRate = parseFloat(toAmount) / parseFloat(fromAmount);
      setRate(calculatedRate);
    } else {
      setRate(0);
    }
  }, [fromAmount, toAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newIntent: SwapIntent = {
      id: Date.now().toString(), // Generate a unique ID
      creator: "user_address", // Replace with actual user address
      status: "active",
      created_at: Date.now(),
      updated_at: Date.now(),
      from: {
        address: fromToken?.address || "",
        ticker: fromToken?.symbol || "",
        amount: parseFloat(fromAmount),
      },
      to: {
        address: toToken?.address || "",
        ticker: toToken?.symbol || "",
        amount: parseFloat(toAmount),
      },
      rate,
      gated: {
        ...(gatedType === "account" && { account: { address: gatedAddress } }),
        ...(gatedType === "in_collection" && {
          in_collection: { address: gatedAddress },
        }),
        ...(gatedType === "min_balance" && {
          min_balance: {
            address: gatedAddress,
            amount: parseFloat(gatedAmount),
          },
        }),
        ...(gatedType === "token_id" && {
          token_id: {
            address: gatedAddress,
            id: parseInt(gatedTokenId),
          },
        }),
      },
      notes,
    };

    console.log(newIntent);
    // Here you would typically send this data to your backend or blockchain
  };

  const signMessage = async () => {
    if (!primaryWallet) {
      alert("nothing");
      return;
    }

    const walletClient = await createWalletClientFromWallet(primaryWallet);

    // No account is required by viem here, because the account is already setup.
    const signedMessage = await walletClient.signMessage({
      message: "example message",
    });

    console.log({ signedMessage });
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
          <button onClick={() => signMessage()}>Sign message</button>
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
          >
            Create Swap Intent
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface TokenSelectProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
}

const TokenSelect = React.memo(
  ({ tokens = [], selectedToken, onSelectToken }: TokenSelectProps) => {
    const [open, setOpen] = useState(false);

    const handleSelectToken = useCallback(
      (token: Token) => {
        onSelectToken(token);
        setOpen(false);
      },
      [onSelectToken]
    );

    const memoizedTokens = useMemo(() => tokens || [], [tokens]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[150px] justify-between bg-zinc-800 text-white hover:bg-zinc-700"
          >
            {selectedToken ? (
              <>
                <Coins className="mr-2 h-4 w-4" />
                {selectedToken.symbol}
              </>
            ) : (
              <>Select token</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-white">
          <Command>
            <CommandInput placeholder="Search token..." />
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {memoizedTokens.map((token) => (
                  <CommandItem
                    key={token.symbol}
                    onSelect={() => handleSelectToken(token)}
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    {token.symbol}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

export default NewSwapIntent;
