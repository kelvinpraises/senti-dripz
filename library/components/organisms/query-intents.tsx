"use client";

import Image from "next/image";
import React, { useState } from "react";

import { PlaceholdersAndVanishInput } from "@/components/atoms/query-input";
import { SwapIntent } from "@/components/molecules/intent";
import QueryResponse from "@/components/organisms/query-response";

interface Interaction {
  userInput: string;
  aiResponse: {
    text: string;
    attachments: SwapIntent[];
  };
}

const QueryIntents = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [currentInput, setCurrentInput] = useState("");

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  // This function simulates an AI response. In a real app, this would be an API call.
  const getAIResponse = (input: string): Interaction["aiResponse"] => {
    return {
      text: `AI response to: "${input}"`,
      attachments: [
        {
          id: `swap-intent-${interactions.length + 1}`,
          creator: "0x1234567890",
          status: "Open",
          created_at: Date.now(),
          updated_at: Date.now(),
          from: {
            address: "0x1111111111",
            ticker: "usdc",
            amount: 5000,
          },
          to: {
            address: "0x1111111111",
            ticker: "aero",
            amount: 3000,
          },
          rate: 1.67,
          gated: {},
        },
      ],
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentInput.trim() === "") return;

    const aiResponse = getAIResponse(currentInput);
    const newInteraction: Interaction = {
      userInput: currentInput,
      aiResponse: aiResponse,
    };

    setInteractions([...interactions, newInteraction]);
    setCurrentInput("");
  };

  return (
    <div className="flex flex-col justify-between items-center gap-10 min-h-60">
      {interactions.length === 0 ? (
        <>
          <h2 className="text-xl text-center sm:text-3xl text-black">
            Query them Swaps! On your terms.
          </h2>
          <Image
            alt="query intents"
            src="https://illustrations.popsy.co/pink/business-success-chart.svg"
            width={400}
            height={400}
          />
        </>
      ) : (
        <div className="w-full space-y-6">
          {interactions.map((interaction, index) => (
            <div key={index} className="border-b pb-4">
              <div className=" flex justify-end">
                <p className="mb-2 py-2 px-4 text-right text-white dark:bg-zinc-800">
                  User: {interaction.userInput}
                </p>
              </div>
              <QueryResponse
                text={interaction.aiResponse.text}
                attachments={interaction.aiResponse.attachments}
              />
            </div>
          ))}
        </div>
      )}

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        value={currentInput}
      />
    </div>
  );
};

export default QueryIntents;
