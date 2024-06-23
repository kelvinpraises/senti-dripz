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
  } | null;
}

const QueryIntents = ({ swapIntents }: { swapIntents: SwapIntent[] }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const placeholders = ["Is there an open swap available?"];

  const getAIResponse = async (
    input: string
  ): Promise<Interaction["aiResponse"]> => {
    try {
      const parsedBody = JSON.stringify({
        prompt: input,
        data: swapIntents,
      });

      const response = await fetch("/api/query", {
        method: "POST",
        body: parsedBody,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return {
        text: data.text,
        attachments: data.attachments,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentInput.trim() === "" || isFetching) return;

    setIsFetching(true);

    const aiResponse = await getAIResponse(currentInput);
    const newInteraction: Interaction = {
      userInput: currentInput,
      aiResponse: aiResponse,
    };

    setInteractions([...interactions, newInteraction]);
    setCurrentInput("");
    setIsFetching(false);
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
              <div className="flex justify-end">
                <p className="mb-2 py-2 px-4 text-right text-white dark:bg-zinc-800">
                  User: {interaction.userInput}
                </p>
              </div>
              {interaction.aiResponse ? (
                <QueryResponse
                  text={interaction.aiResponse.text}
                  attachments={interaction.aiResponse.attachments}
                />
              ) : (
                <p>Loading response...</p>
              )}
            </div>
          ))}
        </div>
      )}

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        value={currentInput}
        disabled={isFetching}
      />
    </div>
  );
};

export default QueryIntents;
