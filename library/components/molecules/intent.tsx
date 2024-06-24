"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectorType } from "@dynamic-labs/starknet";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Call, CallData, RpcProvider, shortString } from "starknet";

import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { cn } from "@/utils";
import {
  checkBalance,
  checkIfOwnsSpecificToken,
  checkIfOwnsToken,
} from "@/utils/contract";
import { Alert, AlertDescription } from "@/components/atoms/alert";

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

const IntentHead = ({ item }: { item: SwapIntent }) => {
  const { from, to, status } = item;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center">
        <div className="relative w-fit">
          <img
            src={`/tokens/${from.ticker}.svg`}
            alt={from.ticker}
            className="w-8 h-8"
          />
          <img
            src={`/tokens/${to.ticker}.svg`}
            alt={to.ticker}
            className="w-6 h-6 absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{`${from.ticker.toUpperCase()} to ${to.ticker.toUpperCase()}`}</h3>
      </div>
      <div className="flex gap-2 bg-slate-200 p-1 rounded-lg text-gray-700">
        <p className="text-sm w-fit">{status}</p>
        <p className="text-sm w-fit">@ 3,000,000,000</p>
        <p className="text-sm w-fit">@ {item.rate.toFixed(4)}</p>
      </div>
    </div>
  );
};

const IntentBody = ({
  item,
  isUserSwap,
}: {
  item: SwapIntent;
  isUserSwap: boolean;
}) => {
  const { from, to, rate, creator, gated, notes, id } = item;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canComplete, setCanComplete] = useState(true);
  const [gatingWarning, setGatingWarning] = useState("");
  const { primaryWallet, user } = useDynamicContext();

  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_STARKNET_RPC_URL,
  });

  useEffect(() => {
    checkGatingConditions();
  }, [primaryWallet, gated]);

  const checkGatingConditions = async () => {
    if (!primaryWallet || !user) {
      setCanComplete(false);
      setGatingWarning("Please connect your wallet to check swap eligibility.");
      return;
    }

    const connector = primaryWallet?.connector as StarknetWalletConnectorType;

    if (!connector) {
      toast.error("Wallet connector not found.");
      setIsSubmitting(false);
      return;
    }

    const userAddress = await connector.getAddress();

    if (!userAddress) {
      toast.error("Wallet address not found.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (gated.account && gated.account.address !== userAddress) {
        setCanComplete(false);
        setGatingWarning(
          `This swap is gated for account ${gated.account.address}`
        );
        return;
      }

      if (gated.in_collection) {
        const ownsToken = await checkIfOwnsToken(
          userAddress,
          gated.in_collection.address
        );
        if (!ownsToken) {
          setCanComplete(false);
          setGatingWarning(
            `You need to own a token from collection ${gated.in_collection.address}`
          );
          return;
        }
      }

      if (gated.min_balance) {
        const balance = await checkBalance(
          userAddress,
          gated.min_balance.address
        );
        if (balance < gated.min_balance.amount) {
          setCanComplete(false);
          setGatingWarning(
            `You need a minimum balance of ${gated.min_balance.amount} ${gated.min_balance.address}`
          );
          return;
        }
      }

      if (gated.token_id) {
        const ownsToken = await checkIfOwnsSpecificToken(
          userAddress,
          gated.token_id.address,
          gated.token_id.id
        );
        if (!ownsToken) {
          setCanComplete(false);
          setGatingWarning(
            `You need to own token ID ${gated.token_id.id} from ${gated.token_id.address}`
          );
          return;
        }
      }

      setCanComplete(true);
      setGatingWarning("");
    } catch (error) {
      console.error("Error checking gating conditions:", error);
      setCanComplete(false);
      setGatingWarning(
        "An error occurred while checking swap eligibility. Please try again."
      );
    }
  };

  const handleButtonClick = async () => {
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

      const calls: Call[] = [
        {
          contractAddress: contractAddress,
          entrypoint: isUserSwap ? "cancel" : "complete",
          calldata: CallData.compile({ id: shortString.encodeShortString(id) }),
        },
      ];

      const transaction = await signer.execute(calls);
      console.log("Transaction hash:", transaction.transaction_hash);

      toast.success("Transaction sent. Waiting for confirmation...");

      await provider.waitForTransaction(transaction.transaction_hash);
      toast.success(
        isUserSwap
          ? "Swap cancelled successfully!"
          : "Swap completed successfully!"
      );
    } catch (error) {
      console.error("Error interacting with swap:", error);
      toast.error(
        `Failed to ${isUserSwap ? "cancel" : "complete"} swap: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {gatingWarning && (
        <Alert variant="destructive">
          <AlertDescription>{gatingWarning}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-2 text-gray-700 text-base font-semibold w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="w-[11ch] whitespace-nowrap">You'll get their</p>
              <input
                type="number"
                value={from.amount}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full sm:w-40"
              />
              <p className="w-[5ch]">{from.ticker.toUpperCase()}</p>
            </div>

            <div className="flex items-center gap-2">
              <p className="w-[11ch] whitespace-nowrap">They get your</p>
              <input
                type="number"
                value={to.amount}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full sm:w-40"
              />
              <p className="w-[5ch]">{to.ticker.toUpperCase()}</p>
            </div>
          </div>

          <p className="text-gray-500 font-bold text-xs">
            {from.amount} {from.ticker.toUpperCase()} for {to.amount}{" "}
            {to.ticker.toUpperCase()} @ {rate} {from.ticker.toUpperCase()}/
            {to.ticker.toUpperCase()}
          </p>
        </div>
        <div className="flex w-full gap-2 items-center">
          <Separator
            className=" bg-slate-200 hidden sm:block"
            orientation="vertical"
          />
          <Button
            variant={isUserSwap ? "destructive" : "default"}
            className={cn(
              "bg-zinc-800 text-white hover:bg-zinc-700 w-full",
              isUserSwap && "bg-red-600 hover:bg-red-700 text-white"
            )}
            onClick={handleButtonClick}
            disabled={isSubmitting || !canComplete}
          >
            {isSubmitting
              ? isUserSwap
                ? "Cancelling Swap..."
                : "Completing Swap..."
              : isUserSwap
              ? "Cancel Swap"
              : "Confirm Swap"}
          </Button>
        </div>
      </div>
      {/* {Object.keys(gated).length > 0 && (
        <>
          <div className="space-y-2">
            {Object.entries(gated).map(([type, data]) => {
              let message = "";
              switch (type) {
                case "account":
                  message = `Account gated for: ${data.address}`;
                  break;
                case "in_collection":
                  message = `Must own a token from: ${data.address}`;
                  break;
                case "min_balance":
                  message = `Minimum balance required: ${
                    "amount" in data ? data.amount : "N/A"
                  } of ${data.address}`;
                  break;
                case "token_id":
                  message = `Must own token ID ${
                    "id" in data ? data.id : "N/A"
                  } from ${data.address}`;
                  break;
                default:
                  message = `Unknown gating type: ${type}`;
              }
              return (
                <p key={type} className="text-gray-700">
                  {message}
                </p>
              );
            })}
          </div>
          <Separator className="bg-slate-200" />
        </>
      )} */}
      {notes && <p className="text-gray-700">{notes}</p>}
      <p className="text-gray-700">Creator: {creator}</p>
    </div>
  );
};

export { IntentBody, IntentHead };
