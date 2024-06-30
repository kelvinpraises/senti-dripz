"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/atoms/alert";
import { Button } from "@/components/atoms/button";
import { Fund, FundRecipient } from "@/types";

const FundHead = ({ item }: { item: Fund }) => {
  const { status, name, emoji, rate, token } = item;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className="text-sm text-gray-600">
            {token.symbol} @ {rate.toFixed(4)}
          </span>
        </div>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          status === "Open"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

const FundBody = ({ item }: { item: Fund }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipients, setRecipients] = useState<FundRecipient[]>([]);
  const [votingEnded, setVotingEnded] = useState(false);
  const { primaryWallet } = useDynamicContext();

  const handleAddDemoRecipients = async () => {
    setIsSubmitting(true);
    try {
      // Simulating API call to add demo recipients
      const demoRecipients: FundRecipient[] = [
        { address: "0x123...", name: "Recipient 1", status: "None" },
        { address: "0x456...", name: "Recipient 2", status: "None" },
      ];
      setRecipients(demoRecipients);
      toast.success("Demo recipients added successfully!");
    } catch (error) {
      toast.error("Failed to add demo recipients");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (
    address: string,
    newStatus: FundRecipient["status"],
  ) => {
    setRecipients((prevRecipients) =>
      prevRecipients.map((recipient) =>
        recipient.address === address
          ? { ...recipient, status: newStatus }
          : recipient,
      ),
    );
  };

  const handleVote = (accept: boolean) => {
    toast.success(`Voted to ${accept ? "accept" : "reject"} funding`);
    // Implement voting logic here
  };

  if (votingEnded) {
    return (
      <div className="flex flex-col gap-4">
        <Alert>
          <AlertDescription>
            Voting time has ended. Please cast your vote.
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button onClick={() => handleVote(true)} className="flex-1">
            Accept Funding
          </Button>
          <Button onClick={() => handleVote(false)} className="flex-1">
            Reject Funding
          </Button>
        </div>
      </div>
    );
  }

  if (recipients.length === 0) {
    return (
      <Button
        onClick={handleAddDemoRecipients}
        disabled={isSubmitting}
        className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
      >
        {isSubmitting ? "Adding..." : "Add Demo Recipients"}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {recipients.map((recipient) => (
        <div
          key={recipient.address}
          className="flex items-center justify-between"
        >
          <span>{recipient.name}</span>
          <select
            value={recipient.status}
            onChange={(e) =>
              handleStatusChange(
                recipient.address,
                e.target.value as FundRecipient["status"],
              )
            }
            className="border rounded p-1"
          >
            <option value="None">None</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Appealed">Appealed</option>
            <option value="InReview">In Review</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export { FundBody, FundHead };
